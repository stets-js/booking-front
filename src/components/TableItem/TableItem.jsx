import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./TableItem.module.scss";
import ConsultationInfo from "../../components/modals/ConsultationInfo/ConsultationInfo";
import NewAppointment from "../../components/modals/NewAppointment2/NewAppointment";
import WorkingInfo from "../../components/modals/WorkingInfo/WorkingInfo"

const TableItem = ({
  data,
  colorId,
  onClickFn,
  consultation,
  caller,
  weekId,
  dayIndex,
  hourIndex,
  slotId,
  onClickBtnStart,
  onPostpone,
  postponed,
  slots,
  handleReload,
  courseId,
  callerName,
  teamCalendar,
  courseName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState("");

  const activeClassnames = (colorId) => {
    return classNames(styles.item, {
      [styles.grayColor]: +colorId === 0,
      [styles.yellowColor]: +colorId === 2,
      [styles.greenColor]: +colorId === 1,
      [styles.blueColor]: +colorId === 3,
      [styles.purpleColor]: +colorId === 4,
      [styles.darkOrangeColor]: +colorId === 6,
      [styles.darkGreenColor]: +colorId === 7,
      [styles.redColor]: +colorId === 8,
    });
  };

  const activeCallerClassnames = (colorId) => {
    return classNames(styles.item, {
      [styles.callerYellowColor]: +colorId === 2,
      [styles.callerOrangeColor]: +colorId === 1,
      [styles.callerRedColor]: +colorId === 0,
      [styles.callerGreenColor]: +colorId >= 4 && +colorId <= 200,
      [styles.callerLightGreenColor]: +colorId === 3,
      [styles.callerLightGreyColor]: +colorId === 202,
    });
  };

  const activeCallerFreeClassnames = (colorId) => {
    return classNames(styles.free__button, {
      [styles.callerFreeYellowColor]: +colorId === 2,
      [styles.callerFreeOrangeColor]: +colorId === 1,
      [styles.callerFreeRedColor]: +colorId === 0,
      [styles.callerFreeGreenColor]: +colorId >= 4 && +colorId <= 200,
      [styles.callerFreeLightGreenColor]: +colorId === 3,
      [styles.callerFreeLightGreyColor]: +colorId === 202,
    });
  };

  const formattedDate = new Date().toISOString().slice(0, 10);

  return (
    <>
      {caller ? (
        <>
          <li
            onClick={() => {
              if (colorId === 0) return;
              if (!postponed) {
                setIsOpen(!isOpen);
                setModal("appointment");
              } else {
                {
                  onPostpone
                    ? onClickFn(weekId, dayIndex, hourIndex)
                    : onClickFn(slots);
                }
              }
            }}
            key={dayIndex}
            className={activeCallerClassnames(slots && slots[0] ? slots[0].date < formattedDate ? 202 : colorId : colorId)}
          >
            {`${data}:00`}
            <div className={activeCallerFreeClassnames(slots && slots[0] ? slots[0].date < formattedDate ? 202 : colorId : colorId)}>{colorId}</div>
          </li>
          {modal === "appointment" && !postponed && (
            <NewAppointment
              isOpen={isOpen}
              time={data}
              weekId={weekId}
              dayIndex={dayIndex}
              hourIndex={hourIndex}
              slotId={slotId}
              handleClose={() => setIsOpen(!isOpen)}
              courseIdx={courseId}
              callerName={callerName}
            />
          )}
        </>
      ) : consultation ? (
        colorId === 4 ? (
          <>
            <li className={activeClassnames(colorId)}>
              {`${data}:00`}
              <div className={styles.hover_buttons}>
                <button type="button" onClick={onClickBtnStart}>
                  start
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setModal("consultation");
                  }}
                >
                  info
                </button>
              </div>
              {courseName ? <p className={styles.slot__course}>{courseName}</p> : null }
            </li>
            {modal === "consultation" && (
              <ConsultationInfo
                dayIndex={dayIndex}
                hourIndex={hourIndex}
                slotId={slotId}
                isOpen={isOpen}
                weekId={weekId}
                handleClose={() => setIsOpen(!isOpen)}
                handleReload={handleReload}
              />
            )}
          </>
        ) : colorId === 6 || colorId === 7 || colorId === 8 || colorId === 3 ? (
          <>
            <li className={activeClassnames(colorId)}>
              {`${data}:00`}
              <div className={styles.hover_buttons}>
                <button
                  className={styles.only_info_button}
                  type="button"
                  data-modal="consultation"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setModal("consultation");
                  }}
                >
                  info
                </button>
              </div>
              {courseName ? <p className={styles.slot__course}>{courseName}</p> : null }
            </li>
            {modal === "consultation" && (
              <ConsultationInfo
                dayIndex={dayIndex}
                hourIndex={hourIndex}
                slotId={slotId}
                isOpen={isOpen}
                weekId={weekId}
                handleClose={() => setIsOpen(!isOpen)}
                handleReload={handleReload}
              />
            )}
          </>
        ) : colorId === 2 ? (
          <>
            <li className={activeClassnames(colorId)}>
              {`${data}:00`}
              <div className={styles.hover_buttons}>
                <button
                  className={styles.only_info_button}
                  type="button"
                  data-modal="working"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setModal("working");
                  }}
                >
                  info
                </button>
              </div>
            </li>
            {modal === "working" && (
              <WorkingInfo
                slotId={slotId}
                isOpen={isOpen}
                handleClose={() => setIsOpen(!isOpen)}
              />
            )}
          </>
        ) : (
          <li className={activeClassnames(colorId)}>{`${data}:00`}</li>
        )
      ) : teamCalendar ? (
        <>
          <li
            key={dayIndex}
            className={activeCallerClassnames(slots && slots[0] ? slots[0].date < formattedDate ? 202 : colorId : colorId)}
          >
            {`${data}:00`}
            <div className={activeCallerFreeClassnames(slots && slots[0] ? slots[0].date < formattedDate ? 202 : colorId : colorId)}>{colorId}</div>
          </li>
        </>
      ) : (
        <li
          onClick={onClickFn}
          className={activeClassnames(colorId)}
        >{`${data}:00`}</li>
      )}
    </>
  );
};

TableItem.propTypes = {
  colorId: PropTypes.number.isRequired,
  onClickFn: PropTypes.func,
  consultation: PropTypes.bool,
};
TableItem.defaultProps = {
  colorId: 0,
};

export default TableItem;
