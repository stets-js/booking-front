import { success, error, defaults } from "@pnotify/core";
import React, { useState } from "react";
import styles from "../SuperAdmin/GoogleSheets.module.scss";
import { pushToGoogleSheet } from "../../helpers/analytics/analytics";
import { setNewManagersRating } from "../../helpers/manager/manager";
import loadingGif from "../SuperAdmin/boy_loader.gif";

const GoogleSheets = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  
  const isDatesSelected = startDate !== "" && endDate !== "";
  
  const sendDataToEndpoint = async (endpoint) => {
    try {
      if (!startDate || !endDate) {
        error("Select date first!")
      }
      
      const formData = new FormData();
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      
      setIsLoading(true)
      await pushToGoogleSheet(formData, endpoint);
      setIsLoading(false)
      success("Successfully downloaded!");

    } catch (err) {
      error("Error:", err);
      setIsLoading(false)
    }
  };

  const setManagersRating = async () => {
    try {
      setIsLoading(true)
      await setNewManagersRating()
      setIsLoading(false)
      success("Managers rating successfully updated!")
    } catch (err) {
      setIsLoading(false)
      error("Error:", err);      
    } 
  }

  return (
    <>
    <div className={styles.loader__wrapper}>
      <p className={styles.main__title}>Set date range:</p>
      <div className={styles.date__wrapper}>
        <input
          type="date"
          className={styles.date__input}
          value={startDate}
          onChange={handleStartDateChange}
          required={true}
        />
        <input
          type="date"
          className={styles.date__input}
          value={endDate}
          onChange={handleEndDateChange}
          required={true}
          min={startDate}
        />
      </div>
      <div className={styles.wrapper}>
      <div className={styles.btn__wrapper}>
        <button onClick={() => sendDataToEndpoint("push_analytics_by_date_3_1")} disabled={!isDatesSelected} >
        Relation 3-1
        </button>
        <button onClick={() => sendDataToEndpoint("push_analytics_by_date_4_3")} disabled={!isDatesSelected} >
        Relation 4-3
        </button>
        <button onClick={() => sendDataToEndpoint("push_analytics_by_date_7_4")} disabled={!isDatesSelected} >
        Relation 7-4
        </button>
        <button onClick={() => sendDataToEndpoint("push_analytics_by_date_8_4")} disabled={!isDatesSelected} >
        Relation 8-4
        </button>
        <button onClick={() => sendDataToEndpoint("push_analytics_by_date_7_3")} disabled={!isDatesSelected} >
        Relation 7-3
        </button>
        <button onClick={() => sendDataToEndpoint("push_manager_analytic_by_date")} disabled={!isDatesSelected} >
        Sales
        </button>
        <button onClick={() => sendDataToEndpoint("push_all_manager_analytic_by_date")} disabled={!isDatesSelected} >
        Sales by month
        </button>
        <button onClick={() => sendDataToEndpoint("push_managers_working_slots_by_date")} disabled={!isDatesSelected} >
          Working Slots
        </button>
        </div>
      
      </div>
      <div>
      <p className={styles.rating__title}>Set new managers rating:</p>
      <button onClick={()=> setManagersRating()} type="button" className={styles.rating}>Update managers rating</button>

      {isLoading ? <img src={loadingGif} alt="loading..." className={styles.loader} /> : null}
      </div>
      </div>
    </>
  );
};

export default GoogleSheets;
