import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCallerDate,
  getTable,
  getWeekId,
} from "../../redux/caller/caller-selectors";
import { getTeamCalendarWeek } from "../../redux/caller/caller-operations";
import Header from "../../components/Header/Header";
import styles from "./TeamCalendar.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import DatePicker from "../../components/DatePicker/DatePicker";
import Table from "../../components/Table/Table";
import DayTable from "../../components/DayTable/DayTable";
import Days from "../../components/Days/Days";
import DaysPicker from "../../components/DaysPicker/DaysPicker";
import "react-calendar/dist/Calendar.css";
import path from "../../helpers/routerPath";
import { getGroups } from "../../helpers/course/course";

export default function TeamCalendar() {
  const tableDate = useSelector(getCallerDate);
  const table = useSelector(getTable);
  const weekId = useSelector(getWeekId);
  const dispatch = useDispatch();
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedManager, setSelectedManager] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [teamsAndManagers, setTeamsAndManagers] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [isGroupSelectorDisabled, setIsGroupSelectorDisabled] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    if (weekId) {
      dispatch(
        getTeamCalendarWeek({
          weekId,
          team: selectedTeam !== "All" ? selectedTeam : null,
          manager: selectedManager !== "All" ? selectedManager : null,
          course: selectedCourse !== "All" ? selectedCourse : null,
          group: selectedGroup !== "All" ? selectedGroup : null,
        })
      )
        .then((response) => {
          if (response.payload.teamsAndManagers) {
            setTeamsAndManagers(response.payload.teamsAndManagers);
          }
          if (response.payload.allCourses) {
            setAllCourses(response.payload.allCourses);
          }
        })
        .finally(() => setDataLoading(false));
    }
  }, [dispatch, weekId, selectedTeam, selectedManager, selectedCourse, selectedGroup]);

  useEffect(() => {
    getGroups()
      .then((groups) => setAllGroups(groups.data))
      .catch((error) => console.error("Failed to fetch groups", error));
  }, []);

  useEffect(() => {
    // Disable group selector if Team, Manager, or Course is not "All"
    setIsGroupSelectorDisabled(selectedCourse !== "All");
  }, [selectedTeam, selectedManager, selectedCourse]);

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setSelectedManager("All");
    setSelectedCourse("All");
    setSelectedGroup("All");
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  return (
    <>
      <Header
        endpoints={[
          { text: "Users", path: path.users },
          { text: "Available Managers", path: path.available },
          { text: "Groups", path: path.groups },
          { text: "Courses", path: path.courses },
          { text: "Search by CRM", path: path.crm },
          { text: "Current Meetings", path: path.currentManagers },
          { text: "History", path: path.history },
          { text: "Team calendar", path: path.teamCalendar },
        ]}
      />
      <div className={styles.main__wrapper}>
        <BgWrapper top={-160} />
        <section className={styles.tableSection}>
          {dataLoading ? <div className={styles.loadingBackdrop}></div> : null}
          <div className={styles.selectWrapper}>
            <p className={styles.selectLabel}>Team:</p>
            <select
              className={styles.teams__select}
              value={selectedTeam}
              onChange={handleTeamChange}
            >
              <option value="All">All</option>
              {Object.keys(teamsAndManagers).map((teamId) => (
                <option value={teamId} key={teamId}>{`Team ${teamId}`}</option>
              ))}
            </select>
            <p className={styles.selectLabel}>Manager:</p>
            <select
              className={styles.managers__select}
              value={selectedManager}
              onChange={handleManagerChange}
            >
              <option value="All">All</option>
              {selectedTeam !== "All" &&
                teamsAndManagers[selectedTeam] &&
                teamsAndManagers[selectedTeam].map((manager) => (
                  <option value={manager} key={manager}>
                    {manager}
                  </option>
                ))}
            </select>
            <p className={styles.selectLabel}>Course:</p>
            <select
              className={styles.courses__select}
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="All">All</option>
              {allCourses.map((course) => (
                <option value={course} key={course}>
                  {course}
                </option>
              ))}
            </select>
            <p className={styles.selectLabel}>Course group:</p>
            <select
              className={styles.groups__select}
              value={selectedGroup}
              onChange={handleGroupChange}
              disabled={isGroupSelectorDisabled}
            >
              <option value="All">All</option>
              {allGroups.map((group) => (
                <option value={group} key={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          <DatePicker
            changeDateFn={getTeamCalendarWeek}
            tableDate={tableDate}
            caller
          />
          {window.innerWidth > 1100 ? (
            <Days caller />
          ) : (
            <DaysPicker setDayIndex={setDayIndex} caller />
          )}
          {window.innerWidth > 1100 ? (
            <Table table={table} weekId={weekId} teamCalendar />
          ) : (
            <DayTable
              weekId={weekId}
              table={table[currentDayIndex]}
              dayIndex={currentDayIndex}
              teamCalendar
            />
          )}
        </section>
      </div>
    </>
  );
}
