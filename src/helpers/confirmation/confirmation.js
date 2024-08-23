import axios from "../axios-config";
import {jwtDecode} from "jwt-decode";
import { alert, notice, info, success, error } from "@pnotify/core";

const getCurrentConfirmatorData = () => {
  return axios
    .get(`/current_confirmation`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getConfirmatorWeekData = (weekId, dayId, halfId) => {
  return axios
    .get(`/get_confirmation/${weekId}/${dayId}/${halfId}/`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setConfirmation = (slot_id, status, message) => {
  const authToken = localStorage.getItem("booking");
  const headers = { Authorization: `Bearer ${authToken}` };
  const { id, zoho_id } = jwtDecode(authToken);

  const url = message
    ? `/set_confirmation/${slot_id}/${status}/${message}/${id}/`
    : `/set_confirmation/${slot_id}/${status}/${id}/`;

  const sendToZoho = (responseData, retries = 1) => {
    axios.post(
      "https://zohointegration.goit.global/GoITeens/booking/index.php",
      JSON.stringify(responseData),
      { headers: { "Content-Type": "application/json" }}
    ).then((res) => {
      success("Successfully sent to ZOHO!");
      return res.data;
    }).catch((err) => {
      if (retries > 0) {
        info("Data resending to ZOHO...");
        sendToZoho(responseData, retries - 1);
      } else {
        error("Data not sent to ZOHO after retries!");
      }
    });
  };

  return axios.post(url, null, { headers })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "confirmed",
        zoho_id: zoho_id,
      };
      info("Data sending to ZOHO...");
      sendToZoho(responseData);
    })
    .catch((error) => {
      throw error;
    });
};



const setCancelConfirmation = (slot_id, status, message, appointment_id) => {
  const authToken = localStorage.getItem("booking");
  const { id, zoho_id } = jwtDecode(authToken);
  const headers = { Authorization: `Bearer ${authToken}` };

  const data = { slot_id, cancel_type: status, message, confirmatorId: id, appointment_id };

  const sendToZoho = (responseData, retries = 1) => {
    axios.post(
      "https://zohointegration.goit.global/GoITeens/booking/index.php",
      JSON.stringify(responseData),
      { headers: { "Content-Type": "application/json" }}
    ).then((res) => {
      success("Successfully sent to ZOHO!");
      return res.data;
    }).catch((err) => {
      if (retries > 0) {
        info("Data resending to ZOHO...");
        sendToZoho(responseData, retries - 1);
      } else {
        error("Data not sent to ZOHO after retries!");
      }
    });
  };

  return axios.post(`/set_cancel_confirmation/`, data, { headers })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "canceled",
        zoho_id: zoho_id,
      };
      info("Data sending to ZOHO...");
      sendToZoho(responseData);
    })
    .catch((error) => {
      throw error;
    });
};


const setPostponedConfirmation = (slot_id, appointment_id) => {
  return axios
    .post(`/set_postpone_confirmation/${slot_id}/${appointment_id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const delteConfirmation = (managerId, weekId, weekDay, hour, newStatus, message) => {
  const req_url = encodeURIComponent(window.location.href);
  const authToken = localStorage.getItem("booking");
  const headers = { Authorization: `Bearer ${authToken}` };

  const sendToZoho = (responseData, retries = 1) => {
    axios.post(
      "https://zohointegration.goit.global/GoITeens/booking/index.php",
      JSON.stringify(responseData),
      { headers: { "Content-Type": "application/json" }}
    ).then((res) => {
      success("Successfully sent to ZOHO!");
      return res.data;
    }).catch((err) => {
      if (retries > 0) {
        info("Data resending to ZOHO...");
        sendToZoho(responseData, retries - 1);
      } else {
        error("Data not sent to ZOHO after retries!");
      }
    });
  };

  return axios.post(
      `/update_slot/${managerId}/${weekId}/${weekDay}/${hour}/${newStatus}`, 
      { req_url }, 
      { headers }
    )
    .then((res) => {
      const { user_name, zoho_id } = jwtDecode(authToken);
      if (res.data.message === "Appointment successfully removed") {
        const responseData = {
          ...res.data,
          action: "deleted",
          canceled_by: user_name,
          canceled_message: message,
          zoho_id: zoho_id,
        };
        info("Data sending to ZOHO...");
        sendToZoho(responseData);
      }
    })
    .catch((error) => {
      throw error;
    });
};


export {
  setPostponedConfirmation,
  getCurrentConfirmatorData,
  getConfirmatorWeekData,
  setConfirmation,
  setCancelConfirmation,
  delteConfirmation,
};
