import styles from "./NewUser.module.scss";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import Select from "../../Select/Select";
import React, { useState } from "react";
import { postManager } from "../../../helpers/manager/manager";
import { getRoles, postUser } from "../../../helpers/user/user";
import Form from "../../Form/Form";

const NewUser = ({ isOpen, handleClose, isAdmin }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(2);
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{ type: role === 2 ? "post" : "user" }}
            requests={{ post: postUser, user:  postManager }}
            name={name}
            role={role}
            onSubmit={() => {
              handleClose();
              setRole(2);
              setRating("");
              setPassword("");
              setLogin("");
              setName("");
            }}
            rating={rating}
            login={login}
            password={password}
            role_id={role}
            status={{
              successMessage: "Successfully created user",
              failMessage: "Failed to create user",
            }}
            title="New user"
          >
            <FormInput
              title="Name:"
              type="text"
              name="name"
              max={50}
              value={name}
              placeholder="Name"
              isRequired={true}
              handler={setName}
            />
            <FormInput
              title="Rating:"
              type="text"
              name="rating"
              max={50}
              value={rating}
              placeholder="Rating"
              isRequired={true}
              handler={setRating}
            />

            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Login:"
                type="text"
                name="login"
                max={50}
                value={login}
                placeholder="Login"
                isRequired={true}
                handler={setLogin}
              />
              <FormInput
                classname="input__bottom"
                title="Password:"
                type="password"
                name="password"
                max={50}
                value={password}
                placeholder="Password"
                isRequired={true}
                handler={setPassword}
              />
            </div>
            <Select
              title="Role:"
              request={getRoles}
              setValue={setRole}
              value={role}
              manager={true}
              administrator={isAdmin}
              defaultValue="manager/caller/confirmator"
            ></Select>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewUser;
