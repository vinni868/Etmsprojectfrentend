import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaBell, FaSearch, FaSync, FaUser, FaKey, FaCog, FaSignOutAlt, 
  FaUserPlus, FaBook, FaCalendarAlt, FaFileAlt, FaClipboardCheck, FaTasks 
} from "react-icons/fa";
import "./TrainerDashboard.css";

function TrainerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const trainerId = user?.id;

  const [stats, setStats] = useState({ totalBatches: 0, totalStudents: 0, todayClasses: 0 });
  const [schedule, setSchedule] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications] = useState([
    { id: 1, type: 'student', text: 'New student "John Doe" mapped to Java Batch A', time: '2 mins ago' },
    { id: 2, type: 'course', text: 'New Course "Advanced React" assigned to you', time: '1 hour ago' },
    { id: 3, type: 'student', text: 'Student "Alice Smith" added to Python 101', time: '3 hours ago' },
  ]);

  useEffect(() => {
    if (trainerId) {
      fetchDashboard();
      fetchSchedule();
    }
  }, [trainerId]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/dashboard/${trainerId}`);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/teacher/schedule/${trainerId}`);
      setSchedule(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="trainer-dashboard-wrapper">
      {/* FIXED NAVBAR */}
      <header className="trainer-navbar">
        <div className="nav-container">
          <div className="header-left">
            <h1>Welcome back, {user?.name || "Trainer"} 👋</h1>
            <p className="header-subtitle">Your overview for today</p>
          </div>

          <div className="header-right">
            <div className="search-box">
            
              <input type="text" placeholder="Search batches..." />
            </div>

            <div className="nav-actions">
              <div className="icon-button-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
                <FaBell className="nav-icon" />
                <span className="notif-badge">{notifications.length}</span>
                {showNotifications && (
                  <div className="dropdown-menu notification-dropdown">
                    <div className="dropdown-header">Notifications</div>
                    <div className="dropdown-scroll">
                      {notifications.map(n => (
                        <div key={n.id} className="dropdown-item-notif">
                          <div className={`notif-avatar ${n.type}`}>
                            {n.type === 'student' ? <FaUserPlus /> : <FaBook />}
                          </div>
                          <div className="notif-text">
                            <p>{n.text}</p>
                            <span>{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="icon-button-wrapper" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar-btn">{user?.name?.charAt(0) || "T"}</div>
                {showUserMenu && (
                  <div className="dropdown-menu profile-dropdown">
                    <div className="dropdown-item" onClick={() => navigate("/trainer/profile")}><FaUser /> Profile</div>
                    <div className="dropdown-item" onClick={() => navigate("/trainer/settings")}><FaCog /> Settings</div>
                    <hr />
                    <div className="dropdown-item logout" onClick={() => { localStorage.clear(); navigate("/login"); }}><FaSignOutAlt /> Logout</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SINGLE SCROLLABLE AREA */}
      <main className="dashboard-scroll-content">
        <div className="content-inner">
          {/* STATS */}
          <section className="stats-container">
            <div className="stat-card blue">
              <div className="stat-icon-box"><FaBook /></div>
              <div className="stat-data"><label>Total Batches</label><h2>{stats.totalBatches}</h2></div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon-box"><FaUser /></div>
              <div className="stat-data"><label>Total Students</label><h2>{stats.totalStudents}</h2></div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon-box"><FaCalendarAlt /></div>
              <div className="stat-data"><label>Today's Classes</label><h2>{stats.todayClasses}</h2></div>
            </div>
          </section>

          {/* TWO COLUMN GRID */}
          <div className="main-grid-layout">
            <div className="grid-col actions-col">
              <div className="glass-card">
                <div className="card-header">
                  <h3>⚡ Quick Actions</h3>
                  <FaSync className="refresh-icon-btn" onClick={fetchDashboard} />
                </div>
                <div className="action-button-grid">
                  <div className="action-tile" onClick={() => navigate("/trainer/materials")}>
                    <div className="tile-icon icon-orange"><FaFileAlt /></div>
                    <span>Materials</span>
                  </div>
                  <div className="action-tile" onClick={() => navigate("/trainer/attendance")}>
                    <div className="tile-icon icon-teal"><FaClipboardCheck /></div>
                    <span>Attendance</span>
                  </div>
                  <div className="action-tile" onClick={() => navigate("/trainer/assignments")}>
                    <div className="tile-icon icon-indigo"><FaTasks /></div>
                    <span>Tasks</span>
                  </div>
                  <div className="action-tile" onClick={() => navigate("/trainer/course")}>
                    <div className="tile-icon icon-rose"><FaBook /></div>
                    <span>Courses</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-col schedule-col">
              <div className="glass-card">
                <div className="card-header">
                  <h3>📅 Upcoming Schedule</h3>
                  <span className="today-badge">Mar 3</span>
                </div>
                <div className="schedule-timeline">
                  {schedule.length === 0 ? <p className="empty-msg">No classes today.</p> : 
                    schedule.map((item) => (
                      <div key={item.id} className="timeline-card">
                        <div className="timeline-time">
                          <span className="time-val">{item.start_time}</span>
                          <div className="time-indicator"></div>
                        </div>
                        <div className="timeline-content">
                          <div className="content-top">
                            <h4>{item.course_name}</h4>
                            <span className="batch-tag">{item.batch_name}</span>
                          </div>
                          <p>Ends at {item.end_time}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TrainerDashboard;