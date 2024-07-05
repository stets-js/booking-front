import axios from "../axios-config";
import { error } from "@pnotify/core";
import { defaults } from "@pnotify/core";
defaults.delay = 1000;

const getCurrentWeek = (managerId) => {
  return axios
    .get(`/current_week/${managerId}`)
    .then((res) => res.data)
    .catch((err) => {
      error(
        `${err.response.data.message ? err.response.data.message : err.message}`
      );
      throw err;
    });
};
const getCallerCurrentWeek2 = () => {
  return axios
    .get(`/caller_current_week`)
    .then((res) => res.data)
    .catch((err) => {
      error(
        `${err.response.data.message ? err.response.data.message : err.message}`
      );
      throw err;
    });
};
/////////
const getCallerCurrentWeek3 = (courseId) => {
  return axios
    .get(`/caller_current_week/${courseId}`)
    .then((res) => res.data)
    .catch((err) => {
      error(
        `${err.response.data.message ? err.response.data.message : err.message}`
      );
      throw err;
    });
};
/////////
const getCallerWorkWeek = (weekId) => {
  return axios
    .get(`/get_caller_week/${weekId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

///////////////////////
const getCallerWorkWeekByCourse = (weekId, courseId, manager = null) => {
  let url = `/get_caller_week/${weekId}/${courseId}`;
  if (manager !== null) {
    url += `?manager=${manager}`;
  }

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};
//////////////////////

const getWeek = (managerId, weekId) => {
  return axios
    .get(`/get_week/${managerId}/${weekId}`)
    .then((res) => res.data)
    .catch((err) => {
      error(
        `${err.response.data.message ? err.response.data.message : err.message}`
      );
      throw err;
    });
};

const updateSlot = (managerId, weekId, dayIndex, slotHour, colorId) => {
  const req_url = encodeURIComponent(window.location.href);
  const token = localStorage.getItem("booking");
  return axios
    .post(
      `/update_slot/${managerId}/${weekId}/${dayIndex}/${slotHour}/${colorId}`,  {req_url}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      error(
        `${err.response.data.message ? err.response.data.message : err.message}`
      );
      throw err;
    });
};
const updateSlotFollowUp = (managerId, weekId, dayIndex, slotHour, colorId, followUp) => {
  return axios
    .post(
      `/update_slot_follow_up/${managerId}/${weekId}/${dayIndex}/${slotHour}/${colorId}/${followUp}`
    )
    .then((res) => res.data)
    .catch((err) => {
      error(
        `${err.response.data.message ? err.response.data.message : err.message}`
      );
      throw err;
    });
};
const updateSlotOnControl = (managerId, weekId, dayIndex, slotHour, colorId, onControl) => {
  return axios
    .post(
      `/update_slot_on_control/${managerId}/${weekId}/${dayIndex}/${slotHour}/${colorId}/${onControl}`
    )
    .then((res) => res.data)
    .catch((err) => {
      error(
        `${err.response.data.message ? err.response.data.message : err.message}`
      );
      throw err;
    });
};

const saveTable = (managerId, tableCredential) => {
  return axios
    .post(`/save_template/${managerId}`, tableCredential)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getWeekTable = (managerId) => {
  return axios
    .get(`/get_template/${managerId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getCurrentWorkWeek = (managerId) => {
  return axios
    .get(`/current_work_week/${managerId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getWorkWeek = (managerId, weekId) => {
  return axios
    .get(`/get_work_week/${managerId}/${weekId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getWeekIdByTableDate = (tableDate) => {
  return axios
    .get(`/get_week_id/${tableDate}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getTeamsWorkWeek = (weekId, team = null, manager = null) => {
  let url = `/get_week_team_calendar/${weekId}`;
  if (team !== null && manager !== null) {
    url += `?team=${team}&manager=${manager}`;
  } else if (team !== null) {
    url += `?team=${team}`;
  } else if (manager !== null) {
    url += `?manager=${manager}`;
  }

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export {
  getCurrentWeek,
  getCallerCurrentWeek2,
  getWeek,
  updateSlot,
  saveTable,
  getWeekTable,
  getCurrentWorkWeek,
  getWorkWeek,
  getCallerWorkWeek,
  getWeekIdByTableDate,
  getCallerWorkWeekByCourse,
  getCallerCurrentWeek3,
  updateSlotFollowUp,
  updateSlotOnControl,
  getTeamsWorkWeek,
};
