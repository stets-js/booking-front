import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import styles from "./ConfirmatorPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Confirmator from "../../components/Confirmation/Confirmation";
import ConfirmationButtons from "../../components/ConfirmationButtons/ConfirmationButtons";
import Header from "../../components/Header/Header";
import { useParams } from "react-router-dom";
import { getCurrentConfirmator } from "../../redux/confirmator/confirmator-operations";
import ConfirmatorComments from "../../components/ConfirmatorComments/ConfirmatorComments";
import ConfirmatorDatePicker from "../../components/ConfirmatorDatePicker/ConfirmatorDatePicker";
import { getUserById } from "../../helpers/user/user";
import { getConfirmatorLoadings } from "../../redux/confirmator/confirmator-selectors";
import CrmLinks from "../../components/CrmLinks/CrmLinks";
import path from "../../helpers/routerPath";



const ConfirmatorPage = () => {
  const [value, setValue] = useState("");
  const { confirmatorId } = useParams();
  const [confirmatorName, setConfirmatorName] = useState("");
  
  const loading = useSelector(getConfirmatorLoadings);

  const dispatch = useDispatch();

  useEffect(() => dispatch(getCurrentConfirmator()), [])

  useEffect(() => {
    
    getUserById(+confirmatorId)
      .then((data) => {
        setConfirmatorName(data.data.name);
      })
      .catch((err) => {
        throw err;
      });
  }, [confirmatorId]);

  return (
    <>
      <Header
        endpoints={[
          { text: "Confirmator", path: "../confirmator/" + confirmatorId },
          { text: "Confirmed", path: "../confirmed/" + confirmatorId },
          {text: "Current Meetings", path: path.currentManagers},
          { text: "Search by CRM", path: path.pageCrm },
          { text: "Caller Confirmator", path: "/caller/67/" }
        ]}
        user={{ name: confirmatorName, role: "Confirmator" }}
      />

      <BgWrapper top={-200} title="Confirmator" />
      <section className={styles.tableSection}>
      {loading && <div className={styles.spinnerWrapper}><div className={styles.spinner}><TailSpin height="130px" width="130px" color="#999DFF" /></div></div>}
      <ConfirmatorDatePicker />
      
        <h2 className={styles.title}>Confirmation</h2>
        {window.innerWidth > 700 ? (
          <div className={styles.table__wrapper}>
            <Confirmator />

            <div className={styles.btn_wrapper}>
              <ConfirmationButtons value={value} setValue={setValue} />
            </div>
            <div className={styles.btn_input_wrapper}>
              <ConfirmatorComments value={value} dispatch={dispatch}/>
            </div>
          </div>
          ):(
            <div>This table only for PC</div>
          )
        }
        
      </section>
    </>
  );
};

export default ConfirmatorPage;
