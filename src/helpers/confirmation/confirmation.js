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
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  
  const { id, zoho_id } = jwtDecode(authToken);
  const url = message
  ? `/set_confirmation/${slot_id}/${status}/${message}/${id}/`
        : `/set_confirmation/${slot_id}/${status}/${id}/`;
  return axios
    .post(url, null, { headers })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "confirmed",
        zoho_id:zoho_id,
      };
      info("Data sending to ZOHO...");
      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      ).then((res) => {
        success("Successfully sended to ZOHO!")
        return res.data;
      }).catch((err) => {
        error("Data not sended to ZOHO!")
      });
    })
    .catch((error) => {
      throw error;
    });
};


const setCancelConfirmation = (slot_id, status, message, appointment_id) => {
  const authToken = localStorage.getItem("booking");
  const { id,zoho_id } = jwtDecode(authToken);
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  
  const data = { slot_id, cancel_type: status, message, confirmatorId: id, appointment_id };

  return axios
    .post(`/set_cancel_confirmation/`, data, { headers })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "canceled",
        zoho_id:zoho_id,
      };
      info("Data sending to ZOHO...");
      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      ).then((res) => {
        success("Successfully sended to ZOHO!")
        return res.data;
      }).catch((err) => {
        error("Data not sended to ZOHO!")
      });
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
  return axios
    .post(`/update_slot/${managerId}/${weekId}/${weekDay}/${hour}/${newStatus}`, {req_url},
     {
      // Set the Authorization header with the retrieved token
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      const {user_name, role, id, zoho_id } = jwtDecode(authToken);
      if(res.data.message === "Appointment successfully removed"){
      const responseData = {
        ...res.data,
        action: "deleted",
        canceled_by: user_name,
        canceled_message: message,
        zoho_id:zoho_id,
      };
      info("Data sending to ZOHO...");
      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      ).then((res) => {
        success("Successfully sended to ZOHO!")
        return res.data;
      }).catch((err) => {
        error("Data not sended to ZOHO!")
      });
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
