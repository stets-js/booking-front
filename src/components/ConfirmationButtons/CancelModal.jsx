import React from "react";
import "./CancelModal.scss";

const CancelModal = ({ slotId, consultations, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="cancel-modal">
      <div className="modal-content">
        <h2>Overbooked consultations</h2>
        <ul>
          {consultations.map((consultation) => (
            <li className="modal__item" key={consultation.id}>
              <p>{consultation.manager_name}</p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={consultation.zoho_link}
              >
                Link
              </a>
              <p>Date: {consultation.date}</p>
              <p>Time: {consultation.time}</p>
            </li>
          ))}
        </ul>
        <button className="modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default CancelModal;
