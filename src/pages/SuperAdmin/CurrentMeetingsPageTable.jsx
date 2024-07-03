import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../SuperAdmin/SuperAdminPage.module.scss";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import CurrentMeetingsStatusDefinition from "../../components/CurrentMeetingsStatusDefinition/CurrentMeetingsStatusDefinition";
import DayDatePicker from "../../components/DayDatePicker/DayDatePicker";
import MeetingsTable from "../../components/MeetingsTable/MeetingsTable";
import SortByBox from "../../components/SortByBox/SortByBox";

import {
  getCurrentAppointments,
  getWeekId2,
} from "../../helpers/manager/manager";
import CrmLinks from "../../components/CrmLinks/CrmLinks";

import RadioButton from "../../components/RadioButton/RadioButton";
import { changeTypeSelection } from "../../redux/manager/manager-operations";
import { getTypeSelection } from "../../redux/manager/manager-selectors";
import {
  changeStatusSlot,
  setManagerError,
  setManagerLoading,
} from "../../redux/manager/manager-operations";
import { updateSlot } from "../../helpers/week/week";
import SwapManagersComponent from "./SwapManagers";
import { TailSpin } from "react-loader-spinner";

function CurrentMeetingsPageTable() {
  const [currentSelectedSortStatus, setcurrentSelectedSortStatus] = useState(false);
  const [currentSelectedStars, setCurrentSelectedStars] = useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const isThatPhone = {
    isPhone: window.innerWidth <= 700,
  };

  const tableDate = new Date().toString();

  const [currentTableData, setCurrentTableData] = useState(null);
  const [isRenderTableAvailable, setIsRenderTableAvailable] = useState(false);
  const [cureentTableDataWeekId, setCureentTableDataWeekId] = useState(0);
  const [date, setDate] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  async function getTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(
      `${day}.${month}.${year}`
    ).then((res) => res.data);
    const filteredManagers =
      selectedTeam === "All"
        ? resManagers
        : resManagers.filter(
            (item) => item.team === parseInt(selectedTeam, 10)
          );

    setDate(`${day}.${month}.${year}`);
    const resWeekId = await getWeekId2(day, month, year).then((res) => res);
    setCurrentTableData(filteredManagers);
    setCureentTableDataWeekId(resWeekId);
    setIsRenderTableAvailable(true);
  }

  async function getNewTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(
      `${day}.${month}.${year}`
    ).then((res) => res.data);
    const filteredManagers =
      selectedTeam === "All"
        ? resManagers
        : resManagers.filter(
            (item) => item.team === parseInt(selectedTeam, 10)
          );
    setCurrentTableData(filteredManagers);
    setIsRenderTableAvailable(true);
  }

  const dispatch = useDispatch();
  const buttonType = useSelector(getTypeSelection);
  const onCheckedButton = (event) => {
    dispatch(changeTypeSelection(event.target.name));
  };

  return (
    <>
      <Header
        endpoints={[
          { text: "List View", path: path.currentManagersList },
          { text: "Table View", path: path.currentManagersTable },
          { text: "Managers analytics", path: path.managersAnalytics },
        ]}
      />
      <CurrentMeetingsStatusDefinition /> {/* statusDefinition */}
      <div className={styles.wrapperControlButtons}>
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonGreenFocus}
          styleColor={styles.controlButtonGreen}
          onChangeType={onCheckedButton}
          title="Consultations"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonOrangeFocus}
          styleColor={styles.controlButtonOrange}
          onChangeType={onCheckedButton}
          title="Working time"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonGrayFocus}
          styleColor={styles.controlButtonGray}
          onChangeType={onCheckedButton}
          title="Free"
        />
      </div>
      <DayDatePicker
        tableDate={tableDate}
        changeDateFn={getTableData}
        selectedTeam={selectedTeam}
        setIsLoading={setIsLoading}
      />
      <SortByBox
        sortText={"Selected"}
        sortTextFunc={setcurrentSelectedSortStatus}
        // sortStars={"Stars"}
        // sortStarsFunc={setCurrentSelectedStars}
      />
  
      {!isThatPhone.isPhone ? (
        isRenderTableAvailable ? (
          <>
            <select
              className={styles.managers__select}
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
              }}
            >
              <option value="All">All</option>
              <option value="1">Team 1</option>
              <option value="2">Team 2</option>
              <option value="3">Team 3</option>
              <option value="4">Team 4</option>
              <option value="5">Team 5</option>
              <option value="6">Team 6</option>
              <option value="7">Team 7</option>
              <option value="8">CB MIC</option>
              <option value="9">Without sale</option>
            </select>
            
            <MeetingsTable
              isLoading={isLoading}
              isTableView={true}
              isListView={false}
              weekId={cureentTableDataWeekId.id}
              dayIndex={cureentTableDataWeekId.day_index}
              table={currentTableData}
              selectedManagerIds={selectedManagerIds}
              setSelectedManagerIds={setSelectedManagerIds}
              currentSelectedSortStatus={currentSelectedSortStatus}
              currentSelectedStars={currentSelectedStars}
              date={date}
              getNewTableData={getNewTableData}
            />
            <SwapManagersComponent />
            <div className={styles.main_wrapper}>
              <div className={styles.main_wrapper2}>
                <CrmLinks />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.blank}>loading...</div>
        )
      ) : (
        <div className={styles.blank}>this table is for PC use only</div>
      )}
    </>
  );
}

export default CurrentMeetingsPageTable;
