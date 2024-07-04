import React, { useEffect, useState, useMemo } from "react";
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

export default function TeamCalendar() {
  const tableDate = useSelector(getCallerDate);
  const table = useSelector(getTable);
  const weekId = useSelector(getWeekId);
  const dispatch = useDispatch();
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedManager, setSelectedManager] = useState("All");
  console.log("selected team", selectedTeam);
  console.log("selected manager", selectedManager);

  useEffect(() => {
    if (weekId && selectedTeam === "All" && selectedManager === "All") {
      dispatch(getTeamCalendarWeek({ weekId }));
    } else if (weekId && selectedTeam !== "All" && selectedManager === "All") {
      dispatch(getTeamCalendarWeek({ weekId, team: selectedTeam }));
    } else if (weekId && selectedTeam !== "All" && selectedManager !== "All") {
      dispatch(getTeamCalendarWeek({ weekId, team: selectedTeam, manager: selectedManager }));
    }
  }, [dispatch, weekId, selectedTeam, selectedManager]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  const teamsAndManagers = useMemo(() => {
    if (!table) return {};

    const teams = {};
    table.forEach(day => {
      if (!day) return;
      day.forEach(slot => {
        if (!slot || !slot.slots) return;
        slot.slots.forEach(manager => {
          const team = manager.team;
          if (!teams[team]) {
            teams[team] = [];
          }
          if (!teams[team].includes(manager.name)) {
            teams[team].push(manager.name);
          }
        });
      });
    });

    return teams;
  }, [table]);

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setSelectedManager("All");
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
  };

  return (
    <>
      <Header
        endpoints={[
          { text: "Users", path: path.users },
          { text: "Available Managers", path: path.avaliable },
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
            <select className={styles.teams__select} value={selectedTeam} onChange={handleTeamChange}>
              <option value="All">All</option>
              {Object.keys(teamsAndManagers).map(team => (
                <option value={team} key={team}>{`Team ${team}`}</option>
              ))}
            </select>
            <select className={styles.managers__select} value={selectedManager} onChange={handleManagerChange}>
              <option value="All">All</option>
              {selectedTeam !== "All" && teamsAndManagers[selectedTeam] && teamsAndManagers[selectedTeam].map(manager => (
                <option value={manager} key={manager}>{manager}</option>
              ))}
            </select>
          </div>
          <DatePicker changeDateFn={getTeamCalendarWeek} tableDate={tableDate} caller />
          {window.innerWidth > 1100 ? (
            <Days caller />
          ) : (
            <DaysPicker setDayIndex={setDayIndex} caller />
          )}
          {window.innerWidth > 1100 ? (
            <Table table={table} weekId={weekId} teamCalendar />
          ) : (
            <DayTable weekId={weekId} table={table[currentDayIndex]} dayIndex={currentDayIndex} teamCalendar />
          )}
        </section>
      </div>
    </>
  );
}
