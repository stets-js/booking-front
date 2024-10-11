import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { getManagerById } from "../../helpers/manager/manager";

export default function ManagerPage() {
  const { managerId } = useParams();
  const [managerName, setManagerName] = useState("");
  useEffect(() => {
    getManagerById(+managerId).then((data) => {
      setManagerName(data.name);
    });
  }, [managerId]);
  return (
    <>
      <Header
        endpoints={[
          { text: "Consultations", path: path.consultations },
          { text: "Planning", path: path.planning },
          { text: "CRM", path: path.crm },
          { text: "Analytics", path: path.analytics },
          { text: "Working slots", path: path.workingSlots },
          { text: "Study booking", path: "https://study-booking.netlify.app/MIC" },
          { text: "Automatizers", path: path.automatizers },
        ]}
        user={{ name: managerName, role: "Manager" }}
      />
      <Outlet urlManager_Id={managerId} />
    </>
  );
}
