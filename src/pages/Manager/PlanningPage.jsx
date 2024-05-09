import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { success, error, defaults } from "@pnotify/core";
import { useSelector, useDispatch } from "react-redux";
import "react-calendar/dist/Calendar.css";
import styles from "./ManagerPage.module.scss";
import Table from "../../components/Table/Table";
import DayTable from "../../components/DayTable/DayTable";
import {
  getDate,
  getTable,
  getTypeSelection,
  getWeekId,
  getSavedTemplateDate,
  getSavedTemplateText,
} from "../../redux/manager/manager-selectors";
import {
  getManagerCurrentWeek,
  changeStatusSlot,
  setManagerError,
  setManagerLoading,
  getManagerTable,
  setSavedTemplate,
  getManagerWeek,
} from "../../redux/manager/manager-operations";
import { updateSlot, saveTable, getWeekTable } from "../../helpers/week/week";
import {getSlotInfo} from "../../helpers/slot/slot";
import Button from "../../components/Buttons/Buttons";
import ControlButtons from "../../components/ControlButtons/ControlButtons";
import DatePicker from "../../components/DatePicker/DatePicker";
import Days from "../../components/Days/Days";
import DaysPicker from "../../components/DaysPicker/DaysPicker";

import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";

const PlanningPage = () => {
  const { managerId } = useParams();
  const managerTable = new FormData();
  const dispatch = useDispatch();
  const templateText = useSelector(getSavedTemplateText);
  const templateDate = useSelector(getSavedTemplateDate);
  const tableDate = useSelector(getDate);
  const table = useSelector(getTable);
  const typeSelection = useSelector(getTypeSelection);
  const weekId = useSelector(getWeekId);

  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);

  const onSavedTemplate = () => {
    managerTable.append("template", JSON.stringify(table));
    managerTable.append(
      "date",
      `${
        new Date().getDate() < 10
          ? `0${new Date().getDate()}`
          : new Date().getDate()
      }.${
        new Date().getMonth() + 1 < 10
          ? `0${new Date().getMonth() + 1}`
          : new Date().getMonth() + 1
      }.${new Date().getFullYear()}`
    );
    dispatch(setManagerLoading(true));
    saveTable(managerId, managerTable)
      .then((data) => {
        dispatch(
          setSavedTemplate({
            text: "Template created",
            date: data.date,
          })
        );
      })
      .catch((err) => dispatch(setManagerError(err.message)))
      .finally(() => dispatch(setManagerLoading(false)));
  };
  const getTemplate = () => {
    table.map((day, dayIndex) =>
      day.map((item, hourIndex) => {
        return item.color === 1 || item.color === 2
          ? updateSlot(
              managerId,
              weekId,
              dayIndex,
              table[dayIndex][hourIndex].time,
              0
            )
          : item;
      })
    );
    return dispatch(getManagerTable({ managerId, weekId }));
  };

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  const onClickSlot = (dayIndex, hourIndex) => {
    switch (typeSelection) {
      case "Consultations":
        dispatch(setManagerLoading(true));
        return updateSlot(
          managerId,
          weekId,
          dayIndex,
          table[dayIndex][hourIndex].time,
          1
        )
          .then(() => {
            dispatch(
              changeStatusSlot({
                dayIndex,
                hourIndex,
                colorId: 1,
              })
            );
          })
          .catch((err) => dispatch(setManagerError(err.message)))
          .finally(() => dispatch(setManagerLoading(false)));
      case "Working time":
        dispatch(setManagerLoading(true));
        return updateSlot(
          managerId,
          weekId,
          dayIndex,
          table[dayIndex][hourIndex].time,
          2
        )
          .then((data) => {
            dispatch(
              changeStatusSlot({
                dayIndex,
                hourIndex,
                colorId: 2,
              })
            );
          })
          .catch((err) => dispatch(setManagerError(err.message)))
          .finally(() => dispatch(setManagerLoading(false)));
      case "Free":
        dispatch(setManagerLoading(true));
  getSlotInfo(managerId, weekId, dayIndex, table[dayIndex][hourIndex].time)
    .then((slotInfo) => {
      console.log("slotInfo", slotInfo)
      if (slotInfo.data.status_id > 2) {
        error("Slot is occupied");
      } else {
        updateSlot(
          managerId,
          weekId,
          dayIndex,
          table[dayIndex][hourIndex].time,
          0
        )
        .then(() => {
          dispatch(
            changeStatusSlot({
              dayIndex,
              hourIndex,
              colorId: 0,
            })
          );
        })
        .catch((err) => dispatch(setManagerError(err.message)))
        .finally(() => dispatch(setManagerLoading(false)));
      }
    })
    .catch((err) => dispatch(setManagerError(err.message))).finally(() => dispatch(setManagerLoading(false)));
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(getManagerCurrentWeek(+managerId));
    getWeekTable(+managerId)
      .then((data) => {
        if (!data) {
          dispatch(setManagerError());
        }
        return dispatch(
          setSavedTemplate({
            text: "Template created",
            date: data.data.saved_date,
          })
        );
      })
      .catch((err) => {
        return dispatch(setManagerError(err.message));
      });
  }, [dispatch, managerId]);

  const activeClassnames = (templateText) => {
    return classNames(styles.tableButton, {
      [styles.tableButtonDisabled]: templateText === "No template",
    });
  };
  
  return (
    <section className={styles.tableSection}>
      <ControlButtons />
      {managerLoading || callerLoading ? <div className={styles.loadingBackdrop}></div> : null}
      <DatePicker tableDate={tableDate} changeDateFn={getManagerWeek} />
      {window.innerWidth > 1100 ? (
        <Days />
      ) : (
        <DaysPicker setDayIndex={setDayIndex} />
      )}
      {window.innerWidth > 1100 ? (
        <Table table={table} onClickSlotFn={onClickSlot} />
      ) : (
        <DayTable
          table={table[currentDayIndex]}
          dayIndex={currentDayIndex}
          onClickSlotFn={onClickSlot}
        />
      )}
      <h3 className={styles.templateText}>
        {templateText === "Template created"
          ? `${templateText} ${
              new Date(templateDate).getDate() < 10
                ? `0${new Date(templateDate).getDate()}`
                : new Date(templateDate).getDate()
            }.${
              new Date(templateDate).getMonth() + 1 < 10
                ? `0${new Date(templateDate).getMonth() + 1}`
                : new Date(templateDate).getMonth() + 1
            }`
          : templateText}
      </h3>
      <div className={styles.wrapperTableButtons}>
        <Button
          onclick={onSavedTemplate}
          style={styles.tableButton}
          paddingRight={31}
          paddingLeft={31}
          width={"auto"}
          bgColor={"black"}
          color={"white"}
        >
          save as template
        </Button>
        <Button
          disabled={templateText === "No template"}
          onclick={getTemplate}
          style={activeClassnames(templateText)}
          paddingRight={31}
          paddingLeft={31}
          width={"auto"}
          bgColor={"black"}
          color={"white"}
        >
          load a saved template
        </Button>
      </div>
    </section>
  );
};

export default PlanningPage;
