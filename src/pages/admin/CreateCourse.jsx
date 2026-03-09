import { useEffect, useState } from "react";
import api from "../../api/axiosConfig"; 
import { FaEdit, FaTrashAlt, FaRedo, FaSearch, FaCheckCircle, FaDownload, FaFileUpload } from "react-icons/fa";
import "./CreateCourse.css";

function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [courses, setCourses] = useState([]);
  const [inactiveCourses, setInactiveCourses] = useState([]);
  const [viewMode, setViewMode] = useState("ACTIVE");

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        api.get("/admin/courses"),
        api.get("/admin/courses/inactive")
      ]);
      setCourses(activeRes.data);
      setInactiveCourses(inactiveRes.data);
    } catch (err) {
      setError("Failed to load courses.");
    }
  };

  const resetForm = () => {
    setCourseName("");
    setDuration("");
    setDescription("");
    setFile(null);
    setEditingId(null);
    setError("");
    const fileInput = document.getElementById("syllabus-file");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || !duration || description.length < 10) {
      return setError("Please fill all fields correctly.");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("courseName", courseName);
      formData.append("duration", duration);
      formData.append("description", description);
      if (file) formData.append("file", file);

      if (editingId) {
        await api.put(`/admin/courses/${editingId}`, formData);
        setMessage("Course updated successfully!");
      } else {
        await api.post("/admin/course", formData);
        setMessage("Course created successfully!");
      }
      resetForm();
      fetchCourses();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setCourseName(course.courseName);
    setDuration(course.duration);
    setDescription(course.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedCourses = viewMode === "ACTIVE" ? courses : inactiveCourses;
  const filteredCourses = displayedCourses.filter((c) =>
    c.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="etms-container">
      <div className="etms-layout">
        
        {/* LEFT: FORM CARD */}
        <div className="etms-card form-card">
          <h2 className="etms-title">{editingId ? "Edit Course" : "Create Course"}</h2>
          
          {message && <p className="msg-success"><FaCheckCircle /> {message}</p>}
          {error && <p className="msg-error">{error}</p>}

          <form onSubmit={handleSubmit} className="etms-form">
            <div className="etms-group">
              <label>Course Name</label>
              <input 
                type="text" 
                value={courseName} 
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter course name"
              />
            </div>

            <div className="etms-group">
              <label>Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="">Select Duration</option>
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>

            <div className="etms-group">
              <label>Description</label>
              <textarea 
                rows="5" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="char-count">{description.length}/500 characters</span>
            </div>

            <div className="etms-group">
              <label>Upload Syllabus (PDF / DOC / DOCX)</label>
              <input 
                id="syllabus-file"
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
            </div>

            <div className="btn-row">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update Course" : "Create Course"}
              </button>
              {editingId && <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* RIGHT: LIST CARD */}
        <div className="etms-card list-card">
          <div className="list-header">
            <h3>Course Management</h3>
            <div className="toggle-box">
              <button className={viewMode === "ACTIVE" ? "active" : ""} onClick={() => setViewMode("ACTIVE")}>Active</button>
              <button className={viewMode === "INACTIVE" ? "active" : ""} onClick={() => setViewMode("INACTIVE")}>Inactive</button>
            </div>
          </div>

          <div className="search-box">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search course..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="course-scroll">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-row">
                <div className="row-content">
                  <h4>{course.courseName}</h4>
                  <p className="row-meta"><strong>Duration:</strong> {course.duration}</p>
                  <p className="row-desc">{course.description}</p>
                  {course.syllabusFileName && (
                    <span className="dl-text" onClick={() => window.open(`${api.defaults.baseURL}/admin/courses/download/${course.id}`)}>
                      <FaDownload size={12} /> {course.syllabusFileName}
                    </span>
                  )}
                </div>
                <div className="row-btns">
                  {viewMode === "ACTIVE" ? (
                    <>
                      <button className="icon-edit" onClick={() => handleEdit(course)}><FaEdit /></button>
                      <button className="icon-delete" onClick={() => api.delete(`/admin/courses/${course.id}`).then(fetchCourses)}><FaTrashAlt /></button>
                    </>
                  ) : (
                    <button className="icon-restore" onClick={() => api.put(`/admin/courses/reactivate/${course.id}`).then(fetchCourses)}><FaRedo /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CreateCourse;