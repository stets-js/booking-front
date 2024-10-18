import React from "react";
import styles from "./SuperAdminPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { Outlet } from "react-router-dom";

const SuperAdministrator = () => {
  return (
    <>
      <Header
        endpoints={[
          { text: "Users", path: path.users },
          { text: "Avaliable Managers", path: path.avaliable },
          { text: "Groups", path: path.groups },
          { text: "Courses", path: path.courses },
          { text: "Search by CRM", path: path.crm },
          { text: "Current Meetings", path: path.currentManagers },
          { text: "History", path: path.history },
          { text: "Team calendar", path: path.teamCalendar },
          { text: "Automatizers", path: path.automatizers },
            
        ]}
      />
      <section className={styles.main_wrapper}>
        <BgWrapper title="Super administrator" />
        <Outlet />
      </section>
    </>
  );
};

export default SuperAdministrator;
