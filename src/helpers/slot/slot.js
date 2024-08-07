import axios from "../axios-config";

axios.create({
  withCredentials: true,
});

const updateSlotComment = (credentials) => {
  return axios
    .post("/update_slot_comment", credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getSlot = ({ id }) => {
    return axios
      .get(`/slot/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };
const freezeSlot = ( slotId ) => {
    return axios
      .put(`/freeze_slot/${slotId}`)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };
const freezeSlotStatus = ( date, time, managerId ) => {
    return axios
      .get(`/is_frozen_slot/${date}/${time}/${managerId}`)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };

  const getSlotInfo = (managerId, weekId, dayIndex, slotHour) => {
    return axios
      .get(`/get_slot_info/${managerId}/${weekId}/${dayIndex}/${slotHour}`)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };

  export {
    getSlot,
    updateSlotComment,
    freezeSlot,
    freezeSlotStatus,
    getSlotInfo
  };