import React from "react";
import { useSelector } from "react-redux";
import { getConfirmatorAppointments } from "../../redux/confirmator/confirmator-selectors";
import styles from "./Confirmation.module.scss";
import { Fade } from "react-awesome-reveal";

const Confirmator = () => {
  const appointments = useSelector(getConfirmatorAppointments);

  // Функція для перевірки наявності "overbooking" у тексті
  const hasOverbooking = (text) => {
    if (text && typeof text === 'object') {
      // Припускаємо, що текст може бути властивістю об'єкта
      text = text.toString();
    }
    if (typeof text === 'string') {
      return text.toLowerCase().includes("overbooking");
    }
    return false;
  };

  // Функція для форматування даних про запис
  const transformAppointmentData = (appointment) => {
    const isHighlighted = hasOverbooking(appointment.manager_name);
    return (
      <li
        key={appointment.appointment_id}
        className={`${styles.ul_items} ${isHighlighted ? styles.highlight : ''}`}
      >
        <p className={styles.ul_items_text}>
          {appointment.hour}:00, {appointment.course}, {appointment.manager_name}, {appointment.phone}
        </p>
        <a className={styles.link} target="_blank" href={appointment.crm_link} rel="noreferrer">
          Link
        </a>
      </li>
    );
  };

  return (
    <>
      {appointments.length === 0 ? (
        <h2 className={styles.errorTitle}>Nothing to confirm yet</h2>
      ) : (
        <ul className={styles.wrapper}>
          <Fade cascade duration={200}>
            {appointments.map((appointment) => transformAppointmentData(appointment))}
          </Fade>
        </ul>
      )}
    </>
  );
};

export default Confirmator;
