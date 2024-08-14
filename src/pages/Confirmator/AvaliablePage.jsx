import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AvaliablePage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Confirmator from "../../components/Confirmation/Confirmation";
import Avaliable from "../../components/Confirmation/Avaliable";
import ConfirmationButtons from "../../components/ConfirmationButtons/ConfirmationButtons";
import Header from "../../components/Header/Header";
import { useParams } from "react-router-dom";
import { getCurrentConfirmator } from "../../redux/confirmator/avaliable-operations";
import ConfirmatorComments from "../../components/ConfirmatorComments/ConfirmatorComments";
import AvaliableDatePicker from "../../components/ConfirmatorDatePicker/AvaliableDatePicker";
import { getUserById } from "../../helpers/user/user";
import { getConfirmatorAppointments } from "../../redux/confirmator/avaliable-selectors";

import path from "../../helpers/routerPath";

const AvaliablePage = () => {
  const [value, setValue] = useState("");
  // const { confirmatorId } = useParams();
  const confirmatorId=3 ;
  const [confirmatorName, setConfirmatorName] = useState("");
  const appointments = useSelector(getConfirmatorAppointments);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentConfirmator());
    
    getUserById(+confirmatorId)
      .then((data) => {
        setConfirmatorName(data.data.name);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  return (
    <>
      <Header 
      endpoints={[
        { text: "Users", path: "../superadmin/"+path.users },
        { text: "Avaliable Managers", path: path.avaliable },
        { text: "Groups", path: "../superadmin/"+path.groups },
        { text: "Courses", path: "../superadmin/"+path.courses },
        { text: "Search by CRM", path: "../superadmin/"+path.crm },
        { text: "Current Meetings", path: path.currentManagers },
        
      ]}
       />

      <BgWrapper top={-200} title="Avaliable managers" />
      <AvaliableDatePicker />
      <section className={styles.tableSection}>
        <h2 className={styles.title}>Avaliable managers</h2>
        {appointments.length === 0 ? (
          <h2 className={styles.errorTitle}>Nothing to confirm yet</h2>
        ) : (
          <div className={styles.table__wrapper}>
            <Avaliable />

           
          </div>
        )}
      </section>
    </>
  );
};

export default AvaliablePage;
