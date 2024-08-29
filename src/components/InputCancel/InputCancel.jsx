import styles from "./InputCancel.module.scss";
import React, { useState } from "react";

const InputCancel = ({ InputCancelFunc }) => {

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(""); 

  const handleClick = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirm = () => {
    // Викликати функцію видалення і передати вибрану причину
    InputCancelFunc(selectedReason);
    setSelectedReason("")
    setShowConfirmationModal(false);
  };

  const handleCancel = () => {
    // Сховати модальне вікно при скасуванні
    setShowConfirmationModal(false);
  };

  const handleReasonChange = (e) => {
    // Оновити вибрану причину видалення при зміні в дропдауні
    setSelectedReason(e.target.value);
  };



  return (
    <>
    <button type="button" className={styles.input__submit} onClick={handleClick}>
      Remove
    </button>

{showConfirmationModal && (
  <div className={styles.modal}>
    <div className={styles.modal__content}>
      <p className={styles.label}>Select a reason for removal:</p>
      
      <select
                className={styles.reason__select}
                value={selectedReason}
                onChange={handleReasonChange}
              >
                <option value="" disabled selected>-none-</option>
              <option value="no parents attending">no parents attending</option>
              <option value="child sick">child sick</option>
              <option value="not interested">not interested</option>
              <option value="forgot about TL / have no time">forgot about TL / have no time</option>
              <option value="no contact">no contact</option>
              <option value="tech reasons">tech reasons</option>
              <option value="no PC">no PC</option>
              <option value="no electricity">no electricity</option>
              <option value="other reasons">other reasons</option>
              <option value="child has no interest">child has no interest</option>
              </select>
      <div className={styles.btn_wrapper}>
        <button className={styles.btn_yes} onClick={handleConfirm} disabled={!selectedReason}>Confirm</button>
        <button className={styles.btn_no} onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  </div>
)}
</>
  );
};

export default InputCancel;
