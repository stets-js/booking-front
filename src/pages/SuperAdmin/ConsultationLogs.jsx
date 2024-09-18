import React, { useState, useEffect } from "react";
import styles from "./SuperAdminPage.module.scss";
import { v4 as uuidv4 } from "uuid";
import SearchSVG from "./Search_svg";
import { useLinkClickHandler } from "react-router-dom";
import { getHistory, getAppointmentHistory } from "../../helpers/history/history";
import { TailSpin } from "react-loader-spinner";
import SortIcon from "../Manager/SortIcon";

export default function ConsultationLogs() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [sortDate, setSortDate] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState(null);

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

  const handleActionClick = (action) => {
      setSelectedAction(action);
  };

  const isActiveAction = (action) => {
      return selectedAction === action ? styles.activeSelectedAction : "";
  };

  useEffect(() => {
      async function getData(month) {
          setIsLoading(true);
          try {
              const res = await getHistory(month);
              setIsLoading(false);
              sortAndSetData(res.data);
          } catch (err) {
              console.error("Error fetching data:", err);
              setIsLoading(false);
          }
      }
      getData(month);
  }, [month, sortDate, selectedAction]);

  const sortAndSetData = (data) => {
      if (sortDate) {
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
          data.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      const filteredData = selectedAction ? data.filter(item => item.action === selectedAction) : data;
      setData(filteredData);
      setCurrentPage(1);
  };

  const clickHandler = async () => {
      try {
          setIsLoading(true);
          const formData = new FormData();
          formData.append('zoho_link', inputValue);
          const res = await getAppointmentHistory(formData);
          setData(res.data);
          setCurrentPage(1);
          setSelectedAction(null);
      } catch (error) {
          console.error("Error fetching appointment logs:", error);
      } finally {
          setIsLoading(false);
          setInputValue("");
      }
  };

  const handleInputChange = (e) => {
      setInputValue(e.target.value);
  };

  const handlePreviousPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

  const handleNextPage = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
      }
  };

  const totalPages = data ? Math.ceil(data.length / 20) : 0;
  const dataForCurrentPage = data ? data.slice((currentPage - 1) * 20, currentPage * 20) : [];

  return (
      <>
          <div className={styles.search__container}>
              <div className={styles.search__wrapper}>
                  <input className={styles.search__input} type="text" placeholder="Enter CRM link..." value={inputValue}
                      onChange={handleInputChange} />
                  <button className={styles.search__btn} onClick={clickHandler} type="button">{isLoading ? <TailSpin height="30px" width="30px" color="#999DFF" /> : <SearchSVG />}</button>
              </div>
              <select
                  className={styles.select}
                  value={months.find((mo) => mo.value === month)?.label}
                  onChange={(e) => {
                      const selectedMonth = months.find(
                          (month) => month.label === e.target.value
                      );
                      setMonth(+selectedMonth?.value || 1);
                      setCurrentPage(1);
                      setSelectedAction(null);
                  }}
              >
                  {months.map((m, index) => (
                      <option key={index} value={m.label}>
                          {m.label}
                      </option>
                  ))}
              </select>
          </div>
          <div className={styles.sort__instruments}>
              <div
                  className={styles.sort__item}
                  onClick={() => {
                      setSortDate(!sortDate);
                      setSelectedAction(null);
                  }}
              >
                  <p>Date sorting</p>
                  <SortIcon />
              </div>
              <div className={styles.actions__container}>
                  <button onClick={() => handleActionClick("Create")} className={`${isActiveAction("Create")}`}>Create</button>
                  <button onClick={() => handleActionClick("Delete")} className={`${isActiveAction("Delete")}`}>Delete</button>
                  <button onClick={() => handleActionClick("Confirmed")} className={`${isActiveAction("Confirmed")}`}>Confirmed</button>
                  <button onClick={() => handleActionClick("Postpone")} className={`${isActiveAction("Postpone")}`}>Postpone</button>
                  <button onClick={() => handleActionClick("Update")} className={`${isActiveAction("Update")}`}>Update</button>
                  <button onClick={() => handleActionClick("Swapped")} className={`${isActiveAction("Swapped")}`}>Swapped</button>
              </div>
          </div>
          {dataForCurrentPage.length > 0 ? (
              <div className={styles.data__wrapper}>
                  {isLoading ? <div className={styles.loadingBackdrop}><TailSpin height="150px" width="150px" color="#999DFF" /></div> : null}
                  {dataForCurrentPage.map((item) => (
                      <div key={uuidv4()} className={`${styles.data__item} ${
                          item.action === "Create" ? styles.create :
                              item.action === "Delete" ? styles.delete :
                                  item.action === "Confirmed" ? styles.confirmed :
                                      item.action === "Postpone" ? styles.postpone :
                                          item.action === "Update" ? styles.update :
                                              item.action === "Swapped" ? styles.swapped : ""
                      }`}>
                          <div className={styles.data__cell}>{new Date(new Date(item.date).getTime() - 3 * 60 * 60 * 1000).toLocaleString()}</div>
                          <div className={styles.data__cell}>{item.name}</div>
                          <div className={styles.data__cell}>{item.action}</div>
                          <div className={styles.data__cell}>{item.zoho_link}</div>
                          <div className={styles.data__cell}>{item.comments}</div>
                      </div>
                  ))}
              </div>
          ) : (<p style={{ marginTop: '100px' }}>No DATA available</p>)}

          <div className={styles.pagination}>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
      </>
  )
}