import axios from "../axios-config";

const getManagers = () => {
  return axios
    .get("/managers")
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getManagerById = (managerId) => {
  return axios
    .get(`/manager/${managerId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getManagerByName = (name) => {
  return axios
    .get(`/manager/${name}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getAvailableManagers = (weekId, dayId, hour) => {
  return axios
    .get(`/avaliable_managers/${weekId}/${dayId}/${hour}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getCurrentMeetings = (date) => {
  return axios
    .get(
      `/get-current-meetings`,
      {
        date: date,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res)
    .catch((error) => {
      throw error;
    });
};

const getCurrentAppointments = (date) => {
  return axios
    .get(`/get-current-appointments/${date}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getWeekId = (day, month, year) => {
  return axios
    .get(`/get_week_id/${day}.${month}.${year}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const postManager = (credentials) => {
  return axios
    .post("/register_user", credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const putManager = (credentials, managerId) => {
  return axios
    .put(`/update_manager/${managerId}`, credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const deleteManager = (managerId) => {
  return axios
    .delete(`/remove_manager/${managerId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getManagersByCourse = (courseId, date, hour) =>{
  return axios
    .get(`/managers_by_course/${courseId}/${date}/${hour}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getDateByWeekId = (weekId, day) =>{
  return axios
    .get(`/get-date/${weekId}/${day}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export {
  getManagers,
  getManagerByName,
  postManager,
  putManager,
  getAvailableManagers,
  deleteManager,
  getManagerById,
  getCurrentMeetings,
  getWeekId,
  getCurrentAppointments,
  getManagersByCourse,
  getDateByWeekId,
};
