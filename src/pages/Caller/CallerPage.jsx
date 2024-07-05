import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./CallerPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import { Outlet, useParams } from "react-router-dom";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useSelector, useDispatch } from "react-redux";
import "react-calendar/dist/Calendar.css";
import path from "../../helpers/routerPath";
import Table from "../../components/Table/Table";
import DayTable from "../../components/DayTable/DayTable";
import Days from "../../components/Days/Days";
import DaysPicker from "../../components/DaysPicker/DaysPicker";
import { getUserById } from "../../helpers/user/user";
import {
  getCallerDate,
  getTable,
  getWeekId,
} from "../../redux/caller/caller-selectors";
import { getCallerCurrentWeekByCourse, getCallerWeekByCourse } from "../../redux/caller/caller-operations";
import Select from "../../components/Select/Select";
import { getCourses } from "../../helpers/course/course";
import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";
import CrmLinks from "../../components/CrmLinks/CrmLinks";

export default function CallerPage() {
  const dispatch = useDispatch();
  const { callerId } = useParams();
  const [error, setError] = useState("");
  const [callerName, setCallerName] = useState("");
  const tableDate = useSelector(getCallerDate);
  const table = useSelector(getTable);
  const weekId = useSelector(getWeekId);
  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);
  const [courseId, setCourses] = useState(+callerId === 31 ? 53 : 3);
  const [managerId, setManagerId] = useState("All");

  useEffect(() => {
    dispatch(getCallerCurrentWeekByCourse(courseId));
  }, [courseId, dispatch]);

  useEffect(() => {
    if (weekId) {
      dispatch(
        getCallerWeekByCourse({
          weekId,
          courseId,
          manager: managerId !== "All" ? managerId : null,
        })
      );
    }

    getUserById(+callerId)
      .then((data) => {
        setCallerName(data.data.name);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [dispatch, callerId, courseId, weekId, managerId]);

  const handleCourseChange = (newCourseId) => {
    setCourses(newCourseId);
    setManagerId("All");
  };

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  const managerList = Array.from(
    new Set(
      table.flatMap((day) =>
        day.flatMap((slot) =>
          slot.slots ? slot.slots.map((item) => item.name) : []
        )
      )
    )
  ).sort();

  return (
    <>
      <Header
        endpoints={[
          { text: "Current Meetings", path: path.currentManagers },
          { text: "Search by CRM", path: path.pageCrm },
        ]}
        user={{ name: callerName, role: "Caller" }}
      />
      <Outlet />
      <div className={styles.main__wrapper}>
        <BgWrapper top={-160} title="Caller" />
        <p className={styles.free__places}>
          <span className={styles.free__span}>--</span> - number of free places
        </p>
        <section className={styles.tableSection}>
          {managerLoading || callerLoading ? (
            <div className={styles.loadingBackdrop}></div>
          ) : null}
          <Select
            classname={styles.select__label2}
            value={courseId}
            setValue={handleCourseChange}
            request={getCourses}
            callerName={callerName}
            label="course"
            defaultValue="Select course"
            title="Course:"
          />
          <select
            className={styles.manager__select}
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          >
            <option value="All">All</option>
            {managerList.map((manager, index) => (
              <option key={index} value={manager}>
                {manager}
              </option>
            ))}
          </select>
          <DatePicker
            changeDateFn={getCallerWeekByCourse}
            tableDate={tableDate}
            courseId={courseId}
            caller
          />
          {window.innerWidth > 1100 ? (
            <Days caller />
          ) : (
            <DaysPicker caller setDayIndex={setDayIndex} />
          )}
          {window.innerWidth > 1100 ? (
            <Table
              table={table}
              weekId={weekId}
              courseId={courseId}
              callerName={callerName}
              caller
            />
          ) : (
            <DayTable
              weekId={weekId}
              table={table[currentDayIndex]}
              dayIndex={currentDayIndex}
              courseId={courseId}
              caller
            />
          )}
          {error && <p className={styles.free__places}>{error}</p>}
        </section>
      </div>
    </>
  );
}
