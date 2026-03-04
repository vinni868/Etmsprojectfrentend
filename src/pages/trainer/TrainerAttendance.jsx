import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaUserCheck, FaUserTimes, FaUserClock, 
  FaSave, FaSearch, FaBookReader, FaChartLine, FaFilter, FaUsers, FaFilePdf, FaCalendarAlt, FaHistory, FaEdit
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./TrainerAttendance.css";

function TrainerAttendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const trainerId = user?.id || 3;
  const trainerName = user?.name || "Rajesh Kumar"; 

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [topicTaught, setTopicTaught] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("MARK"); // "MARK" or "HISTORY"
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE FOR EDIT MODE ---
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (trainerId) fetchCourses();
  }, [trainerId]);

  // --- AUTO-CHECK EFFECT ---
  useEffect(() => {
    if (viewMode === "MARK" && selectedBatch && date) {
      checkExistingAttendance();
    }
  }, [selectedBatch, date, viewMode]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/courses/${trainerId}`);
      setCourses(res.data);
    } catch (err) { console.error("Course fetch failed", err); }
  };

  // --- UPDATED: CHECK EXISTING ATTENDANCE LOGIC (FIXED EMAIL MAPPING) ---
  const checkExistingAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/attendance/check?batchId=${selectedBatch}&date=${date}`);
      
      if (res.data && res.data.length > 0) {
        // Attendance exists: Map existing data
        setStudents(res.data.map(item => ({
          id: item.studentId, 
          name: item.studentName || "Student",
          // FIX: Checking multiple possible backend field names for email
          email: item.email || item.studentEmail || item.userEmail || "N/A", 
          status: item.status,
          attendanceId: item.id 
        })));
        setTopicTaught(res.data[0].topic || "");
        setIsEditMode(true);
      } else {
        // No attendance: Fetch fresh list of students for that batch
        setIsEditMode(false);
        setTopicTaught("");
        const freshRes = await axios.get(`http://localhost:8080/api/teacher/batches/${selectedBatch}/students`);
        setStudents(freshRes.data.map(s => ({ 
          ...s, 
          // FIX: Ensure fresh list also maps email correctly
          email: s.email || s.studentEmail || s.userEmail || "N/A",
          status: "PRESENT", 
          attendanceId: null 
        })));
      }
    } catch (err) {
      console.error("Check failed", err);
    } finally { setLoading(false); }
  };

  const handleCourseChange = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedBatch("");
    setStudents([]);
    setAttendanceHistory([]);
    if (!courseId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/courses/${trainerId}/${courseId}/batches`);
      setBatches(res.data);
    } catch (err) { console.error("Batch fetch failed", err); }
  };

  const handleBatchChange = async (batchId) => {
    setSelectedBatch(batchId);
    if (!batchId) { setStudents([]); return; }
  };

  const fetchAttendanceHistory = async () => {
    if (!selectedBatch || !fromDate || !toDate) {
      alert("Please select a batch and a valid date range.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/attendance/history/${selectedBatch}?from=${fromDate}&to=${toDate}`);
      setAttendanceHistory(res.data);
      setViewMode("HISTORY");
    } catch (err) { 
      console.error("History fetch failed", err);
      alert("Could not fetch history.");
    } finally { setLoading(false); }
  };

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const downloadPDF = () => {
    const dataToExport = viewMode === "MARK" ? filteredStudents : attendanceHistory;
    if (dataToExport.length === 0) return alert("No data available to export.");

    const doc = new jsPDF();
    const tableColumn = viewMode === "MARK" 
      ? ["ID", "Student Name", "Email Address", "Status"]
      : ["Date", "Student Name", "Status", "Topic"];
      
    const tableRows = viewMode === "MARK"
      ? dataToExport.map(s => [s.id, s.name, s.email, s.status])
      : dataToExport.map(h => [h.attendanceDate, h.studentName, h.status, h.topic]);

    doc.setFontSize(20);
    doc.setTextColor(93, 95, 239);
    doc.text(viewMode === "MARK" ? "Daily Attendance Report" : "Attendance History Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text(`Trainer: ${trainerName}`, 14, 30);
    doc.text(`Batch: ${batches.find(b => b.batchId == selectedBatch)?.batchName || "N/A"}`, 14, 35);
    if(viewMode === "HISTORY") doc.text(`Range: ${fromDate} to ${toDate}`, 14, 40);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [93, 95, 239] }
    });
    doc.save(`Attendance_Report_${selectedBatch}.pdf`);
  };

  const handleSave = async () => {
    if (!selectedBatch || !topicTaught.trim()) {
      alert("Please select a batch and enter the Lesson Objective.");
      return;
    }
    const payload = students.map(s => ({
      id: s.attendanceId, 
      studentId: s.id, 
      batchId: selectedBatch, 
      attendanceDate: date, 
      status: s.status, 
      topic: topicTaught
    }));
    try {
      await axios.post("http://localhost:8080/api/teacher/attendance/bulk", payload);
      alert(isEditMode ? "Attendance Updated Successfully! 📝" : "Attendance Saved Successfully! ✅");
      checkExistingAttendance(); 
    } catch (err) { alert("Save failed."); }
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="attendance-page-wrapper">
      <div className="attendance-container">
        
        {/* Header Section */}
        <header className="attendance-header-main">
          <div className="header-left">
            <h1 className="page-title">Attendance Management</h1>
            <div className="trainer-info-tags">
              <span className="info-pill gray">ID: {trainerId}</span>
              <span className="info-pill blue">Trainer: {trainerName}</span>
              {isEditMode && viewMode === "MARK" && <span className="info-pill orange" style={{background: '#fff3e0', color: '#f39c12'}}>Edit Mode</span>}
            </div>
          </div>
          <div className="header-right">
            {viewMode === "MARK" && (
              <div className="date-display-box">
                <FaCalendarAlt className="icon-muted" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            )}
            <button className="save-session-btn" onClick={handleSave} disabled={viewMode === "HISTORY"}>
              <FaSave /> {isEditMode ? "Update Session" : "Save Session"}
            </button>
          </div>
        </header>

        {/* Action Strips */}
        <div className="action-strips-container">
          <div className="strip-card stats-card">
            <div className="strip-header"><FaChartLine /> STATS</div>
            <div className="stats-content">
              <div className="stat-group"><small>Total</small> <strong>{students.length}</strong></div>
              <div className="stat-divider"></div>
              <div className="stat-group p"><small>P</small> <strong>{students.filter(s => s.status === 'PRESENT').length}</strong></div>
              <div className="stat-group a"><small>A</small> <strong>{students.filter(s => s.status === 'ABSENT').length}</strong></div>
            </div>
            {viewMode === "MARK" && (
              <div className="bulk-mini-actions">
                <button onClick={() => markAll('PRESENT')} className="bulk-btn p">All P</button>
                <button onClick={() => markAll('ABSENT')} className="bulk-btn a">All A</button>
              </div>
            )}
          </div>

          <div className="strip-card objective-card">
            <div className="strip-header"><FaBookReader /> TOPIC</div>
            <input 
              type="text" 
              className="objective-input"
              placeholder="What are you teaching today?" 
              value={topicTaught}
              onChange={(e) => setTopicTaught(e.target.value)}
              disabled={viewMode === "HISTORY"}
            />
          </div>
        </div>

        {/* Main Workspace */}
        <div className="attendance-workspace">
          
          <aside className="selection-sidebar">
            <div className="sidebar-card">
              <h4 className="sidebar-title"><FaFilter /> Selection</h4>
              <h4 className="sidebar-title"><FaSearch /> Search</h4>
              <div className="form-item">
                <div className="search-wrapper-mini">
                  <input type="text" placeholder="Find student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>

              <div className="form-item">
                <label>Course</label>
                <select value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                </select>
              </div>
              <div className="form-item">
                <label>Batch</label>
                <select value={selectedBatch} onChange={(e) => handleBatchChange(e.target.value)}>
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b.batchId} value={b.batchId}>{b.batchName}</option>)}
                </select>
              </div>

              <div className="sidebar-divider-line" />

              <h4 className="sidebar-title"><FaHistory /> Report Period</h4>
              <div className="date-range-group">
                <div className="form-item mini">
                  <label style={{ fontSize: '12px' }}>From</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <br />
                <div className="form-item mini">
                  <label style={{ fontSize: '12px' }}>To</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
              <button className="view-history-btn" onClick={fetchAttendanceHistory}>
                View History
              </button>

              <div className="sidebar-divider-line" />
              
              <button className="download-pdf-btn" onClick={downloadPDF}>
                 <FaFilePdf /> Export Report
              </button>
            </div>
          </aside>

          <main className="roster-main-section">
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${viewMode === "MARK" ? "active" : ""}`} 
                onClick={() => setViewMode("MARK")}
              >
                <FaEdit /> Mark Attendance
              </button>
              <button 
                className={`tab-btn ${viewMode === "HISTORY" ? "active" : ""}`} 
                onClick={() => setViewMode("HISTORY")}
              >
                <FaHistory /> Attendance History
              </button>
            </div>

            <div className="roster-card">
              {viewMode === "MARK" ? (
                <table className="roster-table-v2">
                  <thead>
                    <tr>
                      <th><FaUsers /> STUDENT</th>
                      <th>EMAIL</th>
                      <th className="center-align">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="3" className="loading-msg">Fetching Data...</td></tr>
                    ) : filteredStudents.length > 0 ? filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-profile-item">
                            <div className="avatar-circle-v2">{student.name ? student.name.charAt(0) : "S"}</div>
                            <div className="student-details">
                               <span className="student-name-v2">{student.name}</span>
                               <span className="student-id-sub">ID: #{student.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="student-email-v2">{student.email}</td>
                        <td>
                          <div className="status-button-group">
                            <button className={`status-btn-v2 p-v2 ${student.status === 'PRESENT' ? 'active' : ''}`} onClick={() => handleStatusChange(student.id, 'PRESENT')}><FaUserCheck /> <span>Present</span></button>
                            <button className={`status-btn-v2 a-v2 ${student.status === 'ABSENT' ? 'active' : ''}`} onClick={() => handleStatusChange(student.id, 'ABSENT')}><FaUserTimes /> <span>Absent</span></button>
                            <button className={`status-btn-v2 l-v2 ${student.status === 'LEAVE' ? 'active' : ''}`} onClick={() => handleStatusChange(student.id, 'LEAVE')}><FaUserClock /> <span>Leave</span></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="empty-row-msg">No students found. Select a batch to load data.</td></tr>
                    )}
                  </tbody>
                </table>
              ) : (
                /* HISTORY TABLE VIEW */
                <table className="roster-table-v2 history">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>STUDENT</th>
                      <th>TOPIC</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="loading-msg">Fetching History...</td></tr>
                    ) : attendanceHistory.length > 0 ? attendanceHistory.map((item, index) => (
                      <tr key={index}>
                        <td>{item.attendanceDate}</td>
                        <td className="student-name-v2">{item.studentName}</td>
                        <td className="student-email-v2">{item.topic}</td>
                        <td>
                          <span className={`history-status-pill ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="empty-row-msg">No history found for this range.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TrainerAttendance;