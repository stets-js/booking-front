import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./Table.module.scss";
import TableItem from "../TableItem/TableItem";
import { useSelector } from "react-redux";
import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";
import { TailSpin } from "react-loader-spinner";
import TeamCalendar from "../../pages/SuperAdmin/TeamCalendar";


const Table = ({
  postponed,
  weekId,
  table,
  onClickSlotFn,
  consultation,
  caller,
  onPostpone,
  isAppointment,
  handleReload,
  courseId,
  callerName,
  teamCalendar,
}) => {
  

  // useEffect(() => {});
  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);
  return (
    <div className={styles.wrapperTable}>
      {(managerLoading || callerLoading) && (
        <div className={styles.spinner}>
          <TailSpin height="130px" width="130px" color="#999DFF" />
        </div>
      )}
      <ul className={styles.table}>
        {table.map((day, dayIndex) => {
        
          
          return day.map((item, hourIndex) => {
            
            return (
              <Fragment key={hourIndex}>
                {caller ? (
                  <TableItem
                    isAppointment={isAppointment}
                    postponed={postponed}
                    onClickFn={onClickSlotFn}
                    data={item.time}
                    weekId={weekId}
                    colorId={item.amount}
                    caller={caller}
                    hourIndex={table[dayIndex][hourIndex].time}
                    slotId={item.slots && item.slots[0].id}
                    dayIndex={dayIndex}
                    slots={item?.slots}
                    onPostpone={onPostpone}
                    courseId={courseId}
                    callerName={callerName}
                  />
                ) : consultation ? (
                  <TableItem
                    data={item.time}
                    colorId={item.color}
                    dayIndex={dayIndex}
                    hourIndex={hourIndex}
                    weekId={weekId}
                    consultation
                    slotId={item.slot_id}
                    onClickBtnStart={() => onClickSlotFn(dayIndex, hourIndex)}
                    handleReload={handleReload}
                  />
                ) : teamCalendar ? (
                  <TableItem
                    isAppointment={isAppointment}
                  postponed={postponed}
                  onClickFn={onClickSlotFn}
                  data={item.time}
                  weekId={weekId}
                  colorId={item.amount}
                  hourIndex={table[dayIndex][hourIndex].time}
                  slotId={item.slots && item.slots[0].id}
                  dayIndex={dayIndex}
                  slots={item?.slots}
                  onPostpone={onPostpone}
                  courseId={courseId}
                  callerName={callerName}
                    teamCalendar={teamCalendar}
                  />
                ):(
                  <TableItem
                    onClickFn={() => onClickSlotFn(dayIndex, hourIndex)}
                    data={item.time}
                    colorId={item.color}
                  />
                )}
              </Fragment>
            );
          });
        })}
      </ul>
    </div>
  );
};

Table.propTypes = {
  table: PropTypes.array.isRequired,
  onClickSlotFn: PropTypes.func,
};

export default Table;
