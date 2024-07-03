import styles from "./ChangeAppointment.module.scss";
import Modal from "../../Modal/Modal";
import { info, success, error } from "@pnotify/core";
import React, { useState, useEffect } from "react";
import { putAppointment } from "../../../helpers/appointment/appointment";
import { getCourses } from "../../../helpers/course/course";
import { getDateByWeekId } from "../../../helpers/manager/manager";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
import FormInput from "../../FormInput/FormInput";
import PostponeModal from "../PostponeModal/PostponeModal";
import ChangeAppointentManager from "../ChangeAppointentManager/ChangeAppointentManager";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";

const ChangeAppointment = ({
  isOpen,
  setIsOpenModal,
  handleClose,
  manager,
  id,
  course,
  crm,
  day,
  hour,
  managerIdInit,
  number,
  weekId,
  slotId,
  messageInit,
  age,
  isFollowUp,
  isOnControl,
}) => {
  const [isOpenPostpone, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [courseId, setCourses] = useState(course);
  const [message, setMessage] = useState("");
  const [managerId, setManagerId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [ageNew, setAge] = useState("");
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [onControl, setOnControl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userRole = useSelector((state) => state.auth.user.role);
  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    setCourses(course);
    setPhone(number);
    setMessage(messageInit);
    setLink(crm);
    setSlot(slotId);
    setManagerName(manager)
    setManagerId(managerIdInit)
    setAge(age)
    setFollowUp(isFollowUp)
    setOnControl(isOnControl)
  }, [course,number,messageInit,crm,slotId,manager,managerIdInit,age,isFollowUp,isOnControl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDateByWeekId(weekId, day);
        setDate(result.date);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [day, weekId]);
  return (
    <>
      <PostponeModal
        isOpen={isOpenPostpone}
        onClose={() => setIsOpen(false)}
        appointmentId={id}
        isAppointment
        link={link}
        courseId={courseId}
        day={day}
        hour={hour}
        phone={phone}
        age={ageNew}
        slotId={slot}
        weekId={weekId}
        message={message}
        date={date}
        isFollowUp={followUp}
        isOnControl={onControl}
      />
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
        {isLoading ? <div className={styles.loadingBackdrop}><TailSpin height="150px" width="150px" color="#999DFF" /></div> : null}
          <Form
            onClose={handleClose}
            isCancel={true}
            slotId={slot}
            onSubmit={() => {
              setIsLoading(true);
              const data = new FormData();
              data.append("crm_link", link);
              data.append("appointment_id", id);
              data.append("day", day);
              data.append("hour", hour);
              data.append("course_id", courseId);
              data.append("phone", phone);
              data.append("age", ageNew);
              data.append("manager_id", managerId);
              data.append("week_id", weekId);
              data.append("slot_id", slot);
              data.append("message", message);
              data.append("date", date);
              data.append("follow_up", followUp);
              data.append("on_control", onControl);
              data.append("postpone_role", userRole === 4 ? "caller" : userRole === 5 ? "confirmator" : userRole === 2 ? "manager" : "admin");
              data.append("userId", userId);
              return putAppointment(data).finally(() => {
                setLink("");
                setCourses("");
                setMessage("");
                setAge("");
                setPhone("");
                setSlot("");
                setManagerId("");
                setFollowUp(false);
                setOnControl(false);
                setIsLoading(false);
                handleClose();
              }).catch((err) => {
                error(err.response.data.message);
              });
            }}
            postpone
            postponeClick={() => setIsOpen(!isOpenPostpone)}
            handleClose={() => setIsOpenModal(!isOpen)}
            status={{
              successMessage: "Successfully created appointment",
              failMessage: "Failed to create appointment",
            }}
            type={{ type: "no-request" }}
            title="Change appointment info"
            removeMessage={message}
          >
            <p className={styles.input__title}>
              Manager:
              <span
                onClick={() => {
                  setIsChangeOpen(!isChangeOpen);
                }}
              >
                
                {managerName}
              </span>
            </p>
            {isChangeOpen ? (
              <ChangeAppointentManager
                isChangeAppointment={true}
                setManagerId={setManagerId}
                setManager={setManagerName}
                isOpen={isChangeOpen}
                handleClose={setIsChangeOpen}
                weekId={weekId}
                day={day}
                hour={hour}
                courseId={courseId}
                appointmentId={id}
                link={link}
                age={ageNew}
                phone={phone}
                message={message}
                isFollowUp={followUp}
                isOnControl={onControl}
                appointmentSlotId={slotId}
              />
            ) : null}
            <Select
              classname={styles.select__label}
              value={courseId}
              setValue={setCourses}
              request={getCourses}
              label="course"
              defaultValue="Select course"
              title="Course:"
            />
            <FormInput
              title="CRM link:"
              type="text"
              name="link"
              value={link}
              placeholder=""
              isRequired={true}
              handler={setLink}
            />
            <div className={styles.input__block}>
              <FormInput
                width="20%"
                classname="input__bottom__age"
                title="Age:"
                type="number"
                name="age"
                value={ageNew}
                placeholder="Age"
                isRequired={true}
                handler={setAge}
              />
              <FormInput
                width="70%"
                classname="input__bottom__phone"
                title="Phone Number:"
                type="Phone"
                name="Phone"
                max={13}
                value={phone}
                placeholder="Phone number"
                isRequired={true}
                handler={setPhone}
              />
            </div>
            <label className={styles.input__label}>
              <p className={styles.input__label}>Message</p>
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>
            <label className={styles.input__checkbox}>
              <input
                className={styles.input__checkboxInput}
                type="checkbox"
                checked={followUp}
                onChange={() => setFollowUp(!followUp)}
              />
              <p className={styles.input__checkboxLabel}>Перенос</p>
            </label>
            <label className={styles.input__checkbox}>
              <input
                className={styles.input__checkboxInput}
                type="checkbox"
                checked={onControl}
                onChange={() => setOnControl(!onControl)}
              />
              <p className={styles.input__checkboxLabel}>На контроль</p>
            </label>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeAppointment;
