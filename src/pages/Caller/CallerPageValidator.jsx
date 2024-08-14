import React from "react";
import { Navigate, useParams } from "react-router-dom";
import CallerPage from "./CallerPage";

const CallerPageWithValidation = (props) => {
  const { callerId } = useParams();

  if (callerId !== '67') {
    return <Navigate to="/" />;
  }

  return <CallerPage {...props} />;
};

export default CallerPageWithValidation;
