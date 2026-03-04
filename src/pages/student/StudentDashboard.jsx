import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef();
  const profileRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setShowNotif(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="student-dashboard">

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">

        <div className="header-left">
          <h1>Welcome back, {user?.name || "Student"}</h1>
          <p>Here’s what’s happening with your learning today.</p>
        </div>

        <div className="header-right">

          {/* NOTIFICATION */}
          <div
            className="notification-wrapper"
            ref={notifRef}
          >
            <div
              className="icon-button"
              onClick={() => setShowNotif(!showNotif)}
            >
              🔔
             
            </div>

            {showNotif && (
              <div className="dropdown">
                <h4>Notifications</h4>
                <p>📘 New Java assignment uploaded</p>
                <p>📅 Tomorrow: React class at 10AM</p>
                <p>📝 Attendance marked today</p>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div
            className="profile-wrapper"
            ref={profileRef}
          >
            <div
              className="profile-circle"
              onClick={() => setShowProfile(!showProfile)}
            >
              {user?.name?.charAt(0)}
            </div>

            {showProfile && (
              <div className="dropdown profile-dropdown">
                <h4>{user?.name}</h4>
                <p>{user?.email}</p>
                <hr />
                <button onClick={() => navigate("/student/profile")}>
                  👤 My Profile
                </button>
                <button onClick={() => navigate("/change-password")}>
                  🔑 Change Password
                </button>
                <button
                  className="logout-btn"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>3</h3>
          <p>Total Courses</p>
        </div>

        <div className="stat-card">
          <h3>82%</h3>
          <p>Attendance</p>
        </div>

        <div className="stat-card">
          <h3>2</h3>
          <p>Pending Assignments</p>
        </div>

        <div className="stat-card">
          <h3>74%</h3>
          <p>Overall Progress</p>
        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="dashboard-main">

        {/* Quick Actions */}
        <div className="card">
          <h2>Quick Actions</h2>

          <button onClick={() => navigate("/student/courses")}>
            View Courses
          </button>

          <button onClick={() => navigate("/student/attendance")}>
            View Attendance
          </button>

          <button onClick={() => navigate("/student/assignments")}>
            View Assignments
          </button>
        </div>

        {/* Progress */}
        <div className="card">
          <h2>Learning Progress</h2>

          <div className="progress-bar-container">
            <div className="progress-bar" />
          </div>

          <span>74% Completed</span>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2>Recent Activity</h2>
          <ul>
            <li>Assignment 1 submitted</li>
            <li>Attended Java Class</li>
            <li>Completed React Module</li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;