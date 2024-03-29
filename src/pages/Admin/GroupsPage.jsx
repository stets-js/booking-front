import React from "react";
import { useState } from "react";
import styles from "../SuperAdmin/SuperAdminPage.module.scss";
import Groups from "../../components/Groups/Groups";
import NewGroup from "../../components/modals/NewGroup/NewGroup";

const GroupsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles.main_wrapper}>
      <h3 className={styles.main_title}>Manage groups</h3>
      <div className={styles.btn_wrapper}>
        <button
          className={styles.add_btn}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Add new groups +
        </button>
        <NewGroup isOpen={isOpen} handleClose={() => handleClose()} />
      </div>
      <div className={styles.main_wrapper2}>
        <Groups isOpenModal={isOpen} />
      </div>
      
    </div>
  );
};

export default GroupsPage;
