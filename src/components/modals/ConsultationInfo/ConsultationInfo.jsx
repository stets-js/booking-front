import styles from "./ConsultationInfo.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroups } from "../../../helpers/group/group";
import { getCourses } from "../../../helpers/course/course";
import { updateSlot, updateSlotFollowUp,updateSlotOnControl } from "../../../helpers/week/week";
import { getAppointment } from "../../../helpers/appointment/appointment";
import { getSlot } from "../../../helpers/slot/slot";
import { postConsultationResult } from "../../../helpers/consultation/consultation";
import { getTable, getWeekId } from "../../../redux/manager/manager-selectors";
import { Link } from "react-router-dom";
import { delteConfirmation } from "../../../helpers/confirmation/confirmation";
import { getWeekIdByTableDate } from "../../../helpers/week/week";
import { alert, notice, info, success, error } from "@pnotify/core";

import {
  setManagerError,
  setManagerLoading,
  changeStatusSlot,
} from "../../../redux/manager/manager-operations";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
import { TailSpin } from "react-loader-spinner";

import PostponeModal from "../../../components/modals/PostponeModal/PostponeModal";

const ConsultationInfo = ({
  isOpen,
  handleClose,
  weekId,
  slotId,
  dayIndex,
  hourIndex,
  handleReload,
  manId,
  currentTable
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState(null);
  const [course, setCourse] = useState("");
  const [group, setGroup] = useState("");
  const [message, setMessage] = useState("");
  const [unsuccessfulMessage, setUnsuccessfulMessage] = useState("");
  const { managerId } = useParams();
  const [appointment, setAppointment] = useState([]);
  //const weekId = useSelector(getWeekId);
  const userRole = useSelector((state) => state.auth.user.role);
  const [currentWeekId, setCurrentWeekId] = useState(weekId);
  const managerTable = useSelector(getTable);

  // useEffect(() => {
  //   const get = async () => await getWeekIdByTableDate();
  //   get().then((data) => setAppointment(data.data));
  // }, []);

  const [withParents, setWithParents] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [onControl, setOnControl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenPostpone, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isOpen) {
          // Отримання даних про призначення
          const appointmentData = await getAppointment({ id: slotId });
          setAppointment(appointmentData.data);
          setFollowUp(appointmentData.data.follow_up);
          setWithParents(appointmentData.data.parents);
          setOnControl(appointmentData.data.on_control);
          setUnsuccessfulMessage(appointmentData.data.unsuccessful_message || "");
          setMessage(appointmentData.data.comments);
  
          // Отримання даних про слот
          const slotData = await getSlot({ id: slotId });
          if (slotData.status_id == 7 || slotData.status_id == 8) {
            setResult(slotData.status_id);
          } else {
            setResult(7);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Обробка помилок, наприклад, виведення повідомлення користувачу
      }
    };
  
    fetchData();
  }, [isOpen]);

  useEffect(() => {},[result])

  const cancelConfConsultOnClickFn = () => {
    delteConfirmation(managerId ? managerId : manId, weekId, dayIndex, currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time, 0, message)
      .then(() => {
        success({
          text: "Successfully deleted.",
        });
        handleClose();
        handleReload && handleReload();
      })
      .catch(() => {
        // Handle error
        error({
          text: "Something went wrong",
        });
        handleClose();
        handleReload && handleReload();
      });
  };

  const updateFollowUp = () => {
    if(followUp !== "" && managerTable[dayIndex] && managerTable[dayIndex][hourIndex]){
      setIsLoading(true)
      updateSlotFollowUp(managerId ? managerId : manId,
      weekId,
      dayIndex,
      currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
      +result,
      followUp).then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error updating follow-up:", error);
      });
    }
      else if(followUp !== ""){
        setIsLoading(true)
        updateSlotFollowUp(managerId ? managerId : manId,
          weekId,
          dayIndex,
          currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
          +result,
          followUp).then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error("Error updating follow-up:", error);
          });
      }
  }
  const updateOnControl = () => {
    if(onControl !== "" && managerTable[dayIndex] && managerTable[dayIndex][hourIndex]){
      setIsLoading(true)
      updateSlotOnControl(managerId ? managerId : manId,
      weekId,
      dayIndex,
      currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
      +result,
      onControl).then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error updating onControl:", error);
      });
    }
      else if(followUp !== ""){
        setIsLoading(true)
        updateSlotOnControl(managerId ? managerId : manId,
          weekId,
          dayIndex,
          currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
          +result,
          onControl).then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error("Error updating onControl:", error);
          });
      }
  }

  
  const handleReasonChange = (e) => {
    // Оновити вибрану причину видалення при зміні в дропдауні
    setUnsuccessfulMessage(e.target.value);
  };

  const linkRef = useRef(null);

  const handleCopyLink = () => {
    if (linkRef.current) {
      const link = linkRef.current.href;
      navigator.clipboard.writeText(link).then(() => {
        success("Link copied!")
      })
    }
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{ type: "no-request" }}
            isCancelConfConsult={true}
            cancelConfConsultOnClickFn={cancelConfConsultOnClickFn}
            onSubmit={() => {
              handleClose();
              dispatch(setManagerLoading(true));
              return postConsultationResult(+slotId, result, group, message, unsuccessfulMessage, course || appointment.course_id, withParents)
                .then((data) => {
                  return updateSlot(
                    managerId ? managerId : manId,
                    weekId,
                    dayIndex,
                    currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
                    +result
                  )
                    .then((data) => {
                      dispatch(
                        changeStatusSlot({
                          dayIndex,
                          hourIndex,
                          colorId: +result === 8 ? 1 : +result,
                        })
                      );
                    })
                    .catch((error) => dispatch(setManagerError(error.message)));
                })
                .catch((error) => dispatch(setManagerError(error.message)))
                .finally(() => {
                  setDesc("");
                  setName("");
                  setResult(7);
                  setCourse("");
                  setMessage("");
                  setFollowUp("");
                  setWithParents(false);
                  setUnsuccessfulMessage("");
                  return dispatch(setManagerLoading(false));
                });
            }}
            name={name}
            description={desc}
            course={course || appointment.course_id}
            result={result}
            postpone
            postponeClick={() => setIsOpen(!isOpenPostpone)}
            handleClose={handleClose}
            successConfirm
            status={{
              successMessage: "Successfully changed consultation info",
              failMessage: "Failed to change consultation info",
            }}
            title="Consultation Info"
            // some magic below
            isSubmitDisabled={result == 7 ? false : !unsuccessfulMessage} 
          >
            <label className={styles.input__label}>
              {appointment && (
                <div className={styles.crm__wrapper}>
                <a
                  ref={linkRef}
                  target="_blank"
                  href={appointment.zoho_link}
                  className={styles.input__link}
                >
                  CRM Link
                </a>
                <div onClick={handleCopyLink}>
                <svg width="20" height="20" viewBox="0 0 0.6 0.6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.2.1v.3a.05.05 0 0 0 .05.05h.2A.05.05 0 0 0 .498.4V.181A.05.05 0 0 0 .484.145L.403.064A.05.05 0 0 0 .366.05H.251a.05.05 0 0 0-.05.05" stroke="#000" strokeWidth=".05" strokeLinecap="round" strokeLinejoin="round"/><path d="M.4.45V.5a.05.05 0 0 1-.05.05H.149A.05.05 0 0 1 .1.498V.226a.05.05 0 0 1 .049-.05h.05" stroke="#000" strokeWidth=".05" strokeLinecap="round" strokeLinejoin="round"/></svg>                </div>
              </div>
              )}
            </label>
            <Select
              title="Course:"
              request={getCourses}
              setValue={setCourse}
              value={course || appointment.course_id}
              defaultValue="Select course"
            />

            <Select
              title="Result:"
              type="no-request"
              value={result}
              setValue={setResult}
            >
              <option value={7}>Successful</option>
              <option value={8}>Unsuccessful</option>
            </Select>
          
           {result == 8 ?  <label className={styles.input__label2}>Reason:
           <select
                className={styles.reason__select}
                value={unsuccessfulMessage}
                onChange={handleReasonChange}
              >
                <option value="" disabled selected>-None-</option>
              <option value="no parents attending">No parents attending</option>
              <option value="child sick">Child sick</option>
              <option value="not interested">Not interested</option>
              <option value="forgot about TL / have no time">Forgot about TL / have no time</option>
              <option value="no contact">No contact</option>
              <option value="tech reasons">Tech reasons</option>
              <option value="no PC">No PC</option>
              <option value="no electricity">No electricity</option>
              <option value="other reasons">Other reasons</option>
              <option value="child has no interest">Child has no interest</option>
              </select></label>: null}

            <Select
              title="Group:"
              value={group}
              request={getGroups}
              setValue={setGroup}
              groupId={+course}
              defaultValue="Select group"
            />
            <label className={styles.input__label}>
              <p className={styles.input__label}>Message</p>
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>
            <label className={styles.input__checkbox}>
              <input
                className={styles.input__checkboxInput}
                type="checkbox"
                checked={withParents}
                onChange={() => setWithParents(!withParents)}
              />
              <p className={styles.input__checkboxLabel}>Without parents</p>
            </label>
              {(userRole !== 2) &&
              <>
              <div className={styles.checkbox__wrapper}>
            <label className={styles.input__checkbox}>
              <input
                className={styles.input__checkboxInput}
                type="checkbox"
                checked={followUp}
                onChange={() => setFollowUp(!followUp)}
              />
              <p className={styles.input__checkboxLabel}>Перенос</p>
              {isLoading ? <TailSpin height="25px" width="25px" color="#999DFF" /> : null}
            </label>
              <button className={styles.btn__followUp} type="button" onClick={updateFollowUp}>Update Перенос</button>
              </div>
              <div className={styles.checkbox__wrapper}>
              <label className={styles.input__checkbox}>
              <input
                className={styles.input__checkboxInput}
                type="checkbox"
                checked={onControl}
                onChange={() => setOnControl(!onControl)}
              />
              <p className={styles.input__checkboxLabel}>На контроль</p>
              {isLoading ? <TailSpin height="25px" width="25px" color="#999DFF" /> : null}
            </label>
              <button className={styles.btn__followUp} type="button" onClick={updateOnControl}>Update На контроль</button>
              </div>
              </>}
          </Form>
        </Modal>
      )}
      {isOpenPostpone && <PostponeModal
        isOpen={isOpenPostpone}
        onClose={() => setIsOpen(!isOpenPostpone)}
        appointmentId={appointment.id}
        link={appointment.zoho_link}
        courseId={appointment.course_id}
        day={dayIndex}
        hour={hourIndex}
        phone={appointment.phone}
        age={appointment.age}
        slotId={slotId}
        weekId={weekId}
        message={message}
        isFollowUp={followUp}
        isOnControl={onControl}
      />}
    </>
  );
};

export default ConsultationInfo;
