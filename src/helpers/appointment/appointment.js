import axios from "../axios-config";
import {jwtDecode} from "jwt-decode";
import { alert, notice, info, success, error } from "@pnotify/core";

axios.create({
  withCredentials: true,
});

const postAppointment = (credentials) => {
  return axios
    .post("/register_appointment", credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointment = ({ id }) => {
  return axios
    .get(`/appointment/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};
const getOverbookedAppointments = ( slotId) => {
  console.log("slotId in fn", slotId)
  return axios
    .get(`overbooked_consultations/${slotId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getAppointmentByCrm = (credentials) => {
  return axios
    .post(`/search`, credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const putAppointment = (credentials) => {
  const token = localStorage.getItem("booking");
  return axios
    .post(`/update_superad_appointment`, credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const { zoho_id } = jwtDecode(token);
      const responseData = {
        ...res.data,
        action: "rescheduled",
        zoho_id: zoho_id,
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

const createAppointment = (
  link,
  managerId,
  weekId,
  dayIndex,
  time,
  courseId,
  phone,
  age,
  message,
  callerName,
  appointmentType
) => {
  const authToken = localStorage.getItem("booking");
  const encodedMessage = encodeURIComponent(encodeURIComponent(message));  // Подвійне кодування

  return axios
    .post(
      `/create_appointment/${weekId}/${dayIndex}/${time}/${courseId}/${phone ? phone : "0"}/${age}/${managerId}/${encodedMessage ? encodedMessage : "0"}/${callerName}/${appointmentType}`,
      link, 
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
    .then((res) => {
      const { zoho_id } = jwtDecode(authToken);
      const responseData = {
        ...res.data,
        action: "created",
        zoho_id: zoho_id,
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

const swapAppointmentManagers = (credentials) => {
  const token = localStorage.getItem("booking");
  return axios
    .post(`/swap_appointments`, credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const { zoho_id } = jwtDecode(token);
      const responseData = {
        ...res.data,
        action: "swapped",
        zoho_id: zoho_id,
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

export {
  getAppointment,
  postAppointment,
  createAppointment,
  putAppointment,
  getAppointmentByCrm,
  swapAppointmentManagers,
  getOverbookedAppointments,
};
