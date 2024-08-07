import styles from "./NewAppointment.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";
import { alert, notice, info, success, error } from "@pnotify/core";
import {
  getAvailableManagers,
  getCurrentAppointments,
  getManagerById,
  getDateByWeekId,
  getAvailableManagersByCourse,
} from "../../../helpers/manager/manager";
import {
  createAppointment,
  getAppointment,
} from "../../../helpers/appointment/appointment";
import { getCourses } from "../../../helpers/course/course";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
import FormInput from "../../FormInput/FormInput";
import DropList from "../../DropList/DropList";
import { useDispatch } from "react-redux";
import { getCallerWeek, getCallerWeekByCourse } from "../../../redux/caller/caller-operations";
import ChangeAppointentManager from "../ChangeAppointentManager/ChangeAppointentManager";

import { useSelector } from "react-redux";
import { getCallerDate } from "../../../redux/caller/caller-selectors";
import moment from "moment";
import { TailSpin } from "react-loader-spinner";
import {freezeSlotStatus} from "../../../helpers/slot/slot";
import axios from "axios";

import { useGoogleOneTapLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';

const NewAppointment = ({
  isOpen,
  handleClose,
  time,
  weekId,
  dayIndex,
  slotId,
  hourIndex,
  courseIdx,
  callerName,
}) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState("");
  const [courseId, setCourses] = useState(courseIdx);
  const [manager, setManager] = useState("");
  const [appointment, setAppointment] = useState({});
  const [managerId, setManagerId] = useState("");
  const [message, setMessage] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [age, setAge] = useState(0);
  const [phone, setPhone] = useState("");
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [appointmentId, setAppointmentId] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [appointmentType, setAppointmentType] = useState("Individual Lesson");
  const [isLoading, setIsLoading] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    !isOpen && dispatch(getCallerWeekByCourse({ weekId, courseId: courseIdx }));
  }, [isOpen, dispatch]);

  console.log("slotId----", slotId)
  // useEffect(() => {
  //   const get = async () => await getAppointment({ id: slotId });
  //   get().then((data) => setAppointment(data.data));
  // }, []);

  
  useEffect(() => {
    const date = async () => await getDateByWeekId(weekId, dayIndex);
    date()
      .then((data) => {
        const currentDate = data.date;  
        const get = async () => await getCurrentAppointments(currentDate);
        return get();
      })
      .then((data) => { setAppointmentData(data.data) });
  }, [isOpen]);

  const callerDate = new Date(useSelector(getCallerDate));
  const day = moment(callerDate).add(dayIndex, "days").date() < 10
              ? `0${moment(callerDate).add(dayIndex, "days").date()}`
              : moment(callerDate).add(dayIndex, "days").date();
  const month = moment(callerDate).add(dayIndex, "days").month() + 1 < 10
      ? `0${moment(callerDate).add(dayIndex, "days").month() + 1}`
      : moment(callerDate).add(dayIndex, "days").month() + 1;
  
      useEffect(() => {
        const date = `2024-${month}-${day}`;
        setIsLoading(true);
        if (date && time && managerId) {
          freezeSlotStatus(date, time, managerId)
            .then((data) => {
              setIsFrozen(data.is_freeze);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error('An error occurred:', error);
              setIsLoading(false);
            });
        }
      }, [managerId, isOpen]);


  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          {isLoading ? <div className={styles.loadingBackdrop}><TailSpin height="150px" width="150px" color="#999DFF" /></div> : null}
          <Form
            onSubmit={() => {
              const data = new FormData();
              data.append("crm_link", link);
              setIsLoading(true);
              createAppointment(
                data,
                managerId,
                weekId,
                dayIndex,
                hourIndex,
                courseIdx,
                phone,
                age,
                message,
                callerName,
                appointmentType
              )
              .then(() => {
                success({
                  text: "Appointment successfully created",
                });
                setLink("");
                setCourses("");
                setMessage("");
                setAge(0);
                setPhone("");
                setAppointmentType("Individual Lesson");
                setIsLoading(false);
                handleClose();
              })
              .catch(() => {
                error({
                  text: "This time appears to be already reserved, please change the appointment time",
                });
                setIsLoading(false);
              });
            }}
            status={{
              successMessage: "Successfully created appointment",
              failMessage: "Failed to create appointment",
            }}
            type={{ type: "no-request" }}
            title="Create an appointment"
          >
            <span
              onClick={() => {
                setIsChangeOpen(!isChangeOpen);
              }}
            >
              <DropList
                title="Manager"
                value={manager}
                appointment={true}
                managerIdI={managerId}
                setValue={setManager}
                setValueSecondary={setManagerId}
                request={() =>
                  getAvailableManagersByCourse(weekId, dayIndex, hourIndex, +courseIdx)
                }
                requestAdditional={(managerId) => {getManagerById(managerId)
                  const date = `2024-${month}-${day}`;
                  setIsLoading(true);
                  freezeSlotStatus(date, time, managerId).then((data) => {setIsFrozen(data.is_freeze)
                    setIsLoading(false)}).catch(error => {
                      console.error('An error occurred:', error);
                      setIsLoading(false);
                    });
                }}
              />
            </span>
            <span className={styles.date_label}>
              Date: {day}.{month}.2024 Time: {time}:00
            </span>
            {isChangeOpen ? (
              <ChangeAppointentManager
                isCreateAppointment={true}
                setManagerId={setManagerId}
                setManager={setManager}
                isOpen={isChangeOpen}
                handleClose={setIsChangeOpen}
                weekId={weekId}
                day={dayIndex}
                hour={hourIndex}
                courseId={courseIdx}
                appointmentId={appointment.id}
                link={link}
                age={age}
                phone={phone}
                message={message}
                appointmentSlotId={slotId}
              />
            ) : null}
              {isFrozen ? <p className={styles.frozen}>!!! SLOT IS FROZEN !!!</p> : null}
            <Select
              classname={styles.select__label}
              value={courseIdx}
              setValue={setCourses}
              request={getCourses}
              label="course"
              defaultValue="Select course"
              title="Course:"
            />
            <label className={styles.input__label}>
              <p className={styles.input__label}>Type:</p>
                  <select
                    className={styles.select}
                    value={appointmentType}
                    onChange={(e) => {
                      setAppointmentType(e.target.value);
                    }}
                  >
                    <option value="Individual Lesson">Individual Lesson</option>
                    <option value="Group Lesson">Group Lesson</option>
                    <option value="IL from CHM">IL from CHM</option>
                    <option value="IL from CL">IL from CL</option>
                    <option value="Demo Trial">Demo Trial</option>
                  </select>
            </label>
            <FormInput
              title="CRM link:"
              type="text"
              name="link"
              value={link}
              placeholder="https://crm.zoho.eu/...."
              isRequired={true}
              handler={setLink}
              pattern="^https://crm.zoho.eu/.*$"
            />
            <div className={styles.input__block}>
              <FormInput
                width="20%"
                classname="input__bottom__age"
                title="Age:"
                type="number"
                name="age"
                value={age}
                placeholder="Age"
                isRequired={true}
                handler={setAge}
              />
              <FormInput
                width="70%"
                classname="input__bottom__phone"
                title="Phone Number:"
                type="text"
                name="Phone"
                max={13}
                value={phone}
                placeholder="Phone number"
                // isRequired={true}
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
          </Form>
        </Modal>
        )}
    </>
  );
};

export default NewAppointment;
