import styles from "./Login.module.scss";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import React, { useState } from "react";
import Form from "../../Form/Form";
import { loginUser } from "../../../helpers/manager/manager";
import { useDispatch } from "react-redux";
import { success, error, defaults } from "@pnotify/core";

const Login = ({ isOpen, handleClose }) => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData();
      data.append('login', login);
      data.append('password', password);
      const res = await loginUser(data);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res,
        },
      });
      handleClose();
      setLogin("");
      setPassword("");
    } catch (err) {
      error(err.response.data.message);
    }
  }


  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <h3 className={styles.title}>Log In</h3>
          <form
            // onSubmit={() => {
            //   handleClose();
            //   // setRemember("");
            //   setLogin("");
            //   setPassword("");
            // }}
            // type={{ type: "login", button: "login" }}
            // text={
            //   <>
            //     {/* <p className={styles.exit}>
            //       Don’t have an account?{" "}
            //       <span
            //         onClick={() => {
            //           handleClose();
            //         }}
            //       >
            //         Sign Up
            //       </span>
            //     </p>
            //     <p className={styles.exit}>
            //       Forgot your password?{" "}
            //       <span
            //         onClick={() => {
            //           handleClose();
            //         }}
            //       >
            //         Click here
            //       </span>
            //     </p> */}
            //   </>
            // }
            // requests={{ login: loginUser }}
            // // remember={remember}
            // login={login}
            // password={password}
          >
            
            <FormInput
                classname={styles.title}
                title="Login:"
                type="text"
                name="login"
                value={login}
                placeholder="Login"
                isRequired={true}
                handler={setLogin}
              />

            <FormInput
              title="Password:"
              type="password"
              name="password"
              value={password}
              min={5}
              placeholder="Password"
              isRequired={true}
              handler={setPassword}
            />
            {/* <label className={styles.input__label}>
              <div className={styles.checkbox__wrapper}>
                <input
                  className={styles.input}
                  type="checkbox"
                  name="remember"
                  required
                  value={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />

                <p className={styles.input__title}>Remember me</p>
              </div>
            </label> */}
            <button
              type="button"
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={styles.login}
            >
              Log in
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Login;
