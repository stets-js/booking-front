import { defaults, error, success } from "@pnotify/core";
import React, { useState } from "react";
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

defaults.delay = 1000;

const Form = ({
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
  ...formData
}) => {
  console.log("startName--->>>>",startName)
  const [isOpen, setIsOpen] = useState(false);
  const [isChangeManagerCoursesOpen, setIsChangeManagerCoursesOpen] =
    useState(false);
  const [errorsuccessMessage, setError] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (type.type === "no-request-test") {
      return onSubmit();
    }
    if (type.type === "no-request") {
      if (onSubmit) {
        return onSubmit()
          // .catch((e) => {
          //   error(`${status.failMessage}, ${e.message}`);
          // })
          // .then(() => {
          //   // success(status.successMessage);
          // });
      }
      return;
    }
    try {
      event.preventDefault();
      const data = new FormData();
      for (const i in formData) {
        if (!formData[i]) {
          formData[i] = 2;
        }
        data.append(i, formData[i]);
      }
      isDescription && data.append("description", "test");

      if (+role === 2 && type.type === "put" && startRole !== 2) {
        const res = await getUserByName(startName);
        console.log("res",res)
        await requests.delete(res.data.id);
        return await postUser(data)
          .then(() => {
            success(status.successMessage);
            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch((e) => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }
      if (+role !== 2 && type.type === "put" && startRole === 2) {
        const manager = await requests.getByName(startName.trim());
        console.log("manager--->>>" , manager)
        await requests.managerDelete(manager.data.id);

        return await requests
          .post(data)
          .then(() => {
            success(status.successMessage);
            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch((e) => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }

      if (+role === 2 && type.type === "put") {
        const res = await requests.getByName(startName.trim());
        console.log("res2", res)
        if (data.get("role_id")) data.delete("role_id");
        return await requests
          .user(data, res.data.id)
          .then(() => {
            success(status.successMessage);
            return !errorsuccessMessage && onSubmit && onSubmit();
          })
          .catch((e) => {
            return error(`${status.failMessage}, ${e.message}`);
          });
      }

      if (+role === 2 && type.type === "post") {
        onSubmit();
        return await requests.user(data);
      }
      if (manager) {
        const res = await requests.getByName(startName.trim());
        console.log("res3", res)
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
            return !errorsuccessMessage && onSubmit && onSubmit();
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
          return !errorsuccessMessage && onSubmit && onSubmit();
        });
    } catch (e) {
      setError(!errorsuccessMessage);
      error(`${e.response.data.message ? e.response.data.message : e.message}`);
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (role === 2) {
      const res = await requests.getByName(startName.trim());
      console.log("manager res--->>>" , res)
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
      console.log("manager res2--->>>" , res)
      await requests.userDelete(res.data.id).catch((e) => {
        return error(`${status.failMessageDelete}, ${e.message}`);
      });
    }
console.log("!errorsuccessMessage",!errorsuccessMessage)
console.log("onSubmit", onSubmit)
console.log("onSubmit()", onSubmit())
    !errorsuccessMessage && onSubmit && onSubmit();
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
            <InputSubmit buttonTitle={buttonTitle ? buttonTitle : "Save"} />
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
              InputCancelFunc={() => {
                removeSlot(slotId);
              }}
            />
          ) : (
            ""
          )}
          {role === 2 ? (
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
                    messageInit={item.message}
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
    </div>
  );
};

export default Form;
