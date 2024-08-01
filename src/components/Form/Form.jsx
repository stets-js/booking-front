import React, { useState } from "react";
import { defaults, error, success } from "@pnotify/core";
import { Fade } from "react-awesome-reveal";
import { removeSlot } from "../../helpers/confirmation/avaliable";
import { getUserByName, postUser } from "../../helpers/user/user";
import InputCancel from "../InputCancel/InputCancel";
import InputDelete from "../InputDelete/InputDelete";
import InputSubmit from "../InputSubmit/InputSubmit";
import OpenChangeManagerCourses from "../OpenChangeManagerCourses/OpenChangeManagerCourses";
import ChangeAppointment from "../modals/ChangeAppointment/ChangeAppointment";
import ChangeManagerCourses from "../modals/ChangeManagerCourses/ChangeManagerCourses";
import styles from "./Form.module.scss";

import { getCourses } from "../../helpers/course/course";
import Select from "../../components/Select/Select";

defaults.delay = 1000;

const Form = ({
  onClose,
  type,
  postpone,
  postponeClick,
  onSubmit,
  title,
  id,
  startRole,
  requests,
  children,
  width,
  text,
  role,
  startName,
  handleClose,
  isDelete,
  isCancel,
  isDescription,
  manager,
  buttonTitle,
  data,
  status,
  slotId,
  cancelConfConsultOnClickFn,
  isCancelConfConsult,
  signUp,
  removeMessage,
  successConfirm,
  isSubmitDisabled,
  ...formData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChangeManagerCoursesOpen, setIsChangeManagerCoursesOpen] =
    useState(false);
  const [isError, setError] = useState(false);
  const [inputCancelClicked, setInputCancelClicked] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  
  const [course, setCourse] = useState("");

  const handleConfirm = async () => {
    setIsConfirmationOpen(false);
    await handleSubmitConfirmed();
  };

  const handleCancel = () => {
    setIsConfirmationOpen(false);
  };

  const handleSubmitConfirmed = async () => {
    if (type.type === "no-request-test") {
      return onSubmit();
    }
    if (type.type === "no-request") {
      if (onSubmit && !inputCancelClicked) {
        return onSubmit();
      }
      setInputCancelClicked(false);
      return;
    }
    try {
      const data = new FormData();
      for (const i in formData) {
        if (role != 2 && formData[i] === undefined) {
          continue;
        }
        if (!formData[i].toString()) {
          formData[i] = 2;
        }
        data.append(i, formData[i]);
      }
      isDescription && data.append("description", "test");

      if (+role === 2 && type.type === "put" && startRole !== 2) {
        const res = await getUserByName(startName);
        await requests.delete(res.data.id);
        return await postUser(data)
          .then(() => {
            success(status.successMessage);
            return !isError&& onSubmit && onSubmit();
          })
          .catch((e) => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }
      if (+role !== 2 && type.type === "put" && startRole === 2) {
        const manager = await requests.getByName(startName.trim());
        await requests.managerDelete(manager.data.id);

        return await requests
          .post(data)
          .then(() => {
            success(status.successMessage);
            return !isError&& onSubmit && onSubmit();
          })
          .catch((e) => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }

      if (+role === 2 && type.type === "put") {
        const res = await requests.getByName(startName.trim());
        if (data.get("role_id")) data.delete("role_id");
        return await requests
          .user(data, res.data.id)
          .then(() => {
            success(status.successMessage);
            return !isError&& onSubmit && onSubmit();
          })
          .catch((e) => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }

      if (+role === 2 && type.type === "post") {
        onSubmit();
        return await requests.post(data);
      }
      if (type.type === "login") {
        onSubmit();
        return await requests.login(data);
      }
      if (+role !== 2 && type.type === "user") {
        data.append("role_id", role);
        onSubmit();
        return await requests.user(data);
      }
      if (manager) {
        const res = await requests.getByName(startName.trim());
        onSubmit();
        return await requests.user(data, res.data.id).catch(() => {
          return error(status.failMessage);
        });
      }
      if (type.type === "post") {
        return await requests
          .post(data)
          .catch((e) => {
            return error(
              `${e.response.data.message ? e.response.data.message : e.message}`
            );
          })
          .then(() => {
            success(status.successMessage);
            return !isError&& onSubmit && onSubmit();
          });
      }

      await requests[type.type](data, requests.additional)
        .catch((e) => {
          return error(
            `${e.response.data.message ? e.response.data.message : e.message}`
          );
        })
        .then(() => {
          success(status.successMessage);
          return !isError&& onSubmit && onSubmit();
        });
    } catch (e) {
      setError(!isError);
      error(`${e.response.data.message ? e.response.data.message : e.message}`);
      console.error(e);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (successConfirm) {
      setIsConfirmationOpen(true);
      const course = await getCourses().then((data) =>
        data.data.find((c) => c.id === +formData.course)
      );
      console.log("courses", course);
      setCourse(course.name);
    } else {
      await handleSubmitConfirmed();
    }
  };

  const handleDelete = async () => {
    if (role === 2) {
      const res = await requests.getByName(startName.trim());
      onSubmit();
      return await requests
        .managerDelete(res.data.id)
        .catch(() => {
          return error(status.failMessageDelete);
        })
        .then(() => {
          return success(status.successMessageDelete);
        });
    }

    await requests
      .delete(requests.additional)
      .catch((e) => {
        return error(`${status.failMessageDelete}, ${e.message}`);
      })
      .then(() => {
        return success(status.successMessageDelete);
      });
    if (+role === 2 && type.additionalType === "delete") {
      const res = await requests.getByName(startName.trim());
      await requests.userDelete(res.data.id).catch((e) => {
        return error(`${status.failMessageDelete}, ${e.message}`);
      });
    }
    !isError&& onSubmit && onSubmit();
  };

  return (
    <div className={styles.modal} style={{ width: width }}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className={styles.form}
      >
        {children}
        <div className={styles.button__wrapper}>
          {type.button === "login" && (
            <button
              type="button"
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={styles.login}
            >
              Log in
            </button>
          )}
          {type.button === "signup" && (
            <button
              type="button"
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={styles.signup}
            >
              Sign Up
            </button>
          )}{" "}
          {!type.button && (
            <InputSubmit disabled={isSubmitDisabled} buttonTitle={buttonTitle ? buttonTitle : "Save"} />
          )}
          {isCancelConfConsult && (
            <InputDelete handleDelete={cancelConfConsultOnClickFn} />
          )}
          {type.additionalType && <InputDelete handleDelete={handleDelete} />}
          {postpone && (
            <button
              className={styles.input__submit}
              type="button"
              onClick={() => {
                postponeClick();
                handleClose();
              }}
            >
              Postpone
            </button>
          )}
          {isCancel ? (
            <InputCancel
              InputCancelFunc={(reason) => {
                setInputCancelClicked(true);
                removeSlot(slotId, reason, removeMessage);
                onClose();
              }}
            />
          ) : (
            ""
          )}
          {role === 2 && !signUp ? (
            <>
              <OpenChangeManagerCourses
                OpenChangeManagerCoursesFunc={setIsChangeManagerCoursesOpen}
                curState={isChangeManagerCoursesOpen}
              />

              {isChangeManagerCoursesOpen ? (
                <ChangeManagerCourses
                  managerId={id}
                  handleClose={() => {
                    setIsChangeManagerCoursesOpen(!isChangeManagerCoursesOpen);
                  }}
                />
              ) : null}
            </>
          ) : (
            ""
          )}
        </div>
      </form>
      {type.type === "no-request-test" &&
      data.length > 0 &&
      data[0] !== 0 &&
      data[0] !== undefined
        ? data.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <Fade cascade triggerOnce duration={300} direction="up">
                  <ChangeAppointment
                    isOpen={isOpen}
                    setIsOpenModal={setIsOpen}
                    handleClose={() => setIsOpen(!isOpen)}
                    manager={item.manager_name}
                    managerIdInit={item.manager_id}
                    id={item.appointment_id}
                    weekId={item.week_id}
                    course={item.course_id}
                    crm={item.crm_link}
                    day={item.day}
                    hour={item.hour}
                    slotId={item.slot_id}
                    number={item.phone}
                    messageInit={item.comments}
                    age={item.age}
                    isFollowUp={item.follow_up}
                    isOnControl={item.on_control}
                  />
                  <div
                    className={styles.appointment}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <p className={styles.appointment__data}>
                      {item.date.slice(0, 11)},{" "}
                      {item.hour > 9 ? item.hour : "0" + item.hour}:00{" "}
                      {item.course}, {item.manager_name}, {item.phone}{" "}
                    </p>
                  </div>
                </Fade>
              </React.Fragment>
            );
          })
        : type.type === "no-request-test" &&
          data[0] === undefined && (
            <p className={styles.appointment__data}>
              There are no scheduled appointments for this CRM link
            </p>
          )}
      {text}
      {type.type !== "no-request-test" && (
        <p className={styles.exit}>Click outside to exit</p>
      )}
      {isConfirmationOpen && successConfirm && (
        <div className={styles.confirmationBackdrop}>
        <div className={styles.confirmationModal}>
          <p className={styles.confirmationTitle}>Submit the form with selected course?</p>
          <p className={styles.courseTitle}>Course: <span className={styles.courseTitleAccent}>{course}</span></p>
          <div className={styles.btn_wrapper}>

          <button onClick={handleConfirm} className={styles.yesButton}>
            Yes
          </button>
          <button onClick={handleCancel} className={styles.noButton}>
            No
          </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Form;
