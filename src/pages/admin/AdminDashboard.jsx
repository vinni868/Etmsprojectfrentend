import {
  FaBook,
  FaChalkboardTeacher,
  FaUsers,
  FaBell
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState({
    totalCourses: 0,
    totalTrainers: 0,
    totalStudents: 0,
    activeBatches: 0
  });

  const [users, setUsers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);
  const API = "http://localhost:8080/api/admin";

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchDashboardData();
    fetchAllUsers();
  }, []);

  // ================= FETCH DASHBOARD =================
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard`);
      setData(response.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  // ================= SORT USERS (PENDING FIRST) =================
  const sortUsersByStatus = (userList) => {
    const statusPriority = {
      PENDING: 1,
      ACTIVE: 2,
      REJECTED: 3
    };

    return [...userList].sort(
      (a, b) =>
        statusPriority[a.status] - statusPriority[b.status]
    );
  };

  // ================= FETCH ALL USERS =================
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API}/all-users`);
      const allUsers = res.data;

      const sortedUsers = sortUsersByStatus(allUsers);
      setUsers(sortedUsers);

      recalculateCounts(sortedUsers);

    } catch (err) {
      console.error("Users fetch error", err);
    }
  };

  // ================= APPROVE USER =================
  const approveUser = async (id) => {
    try {
      await axios.put(`${API}/approve-user/${id}`);

      const updatedUsers = users.map(u =>
        u.id === id ? { ...u, status: "ACTIVE" } : u
      );

      const sortedUsers = sortUsersByStatus(updatedUsers);
      setUsers(sortedUsers);

      recalculateCounts(sortedUsers);

    } catch (err) {
      console.error("Approve error", err);
    }
  };

  // ================= REJECT USER =================
  const rejectUser = async (id) => {
    try {
      await axios.put(`${API}/reject-user/${id}`);

      const updatedUsers = users.map(u =>
        u.id === id ? { ...u, status: "REJECTED" } : u
      );

      const sortedUsers = sortUsersByStatus(updatedUsers);
      setUsers(sortedUsers);

      recalculateCounts(sortedUsers);

    } catch (err) {
      console.error("Reject error", err);
    }
  };

  // ================= RECALCULATE COUNTS =================
  const recalculateCounts = (allUsers) => {
    const activeStudents = allUsers.filter(
      u => u.status === "ACTIVE" && u.role?.roleName === "STUDENT"
    ).length;

    const activeTrainers = allUsers.filter(
      u => u.status === "ACTIVE" && u.role?.roleName === "TRAINER"
    ).length;

    const pending = allUsers.filter(
      u => u.status === "PENDING"
    ).length;

    setData(prev => ({
      ...prev,
      totalStudents: activeStudents,
      totalTrainers: activeTrainers
    }));

    setPendingCount(pending);
  };

  // ================= NOTIFICATION TOGGLE =================
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="admin-dashboard-wrapper">

      {/* ================= HEADER ================= */}
      <div className="top-header-card">
        <div>
          <h1>Admin Dashboard</h1>
          <span>Welcome, {user?.name || "Admin"}</span>
        </div>

        <div
          ref={notificationRef}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <FaBell size={22} onClick={toggleNotifications} />

          {pendingCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-8px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px"
            }}>
              {pendingCount}
            </span>
          )}

          {showNotifications && (
            <div style={{
              position: "absolute",
              top: "35px",
              right: "0",
              width: "300px",
              background: "#fff",
              padding: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              borderRadius: "8px"
            }}>
              {users
                .filter(u => u.status === "PENDING")
                .map(u => (
                  <div key={u.id} style={{ marginBottom: "8px" }}>
                    <span>
                      <strong>{u.name}</strong> registered as{" "}
                      <strong>{u.role?.roleName}</strong>, waiting for approval
                    </span>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaBook />
          <div>Total Courses</div>
          <h2>{data.totalCourses}</h2>
        </div>

        <div className="stat-card">
          <FaChalkboardTeacher />
          <div>Total Trainers</div>
          <h2>{data.totalTrainers}</h2>
        </div>

        <div className="stat-card">
          <FaUsers />
          <div>Total Students</div>
          <h2>{data.totalStudents}</h2>
        </div>

        <div className="stat-card">
          <FaUsers />
          <div>Active Batches</div>
          <h2>{data.activeBatches}</h2>
        </div>
      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="user-approvals-section">
        <div className="user-approvals-card">
          <h2>User Approvals</h2>

          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role?.roleName}</td>

                    <td className={`status-${u.status.toLowerCase()}`}>
                      {u.status}
                    </td>

                    <td>
                      {u.status === "ACTIVE" && (
                        <span className="completed-text">
                          Approved
                        </span>
                      )}

                      {u.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => approveUser(u.id)}
                            className="action-btn approve-btn"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectUser(u.id)}
                            className="action-btn reject-btn"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {u.status === "REJECTED" && (
                        <button
                          onClick={() => approveUser(u.id)}
                          className="action-btn approve-btn"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;