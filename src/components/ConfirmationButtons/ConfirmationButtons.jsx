import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  getConfirmatorAppointments,
  getConfirmatorError,
} from "../../redux/confirmator/confirmator-selectors";
import "./ConfirmationButton.scss";
import PostponeModal from "../../components/modals/PostponeModal/PostponeModal";
import CancelModal from "../../components/ConfirmationButtons/CancelModal";
import { Fade } from "react-awesome-reveal";
import { getCourseIdByName } from "../../helpers/course/course";
import { getOverbookedAppointments } from "../../helpers/appointment/appointment";

const ConfirmatorButtons = ({ value, setValue }) => {
  const [isOpen, setIsOpen] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(null);
  const [course, setCourse] = useState(null);
  const [crm, setCrm] = useState(null);
  const [phone, setPhone] = useState(null);
  const [mess, setMess] = useState(null);
  const [age, setAge] = useState(null);
  const [slot, setSlot] = useState(null);
  const [consultations, setConsultations] = useState([]);

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
    {
      btn: "confirmed",
      class: "btn_blue",
      id: 4,
    },
  ];

  if (error) {
    return <h2>{error}</h2>;
  }

  const handleButtonClick = async (item, i) => {
    if (i.btn === "canceled") {
      const response = await getOverbookedAppointments(item.slot_id);
      const { data } = response;

      if (data.length > 0) {
        const formattedConsultations = data.map(consultation => ({
          ...consultation,
          date: formatDate(consultation.date), // Форматуємо дату
        }));
        setConsultations(formattedConsultations);
        setIsCancelOpen(item.appointment_id);
      }
    }

    if (i.btn === "postponed") {
      setIsOpen(item.appointment_id);
    }

    const res = await getCourseIdByName(item.course).then(
      (data) => setCourse(data.data.id)
    );
    setCrm(item.crm_link);
    setPhone(item.phone);
    setMess(item.comments);
    setAge(item.age);
    setSlot(item.slot_id);
    setValue({ ...value, [item.appointment_id]: i.btn });
  };

  // Функція для форматування дати в "dd-mm-yyyy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <Fade cascade duration={200}>
        {appointments.map((item) => (
          <div key={item.appointment_id} className="btn_wrapper">
            {confirmationTable.map((i) => (
              <button
                onClick={() => handleButtonClick(item, i)}
                key={i.btn}
                className={`${i.class} ${
                  (value[item.appointment_id] === i.btn || i.id === item.status) &&
                  i.class
                }--active`}
              >
                {i.btn}
              </button>
            ))}
          </div>
        ))}
      </Fade>
      <PostponeModal
        appointmentId={isOpen}
        slotId={slot}
        message={mess}
        link={crm}
        age={age}
        phone={phone}
        courseId={course}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <CancelModal
        slotId={slot}
        consultations={consultations}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(null)}
      />
    </>
  );
};

export default ConfirmatorButtons;
