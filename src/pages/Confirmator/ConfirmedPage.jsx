import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import styles from "./ConfirmatorPage.module.scss"; 
import BgWrapper from "../../components/BgWrapper/BgWrapper"; 
import Confirmator from "../../components/Confirmation/Confirmed";  
import ConfirmationButtons from "../../components/ConfirmationButtons/ConfirmedButtons"; 
import Header from "../../components/Header/Header";  
import { useParams } from "react-router-dom";
import { getCurrentConfirmed } from "../../redux/confirmator/confirmed-operations"; 
import ConfirmatorComments from "../../components/ConfirmatorComments/ConfirmatorComments";  
import ConfirmedDatePicker from "../../components/ConfirmatorDatePicker/ConfirmedDatePicker"; 
import { getUserById } from "../../helpers/user/user"; 
import { getConfirmatorLoadings } from "../../redux/confirmator/confirmed-selectors"; 

const ConfirmedPage = () => {
  const [value, setValue] = useState("");
  const { confirmatorId } = useParams();
  const [confirmatorName, setConfirmatorName] = useState("");
  
  const loading = useSelector(getConfirmatorLoadings);

  const dispatch = useDispatch();

  useEffect(() => dispatch(getCurrentConfirmed()), [])

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
        { text: "Confirmator", path: '../confirmator/'+confirmatorId },
        { text: "Confirmed", path: '../confirmed/'+confirmatorId },
       
      ]}
      user={{ name: confirmatorName, role: "Confirmator" }} />

      <BgWrapper top={-200} title="Confirmed" />
      <section className={styles.tableSection}>
      {loading && <div className={styles.spinnerWrapper}><div className={styles.spinner}><TailSpin height="130px" width="130px" color="#999DFF" /></div></div>}
      <ConfirmedDatePicker />
      
        <h2 className={styles.title}>Confirmation</h2>
       
          <div className={styles.table__wrapper}>
            <Confirmator />

            <div className={styles.btn_wrapper}>
              <ConfirmationButtons value={value} setValue={setValue} />
            </div>
            <div className={styles.btn_input_wrapper}>
              <ConfirmatorComments value={value} />
            </div>
          </div>
        
      
      </section>
    </>
  );
};

export default ConfirmedPage;
