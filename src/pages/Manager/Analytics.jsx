import React, { useEffect, useState, useRef } from "react";
import styles from "./ManagerPage.module.scss";
import {
  getManagerAnalytic,
  updateManagerAnalytic,
} from "../../helpers/manager/manager";
import { success, error, defaults } from "@pnotify/core";
import { TailSpin } from "react-loader-spinner";
import NoData from "../SuperAdmin/NoData";
import SortIcon from "./SortIcon";
import {getCourses} from "../../helpers/course/course";

const Analytics = () => {
  const manager_id = window.location.pathname.split("/")[2];
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date().getMonth() + 1);
  const [analyticData, setAnalyticData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showTooltip, setShowTooltip] = useState(null);
  const [sortDate, setSortDate] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");


  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    setIsLoading(true);

    const getData = async (manager_id, date) => {
      try {
        const courses = await getCourses();
        setAllCourses(courses.data);
        const res = await getManagerAnalytic(manager_id, date);
        if (sortDate) {
          // Сортування за датою в порядку зростання
          res.sort((a, b) => {
            let dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison === 0) {
              return new Date(a.time) - new Date(b.time);
            }
            return dateComparison;
          });
        } else {
          // Сортування за датою в порядку спадання
          res.sort((a, b) => {
            let dateComparison = new Date(b.date) - new Date(a.date);
            if (dateComparison === 0) {
              return new Date(a.time) - new Date(b.time);
            }
            return dateComparison;
          });
        }
        setAnalyticData(res);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching manager analytic data:", err);
        error(err);
        setIsLoading(false);
      }
    };

    getData(manager_id, date);
  }, [date, sortDate, selectedCourse]);

  const handleUpdate = async (itemId) => {
    const updatedItemIndex = analyticData.findIndex(
      (item) => item.id === itemId
    );
    if (updatedItemIndex === -1) {
      console.error("Item with id", itemId, "not found");
      return;
    }

    const updatedItem = analyticData[updatedItemIndex];

    try {
      await updateManagerAnalytic(updatedItem);
      success("Analytic updated successfully");
      console.log("Updated item:", updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Фільтрація даних за зазначеним терміном пошуку та вибраним курсом
  const filteredData = analyticData
    .filter((item) =>
      selectedCourse === "All" ? true : item.course_name === selectedCourse
    )
    .filter((item) =>
      searchTerm ? item.zoho_link.includes(searchTerm) : true
    )
    .filter((item) =>
      searchDate ? item.date.includes(searchDate) : true
    );

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const occurredTotal = analyticData.reduce(
    (total, item) => total + item.occurred,
    0
  );
  const billTotal = analyticData.reduce((total, item) => total + item.bill, 0);
  const boughtTotal = analyticData.reduce(
    (total, item) => total + item.bought,
    0
  );
  const priceTotal = analyticData.reduce(
    (total, item) => {
      if (item.bought === 1) {
        return total + item.price;
      } else {
        return total;
      }
    },
    0
  );

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleClickOutside = (event) => {
    if (textareaRef.current && !textareaRef.current.contains(event.target)) {
      setShowTooltip(null);
    }
  };

  // Створюємо посилання на textarea
  const textareaRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className={styles.btn__wrapper}>
        <input
          className={styles.searchDateInput}
          type="text"
          placeholder="Search Date YEAR-MONTH-DAY"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          className={styles.searchTermInput}
          type="text"
          placeholder="Search Zoho link"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.select}
          value={months.find((month) => month.value === date)?.label}
          onChange={(e) => {
            const selectedMonth = months.find(
              (month) => month.label === e.target.value
            );
            setDate(+selectedMonth?.value || 1);
          }}
        >
          {months.map((m, index) => (
            <option key={index} value={m.label}>
              {m.label}
            </option>
          ))}
        </select>
        <select
              className={styles.select}
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="All">All</option>
              {allCourses.map((course) => (
                <option value={course.name} key={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
      </div>
      <div className={styles.sort__wrapper}>
        <div
          className={styles.sort__item}
          onClick={() => {
            setSortDate(!sortDate);
          }}
        >
          <p>Date sorting</p>
          <SortIcon />
        </div>
      </div>
      {isLoading ? (
        <div className={styles.tailspin}>
          <TailSpin height="150px" width="150px" color="#999DFF" />
        </div>
      ) : currentPageData.length > 0 ? (
        currentPageData.map((item, index) => (
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
                      const updatedValue = Math.min(1, Math.max(0, newValue));
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
                <div className={styles.item__analytic__price}>
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
              <div className={styles.item__analytic__comment}>
                <label>Comments:</label>
                {showTooltip === index ? (
                  <textarea
                    ref={textareaRef} // Прив'язуємо посилання до textarea
                    value={item.comments}
                    onChange={(e) => {
                      const updatedData = analyticData.map((analyticItem) => {
                        if (analyticItem.id === item.id) {
                          return { ...analyticItem, comments: e.target.value };
                        }
                        return analyticItem;
                      });
                      setAnalyticData(updatedData);
                    }}
                    className={styles.comment__textarea}
                  />
                ) : (
                  <div
                    className={styles.comment__view}
                    onClick={() => setShowTooltip(index)}
                  >
                    {item.comments.length > 10
                      ? item.comments.substring(0, 10) + "..."
                      : item.comments || "No comment"}
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
      ) : (
        <div className={styles.noData}>
          <NoData />
        </div>
      )}
      {/* Блок з заголовком та загальною сумою */}
      <div className={styles.managerTotal}>
        <h2>Manager TOTAL:</h2>
        <div className={styles.totalItem}>
          <p>Occurred total:</p>
          <p>{occurredTotal}</p>
        </div>
        <div className={styles.totalItem}>
          <p>Bill total:</p>
          <p>{billTotal}</p>
        </div>
        <div className={styles.totalItem}>
          <p>Bought total:</p>
          <p>{boughtTotal}</p>
        </div>
        <div className={styles.totalItem}>
          <p>Price total:</p>
          <p>{priceTotal} uah</p>
        </div>
      </div>
      {/* Кнопки пагінації */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={endIndex >= filteredData.length}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Analytics;
