import React, { useEffect, useState } from "react";
import Button from "../../Buttons/Buttons";
import styles from "./ChangeAppointentManager.module.scss";
import {
  getDateByWeekId,
  getManagersByCourse,
} from "../../../helpers/manager/manager";
import { putAppointment } from "../../../helpers/appointment/appointment";
import Modal from "../../Modal/Modal";
import { info, success, error } from "@pnotify/core";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import {freezeSlotStatus} from "../../../helpers/slot/slot"
import Snowflake from "../../MeetingsTableItem/Snowflake"

const ChangeAppointentManager = ({
  isOpen,
  handleClose,
  courseId,
  day,
  weekId,
  hour,
  age,
  phone,
  link,
  appointmentId,
  message,
  isCreateAppointment,
  isChangeAppointment,
  setManagerId,
  setManager,
  isPostponed,
  closePostpone,
  isFollowUp,
  // selectedReason
}) => {
  const [date, setDate] = useState("");
  const [managersList, setManagers] = useState([]);

  const userRole = useSelector((state) => state.auth.user.role);
  const userId = useSelector((state) => state.auth.user.id);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await getDateByWeekId(weekId, day);
  //       console.log("result.date",result.date);
  //       setDate(result.date);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [day, weekId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await getManagersByCourse(courseId, date, hour);
  //       setManagers(result.managers);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [courseId, date, hour]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDateByWeekId(weekId, day);
        const date = result.date;
        setDate(date);
  
        const [formattedDay, formattedMonth, formattedYear] = date.split('.');
        
        const managers = await getManagersByCourse(courseId, date, hour);
        const freezeStatusPromises = managers.managers.map(manager => 
          freezeSlotStatus(`${formattedYear}-${formattedMonth}-${formattedDay}`, hour, manager.id).then(data => data.is_freeze)
        );
        
        // Очікуємо завершення всіх промісів
        const freezeStatuses = await Promise.all(freezeStatusPromises);
        
        // Додаємо інформацію про статус заморозки до кожного менеджера
        const updatedManagers = managers.managers.map((manager, index) => ({
          ...manager,
          is_freeze: freezeStatuses[index]
        }));
  
        // Сортуємо менеджерів за рейтингом
        const sortedManagers = updatedManagers.sort((a, b) => b.rating - a.rating);
        setManagers(sortedManagers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [day, weekId, courseId, hour]);
  

  console.log(managersList)

  const [selectedReason, setSelectedReason] = useState("no parents attending");
  const [isConfirmPostponeOpen, setIsConfirmPostponeOpen] = useState(false);

  const handlePostpone = () => {
    setIsConfirmPostponeOpen(true);
  };

  const handleConfirmPostpone = (manager) => {
    // Викликається при підтвердженні відкладання
    const data = new FormData();
    data.append("appointment_id", appointmentId);
    data.append("date", date);
    data.append("day", day);
    data.append("hour", hour);
    data.append("course_id", courseId);
    data.append("crm_link", link);
    data.append("phone", phone);
    data.append("age", age);
    data.append("manager_id", manager.id);
    data.append("message", message);
    data.append("follow_up", false);
    data.append("postpone_role", getPostponeRole(userRole));
    data.append("userId", userId);
    data.append("reason_postpone", selectedReason);

    putAppointment(data).then(() => {
      closePostpone();
      handleClose(!isOpen);
      success("Manager changed successfully");
      setIsConfirmPostponeOpen(false);
    });
  };

  const handleCancelPostpone = () => {
  setIsConfirmPostponeOpen(false);
  handleClose(!isOpen);
};

  const getPostponeRole = (role) => {
    switch (role) {
      case 4:
        return "caller";
      case 5:
        return "confirmator";
      case 2:
        return "manager";
      default:
        return "admin";
    }
  };

  const [selectedManager, setSelectedManager] = useState(null);
  return (
    <>
      <Modal
        style={{ zIndex: "999999999 !important" }}
        open={isOpen}
        onClose={() => {
          handleClose(!isOpen);
        }}
      >
        <h1>Select new manager</h1>

        {managersList.length === 0 ? (
          <div className={styles.noManagersLoadingWrapper}>
          <h2 className={styles.noManagersButton}>Managers list...</h2>
          {/* <TailSpin height="50px" width="50px" color="#999DFF" /> */}
          </div>
        ) : (
          <div className={styles.managersListBox}>
            {managersList.map((manager) => (
              <div key={manager.id}>
                <button
                  onClick={
                    isCreateAppointment || isChangeAppointment
                      ? (e) => {
                          setManagerId(manager.id);
                          setManager(manager.name);
                          handleClose(!isOpen);
                        } :
                        isPostponed ? () => {
                          setSelectedManager(manager);
                          handlePostpone();
                        }
                      : (e) => {
                          const data = new FormData();
                          data.append("appointment_id", appointmentId);
                          data.append("date", date);
                          data.append("day", day);
                          data.append("hour", hour);
                          data.append("course_id", courseId);
                          data.append("crm_link", link);
                          data.append("phone", phone);
                          data.append("age", age);
                          data.append("manager_id", manager.id);
                          data.append("message", message);
                          data.append("follow_up", false);
                          data.append("postpone_role", userRole === 4 ? "caller" : userRole === 5 ? "confirmator" : userRole === 2 ? "manager" : "admin");
                          data.append("userId", userId);
                          data.append("reason_postpone", selectedReason);
                          putAppointment(data).then(() => {
                            if (isPostponed) {
                              closePostpone();
                            }
                            handleClose(!isOpen);
                            success("Manager changed successfully");
                          });
                        }
                  }
                  className={styles.managerButton}
                >
                  {manager.name}
                  {manager.is_freeze ? <Snowflake className={styles.snowflake} /> : null}
                </button>
              </div>


                    
            ))}
          </div>
        )}
      </Modal>

      {isConfirmPostponeOpen && (
        <Modal>
          <div>
            <h2 className={styles.confirm__title}>Select postpone reason:</h2>
            <select
              className={styles.reason__select}
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              <option value="no parents attending">No parents attending</option>
              <option value="child sick">Child sick</option>
              <option value="not interested">Not interested</option>
              <option value="forgot about TL / have no time">Forgot about TL / have no time</option>
              <option value="no contact">No contact</option>
              <option value="tech reasons">Tech reasons</option>
              <option value="no PC">No PC</option>
              <option value="no electricity">No electricity</option>
              <option value="other reasons">Other reasons</option>
              
              {/* Додайте інші причини, які вам потрібні */}
            </select>
            <div className={styles.confirm__wrapper}>
              <button className={styles.confirm__ok} onClick={() => handleConfirmPostpone(selectedManager)}>Postpone</button>
              <button className={styles.confirm__cancel} onClick={handleCancelPostpone}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

    </>
  );
};

export default ChangeAppointentManager;
