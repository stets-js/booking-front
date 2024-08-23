import axios from "../axios-config";
import {jwtDecode} from "jwt-decode";
import { alert, notice, info, success, error } from "@pnotify/core";

const postConsultationResult = (slotId, result, groupId, message, unsuccessfulMessage, course, withParents) => {
  const formattedMessage = message || "";
  const formattedUnsuccessfulMessage = unsuccessfulMessage || "";

  const data = {
    slot_id: slotId,
    consultation_result: +result,
    group_id: groupId,
    message: formattedMessage,
    unsuccessful_message: formattedUnsuccessfulMessage,
    course,
    parents: withParents
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

  return axios.post("/consultation_result", data)
    .then((res) => {
      const authToken = localStorage.getItem("booking");
      const { zoho_id } = jwtDecode(authToken);
      const responseData = {
        ...res.data,
        action: "attended",
        zoho_id: zoho_id,
      };
      info("Data sending to ZOHO...");
      sendToZoho(responseData);
    })
    .catch((error) => {
      throw error;
    });
};



const postStartConsultation = (weekId, dayIndex, slotHour, managerId) => {
  return axios
    .post(`/start_consultation/${weekId}/${dayIndex}/${slotHour}/${managerId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export { postConsultationResult, postStartConsultation };
