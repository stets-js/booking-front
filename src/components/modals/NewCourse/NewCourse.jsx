import Modal from "../../Modal/Modal";
import React, { useState } from "react";
import { postCourse } from "../../../helpers/course/course";
import { postGroup } from "../../../helpers/group/group";
import FormInput from "../../FormInput/FormInput";
import Form from "../../Form/Form";

const NewCourse = ({ isOpen, handleClose }) => {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");


  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            onSubmit={() => {
              handleClose();
              setName("");
              setGroup("");
            }}
            isDescription={true}
            type={{ type: "post" }}
            requests={{
              post: postCourse,
            }}
            status={{
              successMessage: "Successfully created course",
              failMessage: "Failed to create course",
            }}
            name={name}
            group={group}
            title="New course"
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
              title="Group:"
              type="text"
              name="group"
              max={80}
              value={group}
              placeholder="Group"
              isRequired={true}
              handler={setGroup}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewCourse;
