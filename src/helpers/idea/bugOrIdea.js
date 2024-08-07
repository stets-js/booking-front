import axios from '../axios-config';

const createBugOrIdea = data => {
  return axios
    .post(`/bug-or-idea`, data)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {createBugOrIdea};
