import { useState } from "react";
import "./TrainerPerformance.css";

const demoData = [
  {
    course: "Java Full Stack",
    attendance: 88,
    assignmentCompletion: 76,
    averageScore: 82,
    students: [
      { name: "kavya", score: 92 },
      { name: "vinayaka", score: 85 },
      { name: "avanthi", score: 74 },
      { name: "Sneha", score: 60 },
      { name: "Anjaneya", score: 55 },
    ],
  },
  {
    course: "AIML Developer",
    attendance: 91,
    assignmentCompletion: 83,
    averageScore: 86,
    students: [
      { name: "Vivek", score: 95 },
      { name: "Pooja", score: 88 },
      { name: "Manoj", score: 79 },
      { name: "Divya", score: 69 },
      { name: "Ravi", score: 58 },
    ],
  },
];

function TrainerPerformance() {
  const [selectedCourse, setSelectedCourse] = useState(demoData[0]);

  const topStudents = [...selectedCourse.students]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const lowPerformers = selectedCourse.students.filter(
    (s) => s.score < 60
  );

  return (
    <div className="performance-container">
      <h2>📈 Trainer Performance Dashboard</h2>

      {/* Course Filter */}
      <select
        className="course-filter"
        onChange={(e) =>
          setSelectedCourse(
            demoData.find((c) => c.course === e.target.value)
          )
        }
      >
        {demoData.map((course, index) => (
          <option key={index}>{course.course}</option>
        ))}
      </select>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Attendance</h3>
          <p>{selectedCourse.attendance}%</p>
          <div className="progress-bar">
            <div
              style={{ width: `${selectedCourse.attendance}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Assignment Completion</h3>
          <p>{selectedCourse.assignmentCompletion}%</p>
          <div className="progress-bar">
            <div
              style={{ width: `${selectedCourse.assignmentCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Average Score</h3>
          <p>{selectedCourse.averageScore}%</p>
          <div className="progress-bar">
            <div
              style={{ width: `${selectedCourse.averageScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Top Students */}
      <div className="section">
        <h3>🏆 Top Performers</h3>
        <ul>
          {topStudents.map((student, index) => (
            <li key={index}>
              {student.name} - {student.score}%
            </li>
          ))}
        </ul>
      </div>

      {/* Low Performers */}
      <div className="section alert">
        <h3>⚠️ Students Needing Attention</h3>
        {lowPerformers.length === 0 ? (
          <p>All students are performing well 🎉</p>
        ) : (
          <ul>
            {lowPerformers.map((student, index) => (
              <li key={index}>
                {student.name} - {student.score}%
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TrainerPerformance;