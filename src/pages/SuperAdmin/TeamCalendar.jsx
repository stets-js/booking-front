import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCallerDate,
  getTable,
  getWeekId,
} from "../../redux/caller/caller-selectors";
import { getTeamCalendarWeek } from "../../redux/caller/caller-operations";
import Header from "../../components/Header/Header";
import styles from "../Caller/CallerPage.module.scss";
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

  useEffect(() => {
    console.log("week", weekId)
    if (weekId) {
      dispatch(getTeamCalendarWeek({weekId}));
    }
  }, [weekId, dispatch]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  return (
    <>
      <Header
        endpoints={[
          { text: "Users", path: path.users },
          { text: "Avaliable Managers", path: path.avaliable },
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
          <DatePicker  tableDate={tableDate} />
          {window.innerWidth > 1100 ? (
            <Days />
          ) : (
            <DaysPicker setDayIndex={setDayIndex} />
          )}
          {window.innerWidth > 1100 ? (
            <Table table={table} weekId={weekId} teamCalendar/>
          ) : (
            <DayTable weekId={weekId} table={table[currentDayIndex]} dayIndex={currentDayIndex} />
          )}
        </section>
      </div>
    </>
  );
}
