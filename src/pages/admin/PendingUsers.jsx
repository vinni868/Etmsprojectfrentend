import { useEffect, useState } from "react";
import api from "../../api/axiosConfig"; 
import { FaCheck, FaTimes, FaUserClock, FaEnvelope, FaUserShield } from "react-icons/fa";
import "./PendingUsers.css";

function PendingUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/pending-users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching pending users:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    if (!window.confirm("Approve this user for system access?")) return;
    try {
      await api.put(`/admin/approve-user/${id}`);
      setMessage("User approved successfully!");
      fetchUsers();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Approval failed.");
    }
  };

  const rejectUser = async (id) => {
    if (!window.confirm("Are you sure you want to reject this registration?")) return;
    try {
      await api.put(`/admin/reject-user/${id}`);
      setMessage("User request rejected.");
      fetchUsers();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Rejection failed.");
    }
  };

  return (
    <div className="etms-container">
      <div className="pending-wrapper">
        <div className="etms-card">
          <div className="pending-header">
            <div className="header-title-box">
              <FaUserClock className="header-icon" />
              <div>
                <h2>Pending Approvals</h2>
                <p>Review and authorize new user registrations</p>
              </div>
            </div>
            <div className="user-count-badge">
              {users.length} Requests
            </div>
          </div>

          {message && <div className="etms-alert success">{message}</div>}

          <div className="table-responsive">
            <table className="etms-table">
              <thead>
                <tr>
                  <th><FaUserShield /> Full Name</th>
                  <th><FaEnvelope /> Email Address</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Loading requests...</td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="fade-in">
                      <td className="font-semibold">{user.name}</td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <span className={`role-pill ${user.role?.roleName?.toLowerCase()}`}>
                          {user.role?.roleName}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="action-btn-group">
                          <button 
                            className="btn-approve" 
                            onClick={() => approveUser(user.id)}
                            title="Approve User"
                          >
                            <FaCheck /> Approve
                          </button>
                          <button 
                            className="btn-reject" 
                            onClick={() => rejectUser(user.id)}
                            title="Reject User"
                          >
                            <FaTimes /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-row">
                      No pending approval requests at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingUsers;