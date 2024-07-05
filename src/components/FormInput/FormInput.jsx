import styles from "./FormInput.module.scss";
import React from "react";

import classnames from "classnames";

const FormInput = ({
  classname,
  title,
  type,
  name,
  isRequired,
  placeholder,
  value,
  handler,
  pattern,
  min,
  width,
  max,
}) => {
  const handleBlur = (e) => {
    let inputValue = e.currentTarget.value;
    if (inputValue.endsWith("/")) {
      inputValue = inputValue.slice(0, -1);
      handler(inputValue);
    }
  };

  return (
    <label className={styles.input__label} style={{ width: width }}>
      <p className={classnames(styles.input__title, styles[`${classname}`])}>
        {title}
      </p>
      <input
        className={classnames(styles.input, styles[`${classname}`])}
        type={type}
        {...(type === "number" && { min: 0 })}
        name={name}
        required={isRequired}
        value={value}
        pattern={pattern}
        minLength={min}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => handler(e.currentTarget.value)}
        onBlur={handleBlur}
      />
    </label>
  );
};

export default FormInput;
