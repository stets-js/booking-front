import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  setCancelConfirmation,
  setConfirmation,
} from "../../helpers/confirmation/confirmation";
import styles from "../../pages/Confirmator/ConfirmatorPage.module.scss";
import {
  getConfirmatorAppointments,
} from "../../redux/confirmator/confirmator-selectors";
import { TailSpin } from "react-loader-spinner";
import { success, error, defaults } from "@pnotify/core";
import PhoneSVG from "./PhoneSVG";
import { getCurrentConfirmator } from "../../redux/confirmator/confirmator-operations";
import {addCallToAppointment} from "../../helpers/appointment/appointment";

const ConfirmatorComments = ({ value, dispatch }) => {
  const appointments = useSelector(getConfirmatorAppointments);
  const [reject, setReject] = useState({});
  const [confirm, setConfirm] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedReason, setSelectedReason] = useState(() => {
    const initialReasons = {};
    appointments.forEach((item) => {
      initialReasons[item.appointment_id] = "";
    });
    return initialReasons;
  });
  const [loadingAppointment, setLoadingAppointment] = useState(null);

  // const confirmationTable = [
  //   {
  //     text: "time",
  //   },
  //   {
  //     text: "money",
  //   },
  //   {
  //     text: "other",
  //   },
  // ];

  // useEffect(() => {
  //   Object.keys(reject).forEach((item) =>
  //     setCancelConfirmation(reject[item].slot_id, 1, reject[item].text)
  //   );
  // }, [reject]);

  const handleMouseEnter = (itemId) => {
    setHoveredItem(itemId);
  };
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  console.log("appointments", appointments)
  return (
    <>
      {appointments.map((item) => (
        <div key={item.appointment_id} className={styles.comment__wrapper}>
          {value[item.appointment_id] !== "confirmed" && value[item.appointment_id] !== "canceled" && (
          <><div className={styles.commentsWrapper}><svg
          onMouseEnter={() => handleMouseEnter(item.appointment_id)}
          onMouseLeave={handleMouseLeave} 
          xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
          <path fill="#8bb7f0" d="M15,28.5C7.556,28.5,1.5,22.444,1.5,15S7.556,1.5,15,1.5S28.5,7.556,28.5,15S22.444,28.5,15,28.5z"></path><path fill="#4e7ab5" d="M15,2c7.168,0,13,5.832,13,13s-5.832,13-13,13S2,22.168,2,15S7.832,2,15,2 M15,1 C7.268,1,1,7.268,1,15s6.268,14,14,14s14-6.268,14-14S22.732,1,15,1L15,1z"></path><path fill="#fff" d="M15 7.75A1.25 1.25 0 1 0 15 10.25 1.25 1.25 0 1 0 15 7.75zM16 21L16 12 13 12 13 13 14 13 14 21 13 21 13 22 17 22 17 21z"></path>
          </svg>{hoveredItem === item.appointment_id && (
              <div className={styles.commentsWindow}>
              {item.comments}
              </div>
              )} <p>{item.comments?.length > 10 
                ? `${item.comments.slice(0, 10)}...` 
                : item.comments
              }</p></div>
              <div className={styles.commentsWrapper}
              onClick={async()=> {console.log("call made", item)
                await addCallToAppointment(item.appointment_id)
                dispatch(getCurrentConfirmator())
              }
              }
              >
                <PhoneSVG />
                <p>{item.how_many_calls}</p>
              </div></>
              )}
              
          {value[item.appointment_id] === "confirmed" && (
            <input
              type="text"
              className={styles.comment__input}
              placeholder="Write a comment here..."
              onChange={({ target }) => setConfirm(target.value)}
              onBlur={() =>
                confirm && setConfirmation(item.slot_id, 4, confirm).then(() => success("Successfully confirmed")).catch(err => error("Error",err))
              }
            />
          )}
          {value[item.appointment_id] === "canceled" && (
            <div className={styles.comment__reject_btn}>
              <select
                className={styles.reason__select}
                value={selectedReason[item.appointment_id]}
                onChange={(e) => {
                  setSelectedReason((prevSelectedReasons) => ({
                    ...prevSelectedReasons,
                    [item.appointment_id]: e.target.value,
                  }));
                }}
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
              </select>
              {loadingAppointment === item.appointment_id ? (
                <TailSpin height="25px" width="25px" color="#999DFF" />
              ) : (
              <button
              className={styles.btn}
              onClick={async () => {
                try {
                  setLoadingAppointment(item.appointment_id);
                  await setCancelConfirmation(
                    item.slot_id,
                    1,
                    selectedReason[item.appointment_id],
                    item.appointment_id
                  );
                } catch (error) {
                  // Handle error if needed
                  console.error("Error while cancelling appointment:", error);
                } finally {
                  setLoadingAppointment(null);
                  success("Successfully sended");
                }
              }
            }
            disabled={!selectedReason[item.appointment_id]}
              >
                Send
              </button>)}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ConfirmatorComments;
