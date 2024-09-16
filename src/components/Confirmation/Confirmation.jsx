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

    function makeCall(phoneNumber) {
      const url = 'https://wpk3y8.api.infobip.com/calls/1/calls';
      const apiKey = 'I3abYM7O9m4PMlVxJBif5WsmlVDwoLLA'; // Замініть на ваш API ключ
  
      const data = {
          from: '380736475076', // Замініть на ваш номер
          to: phoneNumber,
          text: 'This is a test call from Infobip.'
      };
  
      fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': `App ${apiKey}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          console.log('Call initiated successfully:', data);
      })
      .catch(error => {
          console.error('Error initiating call:', error);
      });
  }

    return (
      <li
        key={appointment.appointment_id}
        className={`${styles.ul_items} ${isHighlighted ? styles.highlight : ''}`}
      >
        <p className={styles.ul_items_text}>
          {appointment.hour}:00, {appointment.course}, {appointment.manager_name}, <span className={styles.makeCall} onClick={()=>makeCall(appointment.phone)}>{appointment.phone}</span>
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
