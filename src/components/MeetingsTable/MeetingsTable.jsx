import React, { useEffect, Fragment, useState } from "react";
import styles from "./MeetingsTable.module.scss";
import MeetingsTableItem from "../MeetingsTableItem/MeetingsTableItem";
import { useSelector, useDispatch } from "react-redux";
import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";
import { TailSpin } from "react-loader-spinner";
import TableMarkup from "../TableMarkup/TableMarkup";
import { v4 as uuidv4 } from "uuid";

import { getTypeSelection } from "../../redux/manager/manager-selectors";
import {
  changeStatusSlot,
  setManagerError,
  setManagerLoading
} from "../../redux/manager/manager-operations";
import { updateSlot } from "../../helpers/week/week";


const MeetingsTable = ({
  isListView,
  tableTime,
  table,
  weekId,
  dayIndex,
  isStatusSorted,
  isTableView,
  currentSelectedSortStatus,
  selectedManagerIds,
  setSelectedManagerIds,
  date,
  getNewTableData
}) => {
  const indefyTimedSlotText = (timeid) => {
    switch (timeid) {
      case 1:
        return "Avaliable";
      case 2:
        return "Working time";
      case 6:
        return "Going on now";
      case 3:
        return "Scheduled";
      case 4:
        return "Confirmed";
      case 7:
        return "Successfully completed";
      case 8:
        return "Conducted unsuccessfully";
      default:
        return "Free";
    }
  };

  let isTableLengthD = false;
  let isMarkUpAdded = false;
  //const [reload, setReload] = useState(false);
  // useEffect(() => {});
  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);
  
  table = table.sort((a, b) => a.manager_name.localeCompare(b.manager_name));
  
  const dispatch = useDispatch();
  const typeSelection = useSelector(getTypeSelection);

  if (isStatusSorted) {
    table = table.filter((item) => {
      return (
        item.manager_appointments[tableTime - 8].status ||
        item.manager_appointments[tableTime - 8].status_id > 0
      );
    });
  }
  if (table.length === 0) {
    isTableLengthD = true;
    return (
      <MeetingsTableItem key={uuidv4()} text={"no data has been founded"} />
    );
  }

  function Fn(id, week, day, time) {
    return new Promise((resolve, reject) => {
      switch (typeSelection) {
        case "Consultations":
          dispatch(setManagerLoading(true));
          updateSlot(id, week, day, time, 1)
            .then(() => {
              dispatch(
                changeStatusSlot({
                  day,
                  time,
                  colorId: 1,
                })
              );
              resolve(); // Розділено виклик resolve після успішного виконання
            })
            .catch((error) => {
              dispatch(setManagerError(error.message));
              reject(error); // Розділено виклик reject у випадку помилки
            })
            .finally(() => dispatch(setManagerLoading(false)));
          break;
        case "Free":
          dispatch(setManagerLoading(true));
          updateSlot(id, week, day, time, 0)
            .then(() => {
              dispatch(
                changeStatusSlot({
                  day,
                  time,
                  colorId: 0,
                })
              );
              resolve(); // Розділено виклик resolve після успішного виконання
            })
            .catch((error) => {
              dispatch(setManagerError(error.message));
              reject(error); // Розділено виклик reject у випадку помилки
            })
            .finally(() => dispatch(setManagerLoading(false)));
          break;
        default:
          break;
      }
    });
  }

  return (
    <div key={uuidv4()} className={styles.wrapperTable}>
      {(managerLoading || callerLoading) && (
        <div className={styles.spinner}>
        <TailSpin height="130px" width="130px" color="#999DFF" />
        </div>
      )}
      <ul
        key={uuidv4()}
        className={!isListView ? styles.table : styles.table_list}
      >
        {table.map((item) => {
          let tiemedSlot = undefined;

          if (isListView) {
            tiemedSlot = item.manager_appointments.find((appointment) => {
              return appointment.time === tableTime;
            });
          }
          let timedSlotText;
          if (isListView) {
            timedSlotText = indefyTimedSlotText(
              tiemedSlot.status ? tiemedSlot.status : tiemedSlot.status_id
            );
          }

          return (
            <React.Fragment key={uuidv4()}>
              {isTableView && !isMarkUpAdded && (
                <>
                  {(isMarkUpAdded = true)}
                  <TableMarkup key={uuidv4()} />
                </>
              )}

              {currentSelectedSortStatus &&
              selectedManagerIds.includes(item.manager_id) === false ? (
                <></>
              ) : (
                <ul key={uuidv4()} className={styles.managerUl}>
                  <MeetingsTableItem
                    key={uuidv4()}
                    selectedManagerIds={selectedManagerIds}
                    setSelectedManagerIds={setSelectedManagerIds}
                    currentSelectedSortStatus={currentSelectedSortStatus}
                    isManagerSelectedFr={selectedManagerIds.includes(
                      item.manager_id
                    )}
                    text={item.manager_name}
                    managerId={item.manager_id}
                    managerName={true}
                    date={date}
                  />

                  {isTableLengthD ? (
                    <MeetingsTableItem key={uuidv4()} text={"no data"} />
                  ) : isListView && !isTableLengthD ? (
                    <MeetingsTableItem
                      key={uuidv4()}
                      managerId={item.manager_id}
                      selectedManagerIds={selectedManagerIds}
                      setSelectedManagerIds={setSelectedManagerIds}
                      currentSelectedSortStatus={currentSelectedSortStatus}
                      text={timedSlotText}
                      isManagerSelectedFr={selectedManagerIds.includes(
                        item.manager_id
                      )}
                      weekId={weekId}
                      dayIndex={dayIndex}
                      date={date}
                      hourIndex={tiemedSlot.time}
                      colorId={tiemedSlot.status_id || tiemedSlot.status}
                      slotId={tiemedSlot.slot_id}
                    />
                  ) : (
                    item.manager_appointments.map((i) => (
                      <MeetingsTableItem
                        key={uuidv4()}
                        managerId={item.manager_id}
                        selectedManagerIds={selectedManagerIds}
                        setSelectedManagerIds={setSelectedManagerIds}
                        isManagerSelectedFr={selectedManagerIds.includes(
                          item.manager_id
                        )}
                        currentSelectedSortStatus={currentSelectedSortStatus}
                        text={i.text}
                        weekId={weekId}
                        slotId={i.slot_id}
                        dayIndex={dayIndex}
                        date={date}
                        hourIndex={i.time}
                        colorId={i.status_id || i.status}
                        isFollowUp={i.follow_up}
                        // handleReload={()=> setReload(!reload)}
                        // onClickFn={()=> {Fn(item.manager_id, weekId, dayIndex, i.time)}}
                        onClickFn={() => {
                          Fn(item.manager_id, weekId, dayIndex, i.time)
                            .then(() => getNewTableData(parseInt(date.split('.')[0], 10), parseInt(date.split('.')[1], 10), parseInt(date.split('.')[2], 10)))
                            .catch((error) => console.error("Error:", error));
                        }}
                      />
                    ))
                  )}
                </ul>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default MeetingsTable;
