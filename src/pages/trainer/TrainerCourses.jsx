import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaBell, FaSearch, FaUser, FaKey, FaCog, FaSignOutAlt, 
  FaBookOpen, FaLayerGroup, FaGraduationCap, FaChevronRight 
} from "react-icons/fa";
import "./TrainerCourses.css";

function TrainerCourses() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const trainerId = user?.id;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (trainerId) fetchCourses();
  }, [trainerId]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/courses/${trainerId}`);
      setCourses(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    setSelectedBatch(null);
    setStudents([]);
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/courses/${trainerId}/${course.courseId}/batches`);
      setBatches(res.data);
    } catch (err) { console.error(err); }
  };

  const handleBatchClick = async (batch) => {
    setSelectedBatch(batch);
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/batches/${batch.batchId}/students`);
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="trainer-dashboard-wrapper">
      {/* HEADER SECTION */}
      <header className="dashboard-top-nav">
        <div className="nav-breadcrumb">
          <span onClick={() => navigate("/trainer/dashboard")}>Dashboard</span>
          <FaChevronRight className="divider-icon" />
          <span className="current">Courses & Education</span>
        </div>

        <div className="nav-actions">
          <div className="search-bar-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Quick search..." />
          </div>
          <div className="notification-bell">
            <FaBell />
            <span className="dot"></span>
          </div>
          <div className="user-profile-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="avatar-circle">{user?.name?.charAt(0)}</div>
            {showUserMenu && (
              <div className="profile-dropdown-menu">
                <div className="menu-item" onClick={() => navigate("/trainer/profile")}><FaUser /> Profile</div>
                <div className="menu-item" onClick={() => navigate("/trainer/settings")}><FaCog /> Settings</div>
                <hr />
                <div className="menu-item logout" onClick={() => { localStorage.clear(); navigate("/login"); }}><FaSignOutAlt /> Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="course-explorer-content">
        {/* TOP ROW: COURSE SELECTION (Modern Horizontal Cards) */}
        <section className="course-selection-area">
          <div className="section-header-flex">
            <h2><FaBookOpen /> My Active Courses</h2>
            <span className="count-pill">{courses.length} Courses</span>
          </div>
          <div className="course-horizontal-list">
            {courses.map(course => (
              <div 
                key={course.courseId} 
                className={`modern-course-item ${selectedCourse?.courseId === course.courseId ? 'active' : ''}`}
                onClick={() => handleCourseClick(course)}
              >
                <div className="course-icon-box"><FaGraduationCap /></div>
                <div className="course-text">
                  <h4>{course.courseName}</h4>
                  <p>{course.totalBatches} Assigned Batches</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="management-grid">
          {/* MIDDLE COLUMN: BATCHES */}
          <section className={`batch-explorer ${selectedCourse ? 'visible' : 'hidden'}`}>
            <h3><FaLayerGroup /> Batches for {selectedCourse?.courseName}</h3>
            <div className="batch-list-modern">
              {batches.length > 0 ? (
                batches.map(batch => (
                  <div 
                    key={batch.batchId} 
                    className={`batch-list-item ${selectedBatch?.batchId === batch.batchId ? 'active' : ''}`}
                    onClick={() => handleBatchClick(batch)}
                  >
                    <div className="batch-info">
                      <strong>{batch.batchName}</strong>
                      <span className={`status-label ${batch.status.toLowerCase()}`}>{batch.status}</span>
                    </div>
                    <FaChevronRight className="arrow" />
                  </div>
                ))
              ) : (
                <p className="placeholder-text">Select a course to view batches</p>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: STUDENTS */}
          <section className={`student-explorer ${selectedBatch ? 'visible' : 'hidden'}`}>
             <div className="section-header-flex">
                <h3>Enrolled Students</h3>
                <button className="export-link">Export List</button>
             </div>
             <div className="student-table-container">
                {students.length > 0 ? (
                  <table className="modern-data-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Contact Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id}>
                          <td className="name-cell">
                            <div className="small-avatar">{s.name.charAt(0)}</div>
                            {s.name}
                          </td>
                          <td>{s.email}</td>
                          <td>{s.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-table-state">
                    <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="empty" />
                    <p>Select a batch to view the student roster</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TrainerCourses;