import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  getConfirmatorAppointments,
  getConfirmatorError,
} from "../../redux/confirmator/confirmator-selectors";
import "./ConfirmationButton.scss";
import PostponeModal from "../../components/modals/PostponeModal/PostponeModal";
import { Fade } from "react-awesome-reveal";
import { getCourseIdByName } from "../../helpers/course/course";

const ConfirmatorButtons = ({ value, setValue }) => {
  const [isOpen, setIsOpen] = useState(null);
  const [course, setCourse] = useState(null);
  const [crm, setCrm] = useState(null);
  const [phone, setPhone] = useState(null);
  const [slot, setSlot] = useState(null);

  const appointments = useSelector(getConfirmatorAppointments);
  const error = useSelector(getConfirmatorError);

  const confirmationTable = [
    {
      btn: "postponed",
      class: "btn_yelllow",
    },
    {
      btn: "canceled",
      class: "btn_red",
      id: 8,
    },
   
  ];
  if (error) {
    return <h2>{error}</h2>;
  }
  return (
    <>
      <Fade cascade duration={200}>
        {appointments.map((item) => (
          <div key={item.appointment_id} className="btn_wrapper">
            {confirmationTable.map((i) => {
              return (
                <button
                  onClick={async() => {
                    
                    if (i.btn === "postponed") setIsOpen(item.appointment_id);
                    const res = await getCourseIdByName(item.course).then(data=> setCourse(data.data.id)) 
                     setCrm(item.crm_link)
                     setPhone(item.phone)
                      setSlot(item.slot_id)
                    return setValue({ ...value, [item.appointment_id]: i.btn });
                  }}
                  key={i.btn}
                  className={`${i.class} ${
                    (value[item.appointment_id] === i.btn || i.id === item.status) && i.class
                  }--active`}
                >
                  {i.btn}
                </button>
              );
            })}
          </div>
        ))}
      </Fade>
      <PostponeModal appointmentId={isOpen} slotId={slot} link={crm} age={0} phone={phone} courseId={course} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ConfirmatorButtons;
