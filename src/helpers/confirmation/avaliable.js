import axios from "../axios-config";
import {jwtDecode} from "jwt-decode";
import { alert, notice, info, success, error } from "@pnotify/core";

const getCurrentConfirmatorData = () => {
  return axios
    .get(`/get_current_avaliable_manager`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getConfirmatorWeekData = (weekId, dayId, halfId) => {
  return (
    axios
      .get(`/get_avaliable_manager/${weekId}/${dayId}/${halfId}`)
      // .get(`/get_confirmation_manager/${weekId}/${dayId}/${halfId}`)
      // .get(`/avaliable_managers_list/${weekId}/${dayId}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      })
  );
};

const setConfirmation = (slot_id, status, message) => {
  return axios
    .post(
      message
        ? `/set_confirmation/${slot_id}/${status}/${message}`
        : `/set_confirmation/${slot_id}/${status}`
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setCancelConfirmation = (slot_id, status, message) => {
  return axios
    .post(
      message
        ? `/set_cancel_confirmation/${slot_id}/${status}/${message}`
        : `/set_cancel_confirmation/${slot_id}/${status}`
    )
    .then((res) => res.data)
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

const removeSlot = (slot_id, reason, removeMessage) => {
  const authToken = localStorage.getItem("booking");
  const { id, zoho_id } = jwtDecode(authToken);

  const data = {
    slot_id,
    reason,
    confirmatorId: id,
  };

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

  return axios.delete(`remove_slot`, {
      data,  // Use data instead of URL params
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json' // Make sure to set Content-Type header
      },
    })
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "removed",
        canceled_message: removeMessage,
        zoho_id: zoho_id,
      };
      info("Data sending to ZOHO...");
      sendToZoho(responseData);
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
  removeSlot,
};
