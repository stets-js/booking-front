import {jwtDecode} from "jwt-decode";

export const SET_SURVEY_COMPLETED = 'SET_SURVEY_COMPLETED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';


const initialState = {
  isAuthenticated: false,
  user: {
    name: '',
    role: 0,
    id: null,
    surveyCompleted: false,
  },
  token: null,
};


const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const decodedToken = jwtDecode(action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: {
          name: decodedToken.user_name,
          role: decodedToken.role,
          id: decodedToken.id,
          surveyCompleted: decodedToken.survey_completed,
        },
        token: action.payload.token,
      };
    case SET_SURVEY_COMPLETED:
      return {
        ...state,
        user: {
          ...state.user,
          surveyCompleted: action.payload,
        },
      };
    case LOGOUT:
      localStorage.removeItem('booking');
      return initialState;
    default:
      return state;
  }
};


export const setSurveyCompleted = (completed) => ({
  type: SET_SURVEY_COMPLETED,
  payload: completed,
});

export default authReducer;
