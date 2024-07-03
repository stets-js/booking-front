import React from "react";
import Button from "../../../Buttons/Buttons";
import Modal from "../../../Modal/Modal";
import styles from "../../../../pages/Caller/CallerPage.module.scss";
import { setPostponedConfirmation } from "../../../../helpers/confirmation/confirmation";
import { putAppointment } from "../../../../helpers/appointment/appointment";
import { info, success, error } from "@pnotify/core";
import { useSelector } from "react-redux";

export default function ManagerListModal({
  closePostponed,
  isOpenDropdown,
  setIsOpenDropdown,
  appointmentId,
  isAppointment,
  weekId,
  link,
  courseId,
  phone,
  age,
  slotId,
  message,
}) {
  function formatDate(dateString) {
    var dateParts = dateString.split("-");
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];

    var formattedDate = day + "." + month + "." + year;
    return formattedDate;
  }

  const userRole = useSelector((state) => state.auth.user.role);
  const userId = useSelector((state) => state.auth.user.id);

  return (
    <>
      {isOpenDropdown && (
        <Modal onClose={() => setIsOpenDropdown(false)} index={10002}>
          <div className={styles.buttonsWrapper}>
            <p className={styles.availableManager}>Select available manager</p>
            <div className={styles.selectManagerList}>
              {isOpenDropdown.map((item) => {
                return <Button
                  onclick={(e) => {
                    if (isAppointment) {
                      const data = new FormData();
                      data.append("crm_link", link);
                      data.append("appointment_id", appointmentId);
                      data.append("day", item.week_day);
                      data.append("hour", item.time); //
                      data.append("course_id", courseId);
                      data.append("phone", phone);
                      data.append("age", age);
                      data.append("date", formatDate(item.date));
                      data.append("manager_id", item.manager_id);
                      data.append("message", message);
                      data.append("follow_up", item.follow_up);
                      data.append("on_control", item.on_control);
                      data.append("postpone_role", userRole === 4 ? "caller" : userRole === 5 ? "confirmator" : userRole === 2 ? "manager" : "admin");
                      data.append("userId", userId);
                      return putAppointment(data).then(() => {
                        setIsOpenDropdown("");
                        closePostponed();
                        success("Successfully postponed");
                      }).catch((err) => {
                        error(err.response.data.message);
                      });
                    }
                    return setPostponedConfirmation(item.id, appointmentId)
                      .then(() => {
                        setIsOpenDropdown("");
                        closePostponed();
                        info("Successfully postponed");
                      })
                      .catch(({ message }) => error(message));
                  }}
                  key={item.id}
                  paddingRight={31}
                  paddingLeft={31}
                  width={"fit-content"}
                  bgColor={"black"}
                  color={"white"}
                  margin={"15px auto"}
                >
                  {item.name}
                </Button>
})}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
