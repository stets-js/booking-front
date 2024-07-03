import React from "react";
import { useState } from "react";
import styles from "./SortByBox.module.scss";
import { ClassNames } from "@emotion/react";
import classNames from "classnames";

export default function SortByBox({
  sortText,
  sortTextFunc,
  sortMan,
  sortMangFunc,
  sortStars,
  sortStarsFunc,
}) {
  const [sortStatus, setSortStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [selectedStars, setSelectedStars] = useState(false);

  const changeSortStatus = () => {
    const curSortStatus = sortStatus;
    if (curSortStatus) {
      setSortStatus(false);
      sortTextFunc(sortStatus);
    } else {
      setSortStatus(true);
      sortTextFunc(sortStatus);
    }
  };
  const changeSelectedStatus = () => {
    const curSelectStatus = selectedStatus;
    if (curSelectStatus) {
      setSelectedStatus(false);
      sortMangFunc(selectedStatus);
    } else {
      setSelectedStatus(true);
      sortMangFunc(selectedStatus);
    }
  };
  const changeSelectedStars = () => {
    const curSelectStatus = selectedStars;
    if (curSelectStatus) {
      setSelectedStars(false);
      sortStarsFunc(selectedStars);
    } else {
      setSelectedStars(true);
      sortStarsFunc(selectedStars);
    }
  };

  return (
    <div className={styles.container}>
      Sort By
      <div className={sortStatus ? styles.sortBox_on : styles.sortBox}>
        <div className={styles.sortBoxText} onClick={changeSortStatus}>
          {sortText}
        </div>
      </div>
      {sortMan ? (
        <>
          <div className={selectedStatus ? styles.sortBox_on : styles.sortBox}>
            <div className={styles.sortBoxText} onClick={changeSelectedStatus}>
              {sortMan}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {sortStars ? (
        <>
          <div className={selectedStatus ? styles.sortBox_on : styles.sortBox}>
            <div className={styles.sortBoxText} onClick={changeSelectedStars}>
              {sortStars}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );

}
