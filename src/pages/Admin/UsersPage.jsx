import React, { useState, useEffect } from "react";
import styles from "./AdminPage.module.scss";
import Managers from "../../components/Managers/Managers";
import NewUser from "../../components/modals/NewUser/NewUser";
import { getUsers } from "../../helpers/user/user";
import { getManagers } from "../../helpers/manager/manager";
import MobileManagers from "../../components/MobileManagers/MobileManagers";
import { v4 as uuidv4 } from "uuid";

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  const usersArray = [
    { text: "Managers", role: "Manager", isAdmin: false, isManager: true },
  ];



  useEffect(() => {
    const fetchData = async () => {
      const res = await getUsers();
      const users = res.users.filter((item) => item.role_id > 2);
      const managers = res.users.filter((item) => item.role_id === 2);
      setData([...users, ...managers]);
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const screenWidth = window.innerWidth;

  return (
    <>
      <h3 className={styles.main_title}>Manage users</h3>
      <div className={styles.btn_wrapper}>
        <button
          className={styles.add_btn}
          data-modal="new-user"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Add new user +
        </button>
        <NewUser
          isOpen={isOpen}
          handleClose={() => handleClose()}
          isAdmin={false}
        />
      </div>
      <div className={styles.main_wrapper2}>
        {usersArray.map((item, index) => {
          const key = uuidv4();
          return (
            <React.Fragment key={key}>
              {screenWidth > 600 ? (
                <Managers
                  key={key}
                  isOpenModal={isOpen}
                  isAdmin={item.isAdmin}
                  data={data}
                />
              ) : (
                <MobileManagers
                  key={key}
                  isOpenModal={isOpen}
                  isAdmin={item.isAdmin}
                  data={data}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
    </>
  );
}
