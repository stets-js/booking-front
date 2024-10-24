import React from "react";
import { useState, useEffect } from "react";
import styles from "./CrmLinks.module.scss";
import { useSelector } from "react-redux";
import { getAppointmentByCrm } from "../../helpers/appointment/appointment";
import {
  getAnalyticByCrm,
  updateManagerAnalytic,
} from "../../helpers/manager/manager";
import FormInput from "../FormInput/FormInput";
import Form from "../Form/Form";
import { success, error, defaults } from "@pnotify/core";
import { Fade } from "react-awesome-reveal";
import { TailSpin } from "react-loader-spinner";

defaults.delay = 1000;

export default function CrmLinks({ setCourses, caller }) {
  const userRole = useSelector((state) => state.auth.user.role);
  const [link, setLink] = useState("");
  const [data, setData] = useState([0]);
  const [analyticData, setAnalyticData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  const handleUpdate = async (itemId) => {
    // Знаходимо елемент в `analyticData` за його ідентифікатором
    const updatedItemIndex = analyticData.findIndex(
      (item) => item.id === itemId
    );
    if (updatedItemIndex === -1) {
      console.error("Item with id", itemId, "not found");
      return;
    }

    const updatedItem = analyticData[updatedItemIndex];

    try {
      // Оновлюємо дані на сервері
      await updateManagerAnalytic(updatedItem);
      success("Analytic updated successfully");
      setAnalyticData([])
    } catch (error) {
      // Обробляємо помилку при оновленні
      console.error("Error updating item:", error);
    }
  };

useEffect(()=>{},[analyticData])

  return (
    <>
      <div className={styles.searching__wrapper}>
        <Fade cascade triggerOnce duration={500} direction="up">
          {caller ? (
            <Form
              onSubmit={async () => {
                const trimmedLink = link.trim();
                const formData = new FormData();
                formData.append("crm_link", trimmedLink);
                const res = await getAppointmentByCrm(formData)
                  .then((res) => {
                    setLink("");
                    setCourses(3);
                    success("Successfully found");
                    return res.data;
                  })
                  .catch((err) => {
                    error(`Appointment not found, ${err.message}`);
                    setData([undefined]);
                  });
                res && setData([res]);

                return res;
              }}
              isDescription={true}
              type={{ type: "no-request-test" }}
              status={{
                successMessage: "Successfully found",
                failMessage: "Appointment not found",
              }}
              buttonTitle={"Search"}
              width={"400px"}
              link={link.trim()}
              title={false}
              data={data}
            >
              <FormInput
                title="CRM link:"
                type="text"
                name="crm"
                value={link}
                width={"50%"}
                placeholder="CRM link"
                isRequired={true}
                handler={setLink}
              />
            </Form>
          ) : (
            <Form
              onSubmit={async () => {
                const trimmedLink = link.trim();
                const formData = new FormData();
                formData.append("crm_link", trimmedLink);
                const res = await getAppointmentByCrm(formData)
                  .then((res) => {
                    setLink("");
                    success("Successfully found");
                    return res.data;
                  })
                  .catch((err) => {
                    error(`Appointment not found, ${err.message}`);
                    setData([undefined]);
                  });
                res && setData([res]);

                return res;
              }}
              isDescription={true}
              type={{ type: "no-request-test" }}
              status={{
                successMessage: "Successfully found",
                failMessage: "Appointment not found",
              }}
              buttonTitle={"Search"}
              width={"400px"}
              link={link.trim()}
              title={false}
              data={data}
            >
              <FormInput
                title="CRM link:"
                type="text"
                name="crm"
                value={link}
                width={"50%"}
                placeholder="CRM link"
                isRequired={true}
                handler={setLink}
              />
            </Form>
          )}
        </Fade>
        {userRole === 3 && (
          <div
            className={styles.analytic__btn}
            onClick={async () => {
              setIsLoading(true)
              try {
                const res = await getAnalyticByCrm(link);
                setAnalyticData([res]);
                setIsLoading(false)
              } catch (e) {
                error(e.response.data.error);
                setIsLoading(false)
              }
            }}
          >
            Get analytic
          </div>
        )}
        {isLoading ? (
          <div className={styles.tailspin}>
            <TailSpin height="50px" width="50px" color="#999DFF" />
          </div>
        ) : (
          analyticData.length > 0 &&
          analyticData.map((item, index) => (
            <div key={item.id} className={styles.items__wrapper}>
              <div key={index} className={styles.item__wrapper}>
                <div className={styles.item__analytic}>
                  <label>Date:</label>
                  <p>{item.date}</p>
                </div>
                <div className={styles.item__analytic}>
                  <label>Zoho link:</label>
                  <a
                    href={item.zoho_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                </div>
                <div className={styles.item__analytic}>
                  <label>Course:</label>
                  <p>{item.course_name}</p>
                </div>
                <div className={styles.group__wrapper}>
                  <div className={styles.item__analytic}>
                    <label>Occurred:</label>
                    <input
                      type="number"
                      value={item.occurred}
                      min={0}
                      max={1}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        const updatedValue = Math.min(1, Math.max(0, newValue)); // Обмеження значення в діапазоні від 0 до 1
                        const updatedData = analyticData.map((analyticItem) => {
                          if (analyticItem.id === item.id) {
                            return { ...analyticItem, occurred: updatedValue };
                          }
                          return analyticItem;
                        });
                        setAnalyticData(updatedData);
                      }}
                    />
                  </div>
                  <div className={styles.item__analytic}>
                    <label>Bill:</label>
                    <input
                      type="number"
                      value={item.bill}
                      min={0}
                      max={1}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        const updatedValue = Math.min(1, Math.max(0, newValue)); // Обмеження значення в діапазоні від 0 до 1
                        const updatedData = analyticData.map((analyticItem) => {
                          if (analyticItem.id === item.id) {
                            return { ...analyticItem, bill: updatedValue };
                          }
                          return analyticItem;
                        });
                        setAnalyticData(updatedData);
                      }}
                    />
                  </div>
                  <div className={styles.item__analytic}>
                    <label>Bought:</label>
                    <input
                      type="number"
                      value={item.bought}
                      min={0}
                      max={1}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        const updatedValue = Math.min(1, Math.max(0, newValue)); // Обмеження значення в діапазоні від 0 до 1
                        const updatedData = analyticData.map((analyticItem) => {
                          if (analyticItem.id === item.id) {
                            return { ...analyticItem, bought: updatedValue };
                          }
                          return analyticItem;
                        });
                        setAnalyticData(updatedData);
                      }}
                    />
                  </div>
                  <div className={styles.item__analytic}>
                    <label>Price:</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const updatedData = analyticData.map((analyticItem) => {
                          if (analyticItem.id === item.id) {
                            return {
                              ...analyticItem,
                              price: parseFloat(e.target.value),
                            };
                          }
                          return analyticItem;
                        });
                        setAnalyticData(updatedData);
                      }}
                    />
                  </div>
                  <div className={styles.item__analytic}>
                  <label>Package:</label>
                  <select
                    value={item.package_period}
                    onChange={(e) => {
                      const updatedData = analyticData.map((analyticItem) => {
                        if (analyticItem.id === item.id) {
                          return {
                            ...analyticItem,
                            package_period: e.target.value,
                          };
                        }
                        return analyticItem;
                      });
                      setAnalyticData(updatedData);
                    }}
                  >
                    <option value="">-package-</option>
                    <option value="1">1 month</option>
                    <option value="3">3 month</option>
                    <option value="6">6 month</option>
                    <option value="7">7 month</option>
                    <option value="9">9 month</option>
                    <option value="12">12 month</option>
                    <option value="18">18 month</option>
                    <option value="24">24 month</option>
                  </select>
                </div>
                </div>
                <div className={styles.item__analytic}>
                  <label>Payment date:</label>
                  <input
                    type="date"
                    value={item.payment_date}
                    onChange={(e) => {
                      const updatedData = analyticData.map((analyticItem) => {
                        if (analyticItem.id === item.id) {
                          return {
                            ...analyticItem,
                            payment_date: e.target.value,
                          };
                        }
                        return analyticItem;
                      });
                      setAnalyticData(updatedData);
                    }}
                  />
                </div>
                <div className={styles.item__analytic}>
                  <label>Comments:</label>
                  <input
                    type="text"
                    value={item.comments}
                    onMouseEnter={() => setShowTooltip(index)}
                    onMouseLeave={() => setShowTooltip(null)}
                    onChange={(e) => {
                      const updatedData = analyticData.map((analyticItem) => {
                        if (analyticItem.id === item.id) {
                          return { ...analyticItem, comments: e.target.value };
                        }
                        return analyticItem;
                      });
                      setAnalyticData(updatedData);
                    }}
                  />
                  {showTooltip === index && (
                    <div className={styles.comment__tooltip}>
                      {item.comments}
                    </div>
                  )}
                </div>

                <div className={styles.item__analytic}>
                  <label>Time:</label>
                  <p>{item.time}</p>
                </div>
                <div className={styles.item__analytic}>
                  <label>Manager:</label>
                  <p>{item.manager_id}</p>
                </div>

                <div className={styles.item__analytic}>
                  <label>YouTube:</label>
                  <input
                    type="text"
                    value={item.you_tube}
                    onChange={(e) => {
                      const updatedData = analyticData.map((analyticItem) => {
                        if (analyticItem.id === item.id) {
                          return { ...analyticItem, you_tube: e.target.value };
                        }
                        return analyticItem;
                      });
                      setAnalyticData(updatedData);
                    }}
                  />
                </div>
                <button
                  className={styles.item__btn}
                  onClick={() => handleUpdate(item.id)}
                >
                  Update
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
