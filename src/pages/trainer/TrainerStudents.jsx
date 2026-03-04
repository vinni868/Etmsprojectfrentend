import { useEffect, useState } from "react";
import axios from "axios";
import "./TrainerStudents.css";

function TrainerStudents() {

  const user = JSON.parse(localStorage.getItem("user"));
  const trainerId = user?.id;

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/teacher/students/${trainerId}`
    );

    setStudents(res.data);
    setFilteredStudents(res.data);

    // Extract unique courses
    const uniqueCourses = [...new Set(res.data.map(s => s.courseName))];
    setCourses(uniqueCourses);
  };

  // When course changes
  const handleCourseChange = (course) => {
    setSelectedCourse(course);
    setSelectedBatch("");

    const filtered = students.filter(s => s.courseName === course);
    setFilteredStudents(filtered);

    // Extract batches for selected course
    const uniqueBatches = [...new Set(filtered.map(s => s.batchName))];
    setBatches(uniqueBatches);
  };

  // When batch changes
  const handleBatchChange = (batch) => {
    setSelectedBatch(batch);

    const filtered = students.filter(
      s => s.courseName === selectedCourse && s.batchName === batch
    );

    setFilteredStudents(filtered);
  };

  // Reset filter
  const resetFilters = () => {
    setSelectedCourse("");
    setSelectedBatch("");
    setFilteredStudents(students);
  };

  return (
    <div className="trainer-students-container">
      <h2>All My Students</h2>

      {/* FILTER SECTION */}
      <div className="filter-section">

        <select
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>

        {selectedCourse && (
          <select
            value={selectedBatch}
            onChange={(e) => handleBatchChange(e.target.value)}
          >
            <option value="">Select Batch</option>
            {batches.map((batch, index) => (
              <option key={index} value={batch}>{batch}</option>
            ))}
          </select>
        )}

        <button onClick={resetFilters}>Reset</button>

      </div>

      {/* TABLE */}
      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Batch</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={`${student.id}-${student.batchName}`}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.courseName}</td>
                <td>{student.batchName}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="no-data">No students found</div>
        )}
      </div>
    </div>
  );
}

export default TrainerStudents;