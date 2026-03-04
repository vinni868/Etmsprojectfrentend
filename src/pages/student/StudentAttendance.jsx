import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentAttendance.css";

function StudentAttendance() {
  // Get logged-in student info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.id;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    attendancePercentage: 0,
  });
  const [loading, setLoading] = useState(false);

  // 1. Fetch courses the student is enrolled in
  useEffect(() => {
    if (studentId) {
      fetchStudentCourses();
    }
  }, [studentId]);

  // 2. Fetch attendance and summary whenever the selected course changes
  useEffect(() => {
    if (studentId && selectedCourse) {
      fetchAttendanceData();
    }
  }, [selectedCourse, studentId]);

  const fetchStudentCourses = async () => {
    try {
      // Adjusted to match common LMS course endpoint
      const res = await axios.get(`http://localhost:8080/api/student/courses/${studentId}`);
      setCourses(res.data);
      if (res.data.length > 0) {
        setSelectedCourse(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Fetch Detailed Records
      const recordsRes = await axios.get(
        `http://localhost:8080/api/student/attendance/${studentId}`
      );
      
      // If your backend filters by course, add the query param. 
      // Otherwise, we filter the list locally to match the selected UI course
      const filteredRecords = recordsRes.data.filter(
        (r) => r.batchId === parseInt(selectedCourse)
      );
      setRecords(filteredRecords);

      // Fetch Summary from the new backend endpoint we created
      const summaryRes = await axios.get(
        `http://localhost:8080/api/student/attendance/summary/${studentId}`
      );
      setSummary(summaryRes.data);
      
    } catch (err) {
      console.error("Failed to fetch attendance data", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <header className="attendance-header">
        <div className="header-content">
          <h2>My Attendance Dashboard</h2>
          <p>Logged in as: <strong>{user?.name || "Student"}</strong></p>
        </div>
      </header>

      {/* Course Selector */}
      <div className="batch-selector-container">
        <div className="selector-box">
          <label>Select Course/Batch:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="attendance-summary">
        <div className="summary-card total">
          <div className="card-icon">📚</div>
          <div className="card-info">
            <h3>{summary.totalClasses}</h3>
            <p>Total Classes</p>
          </div>
        </div>
        <div className="summary-card present">
          <div className="card-icon">✅</div>
          <div className="card-info">
            <h3>{summary.presentCount}</h3>
            <p>Total Present</p>
          </div>
        </div>
        <div className="summary-card percentage">
          <div className="card-icon">📈</div>
          <div className="card-info">
            <h3>{summary.attendancePercentage}%</h3>
            <p>Overall Attendance</p>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching your records...</p>
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Topic Taught</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className="date-cell">
                      {new Date(record.attendanceDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>{record.topic || <span className="no-data">No topic specified</span>}</td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-table">
                    No attendance records found for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StudentAttendance;