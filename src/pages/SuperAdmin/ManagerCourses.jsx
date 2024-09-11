import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManagerCourses.module.scss";

const ManagerCourses = () => {
  const [managers, setManagers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get("/manager_courses")
      .then((response) => {
        setManagers(response.data.managers);
        setCourses(response.data.courses);
        setFilteredData(response.data.managers);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleFilterChange = () => {
    let data = managers;

    // Фільтруємо по назві курсу
    if (selectedCourse) {
      const selectedCourseName =
        courses.find((course) => course.id === Number(selectedCourse))?.name ||
        "";
      data = data.filter((manager) =>
        manager.courses.includes(selectedCourseName)
      );
    }

    if (selectedManager) {
      data = data.filter((manager) => manager.name === selectedManager);
    }

    if (selectedTeam) {
      data = data.filter((manager) => manager.team === Number(selectedTeam));
    }

    setFilteredData(data);
    if (data.length <= 30) {
        setPage(1);
      }
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCourse, selectedManager, selectedTeam]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleManagerChange = (event) => {
    setSelectedManager(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleReset = () => {
    setSelectedCourse("");
    setSelectedManager("");
    setSelectedTeam("");
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <div>
          <label className={styles.label} htmlFor="course-select">
            Course
          </label>
          <select
            className={styles.select}
            id="course-select"
            onChange={handleCourseChange}
            value={selectedCourse}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label} htmlFor="manager-select">
            Manager name
          </label>
          <select
            className={styles.select}
            id="manager-select"
            onChange={handleManagerChange}
            value={selectedManager}
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.name}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label} htmlFor="team-select">
            Team
          </label>
          <select
            className={styles.select}
            id="team-select"
            onChange={handleTeamChange}
            value={selectedTeam}
          >
            <option value="">Select Team</option>
            {[...new Set(managers.map((manager) => manager.team))].map(
              (team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              )
            )}
          </select>
        </div>

        <button className={styles.reset} onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className={styles.content__wrappeer}>
        {filteredData.slice((page - 1) * 30, page * 30).map((manager) => (
          <div className={styles.content} key={manager.id}>
            <div className={styles.courses}>{manager.courses.join(", ")}</div>
            <div className={styles.manager}>{manager.name}</div>
            <div className={styles.team}>{manager.team}</div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={filteredData.length <= page * 30}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManagerCourses;
