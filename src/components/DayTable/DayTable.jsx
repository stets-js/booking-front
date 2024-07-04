import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./DayTable.module.scss";
import TableItem from "../TableItem/TableItem";
import { useSelector } from "react-redux";
import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";
import { TailSpin } from "react-loader-spinner";


const DayTable = ({
  postponed,
  weekId,
  table,
  onClickSlotFn,
  consultation,
  caller,
  isAppointment,
  dayIndex,
  handleReload,
  courseId,
  teamCalendar,
}) => {
  useEffect(() => {});
  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);
  return (
    <div className={styles.wrapperTable}>
      {(managerLoading || callerLoading) && (
        <div className={styles.spinner}>
          <TailSpin height="57" width="57" color="#999DFF" />
        </div>
      )}
      <ul className={styles.table}>
        {table.map((item, hourIndex) => {
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
                  hourIndex={table[hourIndex].time}
                  slotId={item.slot_id}
                  dayIndex={dayIndex}
                  slots={item?.slots}
                  courseId={courseId}
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
              ) : teamCalendar? (
                <TableItem
                  isAppointment={isAppointment}
                  postponed={postponed}
                  onClickFn={onClickSlotFn}
                  data={item.time}
                  weekId={weekId}
                  colorId={item.amount}
                  teamCalendar={teamCalendar}
                  hourIndex={table[hourIndex].time}
                  slotId={item.slot_id}
                  dayIndex={dayIndex}
                  slots={item?.slots}
                  courseId={courseId}
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
        })}
      </ul>
    </div>
  );
};

DayTable.propTypes = {
  table: PropTypes.array.isRequired,
  onClickSlotFn: PropTypes.func,
};

export default DayTable;
