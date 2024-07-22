import React, { useEffect, useState } from 'react';
import './CancelModal.scss';
import { getOverbookedAppointments } from "../../helpers/appointment/appointment";

const CancelModal = ({ slotId, isOpen, onClose }) => {
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    if (isOpen && slotId) {
      getOverbookedAppointments(slotId)
        .then(response => {
          const { data } = response;
          if (data.length === 0) {
            // Закрити модалку, якщо даних немає
            onClose();
          } else {
            const formattedConsultations = data.map(consultation => ({
              ...consultation,
              date: formatDate(consultation.date) // Форматуємо дату
            }));
            setConsultations(formattedConsultations);
          }
        })
        .catch(error => {
          console.error('Error fetching consultations:', error);
          // Закрити модалку при помилці запиту
          onClose();
        });
    }
  }, [isOpen, slotId, onClose]);

  // Функція для форматування дати в "dd-mm-yyyy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cancel-modal">
      <div className="modal-content">
        <h2>Overbooked consultations</h2>
        <ul>
          {consultations.map(consultation => (
            <li className="modal__item" key={consultation.id}>
              <p>{consultation.manager_name}</p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={consultation.zoho_link}
              >Link</a>
              <p>Date: {consultation.date}</p>
              <p>Time: {consultation.time}</p>
            </li>
          ))}
        </ul>
        <button className="modal-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default CancelModal;
