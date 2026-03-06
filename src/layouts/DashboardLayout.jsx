import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
import { 
  FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, 
  FaLinkedinIn, FaInstagram, FaGraduationCap, FaSignOutAlt,
  FaChevronDown, FaCog, FaShieldAlt, FaBullhorn, FaUserShield,
  FaChartLine, FaUserCircle, FaBook, FaUsers, FaCalendarAlt, 
  FaFileAlt, FaBriefcase, FaHeadset, FaClipboardList
} from "react-icons/fa";
import "./DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Toggle dropdown on click
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";
  const rolePath = user?.role?.toLowerCase().replace("_", "") || "student";

  return (
    <div className="dashboard-page-wrapper">
      {/* ===== TOP BAR ===== */}
      <div className="top-contact-bar">
        <div className="nav-container-inner">
          <div className="contact-left">
            <span><FaPhoneAlt size={12} /> +91 7022928198</span>
            <span className="v-sep">|</span>
            <span><FaEnvelope size={12} /> appteknow-pcsglobal@gmail.com</span>
          </div>
          <div className="social-right">
            <FaFacebookF /> <FaTwitter /> <FaLinkedinIn /> <FaInstagram />
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="main-dashboard-header">
        <div className="nav-container-inner" ref={dropdownRef}>
          
          {/* 1. LEFT: LOGO */}
          <Link to="/" className="logo-section-left" style={{ textDecoration: 'none' }}>
            <div className="logo-icon-box"><FaGraduationCap /></div>
            <div className="logo-text-group">
              <h1 className="brand-name">EtMS</h1>
              <span className="brand-tagline">SMART LEARNING</span>
            </div>
          </Link>

          {/* 2. CENTER: NAVIGATION */}
          <nav className="header-nav-menu">
            <NavLink to={`/${rolePath}/dashboard`} className="nav-menu-link">📊 Dashboard</NavLink>

            {/* SUPER ADMIN */}
            {user?.role === "SUPER_ADMIN" && (
              <div className="nav-dropdown">
                <button className={`nav-menu-link ${activeDropdown === 'super' ? 'active-btn' : ''}`} onClick={() => toggleDropdown('super')}>
                  <FaShieldAlt /> Governance <FaChevronDown className={`drop-icon ${activeDropdown === 'super' ? 'rotate' : ''}`} />
                </button>
                {activeDropdown === 'super' && (
                  <div className="dropdown-content">
                    <NavLink to="/superadmin/admins" onClick={() => setActiveDropdown(null)}>🛡️ Manage Admins</NavLink>
                    <NavLink to="/superadmin/marketers" onClick={() => setActiveDropdown(null)}>👨‍💼 Manage Marketers</NavLink>
                    <NavLink to="/superadmin/revenue" onClick={() => setActiveDropdown(null)}>💰 Revenue Reports</NavLink>
                    <NavLink to="/superadmin/settings" onClick={() => setActiveDropdown(null)}>⚙️ System Settings</NavLink>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN */}
            {user?.role === "ADMIN" && (
              <div className="nav-dropdown">
                <button className={`nav-menu-link ${activeDropdown === 'admin' ? 'active-btn' : ''}`} onClick={() => toggleDropdown('admin')}>
                  <FaCog /> System Ops <FaChevronDown className={`drop-icon ${activeDropdown === 'admin' ? 'rotate' : ''}`} />
                </button>
                {activeDropdown === 'admin' && (
                  <div className="dropdown-content">
                    <NavLink to="/admin/create-course" onClick={() => setActiveDropdown(null)}>➕ Create Course</NavLink>
                    <NavLink to="/admin/courses" onClick={() => setActiveDropdown(null)}>📚 All Courses</NavLink>
                    <NavLink to="/admin/assign-trainer" onClick={() => setActiveDropdown(null)}>👨‍🏫 Trainer Assignment</NavLink>
                    <NavLink to="/admin/students" onClick={() => setActiveDropdown(null)}>👨‍🎓 Manage Students</NavLink>
                  </div>
                )}
              </div>
            )}

            {/* TRAINER */}
            {user?.role === "TRAINER" && (
              <div className="nav-dropdown">
                <button className={`nav-menu-link ${activeDropdown === 'trainer' ? 'active-btn' : ''}`} onClick={() => toggleDropdown('trainer')}>
                  <FaBook /> Academic <FaChevronDown className={`drop-icon ${activeDropdown === 'trainer' ? 'rotate' : ''}`} />
                </button>
                {activeDropdown === 'trainer' && (
                  <div className="dropdown-content">
                    <NavLink to="/trainer/course" onClick={() => setActiveDropdown(null)}>📚 My Courses</NavLink>
                    <NavLink to="/trainer/attendance" onClick={() => setActiveDropdown(null)}>🗓 Attendance</NavLink>
                    <NavLink to="/trainer/assignments" onClick={() => setActiveDropdown(null)}>📝 Assignments</NavLink>
                    <NavLink to="/trainer/materials" onClick={() => setActiveDropdown(null)}>📂 Study Materials</NavLink>
                  </div>
                )}
              </div>
            )}

            {/* MARKETER */}
            {user?.role === "MARKETER" && (
              <div className="nav-dropdown">
                <button className={`nav-menu-link ${activeDropdown === 'marketing' ? 'active-btn' : ''}`} onClick={() => toggleDropdown('marketing')}>
                  <FaBullhorn /> Marketing <FaChevronDown className={`drop-icon ${activeDropdown === 'marketing' ? 'rotate' : ''}`} />
                </button>
                {activeDropdown === 'marketing' && (
                  <div className="dropdown-content">
                    <NavLink to="/marketer/leads" onClick={() => setActiveDropdown(null)}>🎯 Lead Management</NavLink>
                    <NavLink to="/marketer/campaigns" onClick={() => setActiveDropdown(null)}>📣 Campaigns</NavLink>
                    <NavLink to="/marketer/vouchers" onClick={() => setActiveDropdown(null)}>🎟️ Vouchers</NavLink>
                  </div>
                )}
              </div>
            )}

            {/* COUNSELOR */}
            {user?.role === "COUNSELOR" && (
              <div className="nav-dropdown">
                <button className={`nav-menu-link ${activeDropdown === 'counseling' ? 'active-btn' : ''}`} onClick={() => toggleDropdown('counseling')}>
                  <FaHeadset /> Counseling <FaChevronDown className={`drop-icon ${activeDropdown === 'counseling' ? 'rotate' : ''}`} />
                </button>
                {activeDropdown === 'counseling' && (
                  <div className="dropdown-content">
                    <NavLink to="/counselor/enquiries" onClick={() => setActiveDropdown(null)}>📞 New Enquiries</NavLink>
                    <NavLink to="/counselor/follow-ups" onClick={() => setActiveDropdown(null)}>⏳ Follow-ups</NavLink>
                    <NavLink to="/counselor/admissions" onClick={() => setActiveDropdown(null)}>✅ Admissions</NavLink>
                  </div>
                )}
              </div>
            )}

            {/* STUDENT */}
            {user?.role === "STUDENT" && (
              <>
                <div className="nav-dropdown">
                  <button className={`nav-menu-link ${activeDropdown === 'st-learn' ? 'active-btn' : ''}`} onClick={() => toggleDropdown('st-learn')}>
                    <FaBook /> Learning Hub <FaChevronDown className={`drop-icon ${activeDropdown === 'st-learn' ? 'rotate' : ''}`} />
                  </button>
                  {activeDropdown === 'st-learn' && (
                    <div className="dropdown-content">
                      <NavLink to="/student/courses" onClick={() => setActiveDropdown(null)}>📚 My Courses</NavLink>
                      <NavLink to="/student/attendance" onClick={() => setActiveDropdown(null)}>� Attendance</NavLink>
                      <NavLink to="/student/assignments" onClick={() => setActiveDropdown(null)}>📝 Assignments</NavLink>
                      <NavLink to="/student/results" onClick={() => setActiveDropdown(null)}>📊 Results</NavLink>
                      <NavLink to="/student/materials" onClick={() => setActiveDropdown(null)}>📂 Study Materials</NavLink>
                      <NavLink to="/student/certificates" onClick={() => setActiveDropdown(null)}>🏆 Certificates</NavLink>
                    </div>
                  )}
                </div>

                <div className="nav-dropdown">
                  <button className={`nav-menu-link ${activeDropdown === 'st-hiring' ? 'active-btn' : ''}`} onClick={() => toggleDropdown('st-hiring')}>
                    <FaBriefcase /> Hiring <FaChevronDown className={`drop-icon ${activeDropdown === 'st-hiring' ? 'rotate' : ''}`} />
                  </button>
                  {activeDropdown === 'st-hiring' && (
                    <div className="dropdown-content">
                      <NavLink to="/student/jobs" onClick={() => setActiveDropdown(null)}>🏢 Jobs</NavLink>
                      <NavLink to="/student/internships" onClick={() => setActiveDropdown(null)}>🎓 Internships</NavLink>
                      <NavLink to="/student/interview-prep" onClick={() => setActiveDropdown(null)}>❓ Interview Prep</NavLink>
                    </div>
                  )}
                </div>
              </>
            )}

            <NavLink to={`/${rolePath}/performance`} className="nav-menu-link">📈 Performance</NavLink>
            <NavLink to={`/${rolePath}/profile`} className="nav-menu-link">👤 Profile</NavLink>
          </nav>

          {/* 3. RIGHT: USER ACTIONS */}
          <div className="user-actions-right">
            <div className="user-role-badge">
              <span className="role-text-label">{user?.role?.replace("_", " ")}</span>
              <div className="avatar-circle">{avatarLetter}</div>
            </div>
            <button className="nav-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-view-content">
        <div className="nav-container-inner">
          <div className="content-fluid-wrapper">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;