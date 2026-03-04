import { Outlet, useNavigate, NavLink } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">EtMS</h2>
          <p className="sidebar-role">{user?.role}</p>
        </div>

        <nav className="sidebar-nav-container">
          {/* TRAINER LINKS */}
          {user?.role === "TRAINER" && (
            <>
              <NavLink to="/trainer/dashboard" className="sidebar-nav-link">📊 Dashboard</NavLink>
              <NavLink to="/trainer/profile" className="sidebar-nav-link">👤 Profile</NavLink>
              <NavLink to="/trainer/course" className="sidebar-nav-link">📚 Courses</NavLink>
              <NavLink to="/trainer/manage-students" className="sidebar-nav-link">👨‍🎓 Students</NavLink>
              <NavLink to="/trainer/attendance" className="sidebar-nav-link">🗓 Attendance</NavLink>
              <NavLink to="/trainer/assignments" className="sidebar-nav-link">📝 Assignments</NavLink>
              <NavLink to="/trainer/materials" className="sidebar-nav-link">📂 Study Materials</NavLink>
              <NavLink to="/trainer/timetable" className="sidebar-nav-link">⏰ Timetable</NavLink>
              <NavLink to="/trainer/performance" className="sidebar-nav-link">📈 Performance</NavLink>
              <NavLink to="/trainer/announcements" className="sidebar-nav-link">🔔 Announcements</NavLink>
              <NavLink to="/trainer/reports" className="sidebar-nav-link">📊 Reports</NavLink>
            </>
          )}

          {/* STUDENT LINKS */}
          {user?.role === "STUDENT" && (
            <>
              <NavLink to="/student/dashboard" className="sidebar-nav-link">📊 Dashboard</NavLink>
              <NavLink to="/student/courses" className="sidebar-nav-link">📚 My Courses</NavLink>
              <NavLink to="/student/attendance" className="sidebar-nav-link">🗓 Attendance</NavLink>
              <NavLink to="/student/assignments" className="sidebar-nav-link">📝 Assignments</NavLink>
              <NavLink to="/student/results" className="sidebar-nav-link">📈 Results</NavLink>
              <NavLink to="/student/timetable" className="sidebar-nav-link">⏰ Timetable</NavLink>
              <NavLink to="/student/materials" className="sidebar-nav-link">📂 Study Materials</NavLink>
              <NavLink to="/student/announcements" className="sidebar-nav-link">🔔 Announcements</NavLink>
              <NavLink to="/student/performance" className="sidebar-nav-link">📊 Performance</NavLink>
              <NavLink to="/student/certificates" className="sidebar-nav-link">🏆 Certificates</NavLink>
              <NavLink to="/student/profile" className="sidebar-nav-link">👤 Profile</NavLink>
            </>
          )}

          {/* ADMIN LINKS */}
          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin/dashboard" className="sidebar-nav-link">📊 Dashboard</NavLink>
              <NavLink to="/admin/create-course" className="sidebar-nav-link">➕ Create Course</NavLink>
              <NavLink to="/admin/courses" className="sidebar-nav-link">📚 All Courses</NavLink>
              <NavLink to="/admin/create-batch" className="sidebar-nav-link">🗂 Create Batch</NavLink>
              <NavLink to="/admin/assign-trainer" className="sidebar-nav-link">👨‍🏫 Trainer Assignment</NavLink>
              <NavLink to="/admin/schedule-class" className="sidebar-nav-link">⏰ Schedule Class</NavLink>
              <NavLink to="/admin/students" className="sidebar-nav-link">👨‍🎓 Manage Students</NavLink>
              <NavLink to="/admin/attendance" className="sidebar-nav-link">🗓 Attendance</NavLink>
              <NavLink to="/admin/assignments" className="sidebar-nav-link">📝 Assignments</NavLink>
              <NavLink to="/admin/materials" className="sidebar-nav-link">📂 Study Materials</NavLink>
              <NavLink to="/admin/reports" className="sidebar-nav-link">📊 Reports</NavLink>
              <NavLink to="/admin/performance" className="sidebar-nav-link">📈 Performance</NavLink>
              <NavLink to="/admin/announcements" className="sidebar-nav-link">🔔 Announcements</NavLink>
              <NavLink to="/admin/profile" className="sidebar-nav-link">👤 Profile</NavLink>
            </>
          )}

          {/* SUPER ADMIN LINKS */}
          {user?.role === "SUPER_ADMIN" && (
            <>
              <NavLink to="/superadmin/dashboard" className="sidebar-nav-link">📊 Dashboard</NavLink>
              <NavLink to="/superadmin/create-admin" className="sidebar-nav-link">👨‍💼 Admins</NavLink>
              <NavLink to="/superadmin/courses" className="sidebar-nav-link">📚 Courses</NavLink>
              <NavLink to="/superadmin/revenue" className="sidebar-nav-link">💰 Revenue</NavLink>
              <NavLink to="/superadmin/settings" className="sidebar-nav-link">⚙ System Settings</NavLink>
              <NavLink to="/superadmin/profile" className="sidebar-nav-link">👤 Profile</NavLink>
            </>
          )}

          {/* MARKETER LINKS */}
          {user?.role === "MARKETER" && (
            <>
              <NavLink to="/marketer/dashboard" className="sidebar-nav-link">📊 Dashboard</NavLink>
              <NavLink to="/marketer/leads" className="sidebar-nav-link">📋 All Leads</NavLink>
              <NavLink to="/marketer/analytics" className="sidebar-nav-link">📈 Analytics</NavLink>
              <NavLink to="/marketer/profile" className="sidebar-nav-link">👤 Profile</NavLink>
            </>
          )}
        </nav>

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;