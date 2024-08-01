import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./MeetingsTableItem.module.scss";
import ConsultationInfo from "../modals/ConsultationInfo/ConsultationInfo";
import NewAppointment from "../modals/NewAppointment2/NewAppointment";
import Star from "./Star";
import Question from "./Question";
import Snowflake from "./Snowflake";
import { Link } from "react-router-dom";
import { success, error, defaults } from "@pnotify/core";
import {freezeSlot} from "../../helpers/slot/slot"

import {
  changeStatusSlot,
  setManagerError,
  setManagerLoading,
  getManagerCurrentWorkWeek,
  getManagerWorkWeek,
} from "../../redux/manager/manager-operations";
import { useSelector, useDispatch } from "react-redux";
import { postStartConsultation } from "../../helpers/consultation/consultation";
import { updateSlot } from "../../helpers/week/week";
import {
  getDate,
  getTable,
  getWeekId,
} from "../../redux/manager/manager-selectors";
import { getTypeSelection } from "../../redux/manager/manager-selectors";
import WorkingInfo from "../../components/modals/WorkingInfo/WorkingInfo"

const MeetingsTableItem = ({
  managerName,
  text,
  managerId,
  data,
  colorId,
  onClickFn,
  consultation,
  isManagerSelectedFr,
  weekId,
  dayIndex,
  hourIndex,
  slotId,
  onClickBtnStart,
  postponed,
  slots,
  currentSelectedSortStatus,
  date,
  selectedManagerIds,
  setSelectedManagerIds,
  currentSelectedStars,
  isFollowUp,
  isOnControl,
  handleReload,
  isFreeze
}) => {
  const [isManagerSelected, setisManagerSelected]=useState(isManagerSelectedFr)
  const table = useSelector(getTable);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState("");
  const [isConfModalOpen, setIsConfModalOpen] = useState(false);
  const typeSelection = useSelector(getTypeSelection);
  const [freeze, setFreeze] = useState(isFreeze);

  const activeClassnames = (colorId) => {
    return classNames(styles.item, {
      [styles.grayColor]: +colorId === 0,
      [styles.orangeColor]: +colorId === 2,
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
      [styles.callerGreenColor]: +colorId >= 4,
      [styles.callerLightGreenColor]: +colorId === 3,
    });
  };
  const activeCallerFreeClassnames = (colorId) => {
    return classNames(styles.free__button, {
      [styles.callerFreeYellowColor]: +colorId === 2,
      [styles.callerFreeOrangeColor]: +colorId === 1,
      [styles.callerFreeRedColor]: +colorId === 0,
      [styles.callerFreeGreenColor]: +colorId >= 4,
      [styles.callerFreeLightGreenColor]: +colorId === 3,
    });
  };

  const dispatch = useDispatch();
  const onClickSlotButton = (dayIndex, hourIndex, managerFuncId) => {
    dispatch(setManagerLoading(true));
    return postStartConsultation(weekId, dayIndex, hourIndex, managerFuncId)
      .then(() => {
        return updateSlot(managerFuncId, weekId, dayIndex, hourIndex, 6)
          .then(() => {
            dispatch(
              changeStatusSlot({
                dayIndex,
                hourIndex,
                colorId: 6,
              })
            );
            
          })
          .catch((error) => dispatch(setManagerError(error.message)));
      })
      .catch((error) => dispatch(setManagerError(error.message)))
      .finally(() => dispatch(setManagerLoading(false)));
  };

  function toggleSelectedManager(
    managerId,
    selectedManagerIds,
    setSelectedManagerIds
  ) {
    const isSelected = selectedManagerIds.includes(managerId);
    if (isSelected) {
      setSelectedManagerIds(
        selectedManagerIds.filter((id) => id !== managerId)
      );
    } else {
      setSelectedManagerIds([...selectedManagerIds, managerId]);
    }
  }

  function toggleSelectedManager2(arr, val, setSelectedManagerIds) {
    const index = arr.indexOf(val);
    if (index === -1) {
      // Value not found in array, add it
      arr.push(val);
      setisManagerSelected(true)
    } else {
      // Value found in array, remove it
      arr.splice(index, 1);
      setisManagerSelected(false)
    }
    setSelectedManagerIds(arr);
  }

  // CONFIRM MODAL/////
  const openModal = () => {
    setIsConfModalOpen(true);
  };

  const closeModal = () => {
    setIsConfModalOpen(false);
  };

  const handleDeleteClick = () => {
    openModal();
  };

  const handleConfirmDelete = () => {
    onClickFn();
    closeModal();
  };

  const handleCancelDelete = () => {
    closeModal();
  };

  const handleModalClick = (e) => {
    // Закриваємо модальне вікно при кліку на зовнішній області (div.modal)
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  ///////
  const handleFreezeClick = (e) => {
    e.stopPropagation();
    setFreeze(!freeze);
    freezeSlot(+slotId)
      .then(() => success("Freezing toggled"))
      .catch((err) => error("Error", err));
  };

  return (
    <>
    {isConfModalOpen && (
        <div className={styles.modal} onClick={handleModalClick}>
          <div className={styles.modal__content}>
            <p className={styles.label}>Delete this item?</p>
            <div className={styles.btn_wrapper}>
              <button className={styles.btn_yes} onClick={handleConfirmDelete}>Yes</button>
              <button className={styles.btn_no} onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
      {managerName && text === "Managers" ? (
        <>
          <a
            className={classNames(
              activeClassnames(colorId),
              styles.managerNameStManager
            )}
            href={`#`}
          >
            {text !== undefined ? text : `manager name is undefined`}
          </a>
        </>
      ) : managerName ? (
        <>
          <label className={styles.itemCheckboxLabel}>
            <input
              type="checkbox"
              id={managerId}
              checked={isManagerSelected}
              className={styles.itemCheckbox}
              onChange={() => {
                toggleSelectedManager2(
                  selectedManagerIds,
                  managerId,
                  setSelectedManagerIds
                );

              }}
            />
            <span className={styles.itemCheckboxCheckmark}></span>
          </label>
          <Link
            className={classNames(
              activeClassnames(colorId),
              styles.managerNameSt
            )}
            to={`/manager/${managerId}/consultations/`}
            target="_self"
          >
            {text !== undefined ? text : `manager name is undefined`}
          </Link>
        </>
      ) : colorId === 3 ? (
        <>
          <li
            onClick={typeSelection === "Free" ? handleDeleteClick : onClickFn}
            key={dayIndex}
            className={activeClassnames(colorId)}
          >
            {text !== undefined ? text : ``}
            <div className={styles.hover_buttons}>
              <button
                type="button"
                className={styles.styled_button}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                  setModal("appointment");
                }}
              >
                info
              </button>
            </div>
            {isFollowUp ? <div className={styles.asterix}><Star /></div> : null}
            {isOnControl ? <div className={styles.question}><Question /></div> : null}
          </li>
          {modal === "appointment" && (
            // <NewAppointment
            //   isOpen={isOpen}
            //   time={data}
            //   weekId={weekId}
            //   slotId={slotId}
            //   dayIndex={dayIndex}
            //   date={date}
            //   hourIndex={hourIndex}
            //   handleClose={() => setIsOpen(!isOpen)}
            // />
            <ConsultationInfo
              isOpen={isOpen}
              dayIndex={dayIndex}
              hourIndex={hourIndex}
              slotId={+slotId}
              handleClose={() => setIsOpen(!isOpen)}
              weekId={weekId}
              manId={managerId}
              handleReload={handleReload}
              currentTable
            />
          )}
        </>
      ) : colorId === 4 ? (
        <>
          <li
            onClick={typeSelection == "Free" ? handleDeleteClick : onClickFn}
            key={dayIndex}
            className={activeClassnames(colorId)}
          >
            {text !== undefined ? text : ``}
            <div className={styles.hover_buttons}>
              {/* <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickSlotButton(dayIndex, hourIndex, managerId);
                }}
              >
                start
              </button> */}
              <button
                type="button"
                className={styles.styled_button}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                  setModal("consultation");
                }}
              >
                info
              </button>
            </div>
            
            {isFollowUp ? <div className={styles.asterix}><Star /></div> : null}
            {isOnControl ? <div className={styles.question}><Question /></div> : null}
          </li>
          {modal === "consultation" && (
            <ConsultationInfo
              dayIndex={dayIndex}
              hourIndex={hourIndex}
              isOpen={isOpen}
              handleClose={() => setIsOpen(!isOpen)}
              slotId={+slotId}
              weekId={weekId}
              manId={managerId}
              handleReload={handleReload}
              currentTable
            />
          )}
        </>
      ) : colorId === 2 ? (
        <>
        <li className={activeClassnames(colorId)}
        onClick={typeSelection === "Free" ? handleDeleteClick : onClickFn}
        >
        {text !== undefined ? text : ``}
          <div className={styles.hover_buttons}>
            <button
              className={styles.styled_button}
              type="button"
              data-modal="working"
              onClick={(e) => {
                e.stopPropagation();
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
      ):colorId === 1 ? (
        <>
        <li className={activeClassnames(colorId)}
        onClick={typeSelection === "Free" ? handleDeleteClick : onClickFn}
        >
        {text !== undefined ? text : ``}
          <div className={styles.hover_buttons}>
            <button
              className={styles.styled_button}
              type="button"
              data-modal="freeze"
              // isFreeze={freeze}
              onClick={typeSelection === "Free" ? handleDeleteClick : handleFreezeClick}
            >
              freeze
            </button>
          </div>
          {freeze ? <div className={styles.asterix}><Snowflake /></div> : null}
        </li>
      </>
      ) : (
        <li onClick={typeSelection == "Free" ? handleDeleteClick : onClickFn} className={activeClassnames(colorId)}>
          {text !== undefined ? text : ``}
        </li>
      )}
    </>
  );
};

MeetingsTableItem.propTypes = {
  colorId: PropTypes.number.isRequired,
  onClickFn: PropTypes.func,
  consultation: PropTypes.bool,
};
MeetingsTableItem.defaultProps = {
  colorId: 0,
};
export default MeetingsTableItem;
