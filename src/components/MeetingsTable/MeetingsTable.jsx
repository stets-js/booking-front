import React, { useEffect, Fragment, useState, useCallback } from "react";
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
  setManagerLoading,
} from "../../redux/manager/manager-operations";
import { updateSlot } from "../../helpers/week/week";

const MeetingsTable = ({
  isLoading,
  isListView,
  tableTime,
  table,
  weekId,
  dayIndex,
  isStatusSorted,
  isTableView,
  currentSelectedSortStatus,
  currentSelectedStars,
  currentSelectedStarsTable,
  selectedManagerIds,
  setSelectedManagerIds,
  date,
  getNewTableData,
  hideFreeSlots,
}) => {
  const indefyTimedSlotText = (timeid) => {
    switch (timeid) {
      case 1:
        return "Available";
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
  const [managerLoading, setManagerLoading] = useState(false);
  const [callerLoading, setCallerLoading] = useState(false);

  const dispatch = useDispatch();
  const typeSelection = useSelector(getTypeSelection);

  // Виклик useCallback поза умовами
  const Fn = useCallback(
    (id, week, day, time) => {
      return new Promise((resolve, reject) => {
       setManagerLoading(true);
        const statusMap = {
          Consultations: 1,
          "Working time": 2,
          Free: 0,
        };

        const status = statusMap[typeSelection] ?? 0;

        updateSlot(id, week, day, time, status)
          .then(() => {
            dispatch(
              changeStatusSlot({
                day,
                time,
                colorId: status,
              })
            );
            resolve();
          })
          .catch((error) => {
            dispatch(setManagerError(error.message));
            reject(error);
          })
          .finally(() => setManagerLoading(false));
      });
    },
    [dispatch, typeSelection]
  );

  if (isStatusSorted) {
    table = table.filter((item) => {
      return (
        item.manager_appointments[tableTime - 8].status ||
        item.manager_appointments[tableTime - 8].status_id > 0
      );
    });
  }

  if (currentSelectedStars) {
    table = table.filter((item) => {
      return item.manager_appointments[tableTime - 8]?.follow_up === true;
    });
  }

  if (currentSelectedStarsTable) {
    table = table.filter((item) => {
      return item.manager_appointments.some(
        (appointment) => appointment.follow_up === true
      );
    });
  }

  if (hideFreeSlots) {
    table = table.filter((item) => {
      return item.manager_appointments.some(
        (appointment) => appointment.status > 0
      );
    });
  }

  if (table.length === 0) {
    isTableLengthD = true;
    return <MeetingsTableItem key={uuidv4()} text={"No data found"} />;
  }

  return (
    <div key={uuidv4()} className={styles.wrapperTable}>
      {(managerLoading || callerLoading) && (
        <div className={styles.spinner}>
          <TailSpin height="130px" width="130px" color="#999DFF" />
        </div>
      )}
      <div>
        {isLoading ? (
          <div className={styles.loadingBackdrop}>
            <TailSpin height="150px" width="150px" color="#999DFF" />
          </div>
        ) : null}
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
              <Fragment key={uuidv4()}>
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
                      currentSelectedStars={currentSelectedStars}
                      isManagerSelectedFr={selectedManagerIds.includes(
                        item.manager_id
                      )}
                      text={item.manager_name}
                      managerId={item.manager_id}
                      managerName={true}
                      date={date}
                    />

                    {isTableLengthD ? (
                      <MeetingsTableItem key={uuidv4()} text={"No data"} />
                    ) : isListView && !isTableLengthD ? (
                      <MeetingsTableItem
                        key={uuidv4()}
                        managerId={item.manager_id}
                        selectedManagerIds={selectedManagerIds}
                        setSelectedManagerIds={setSelectedManagerIds}
                        currentSelectedSortStatus={currentSelectedSortStatus}
                        currentSelectedStars={currentSelectedStars}
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
                        isFollowUp={tiemedSlot.follow_up}
                        isOnControl={tiemedSlot.on_control}
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
                          currentSelectedStars={currentSelectedStars}
                          text={i.text}
                          weekId={weekId}
                          slotId={i.slot_id}
                          dayIndex={dayIndex}
                          date={date}
                          hourIndex={i.time}
                          colorId={i.status_id || i.status}
                          isFollowUp={i.follow_up}
                          isOnControl={i.on_control}
                          isFreeze={i.is_freeze}
                          onClickFn={() => {
                            Fn(
                              item.manager_id,
                              weekId,
                              dayIndex,
                              i.time
                            )
                              .then(() =>
                                getNewTableData(
                                  parseInt(date.split(".")[0], 10),
                                  parseInt(date.split(".")[1], 10),
                                  parseInt(date.split(".")[2], 10)
                                )
                              )
                              .catch((error) =>
                                console.error("Error:", error)
                              );
                          }}
                        />
                      ))
                    )}
                  </ul>
                )}
              </Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MeetingsTable;
