import React from "react";
import "./InputField.css";
const Input = props => {
  return (
    <input
      className={props.className}
      id={props.id}
      name={props.name}
      value={props.value}
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      min={props.min}
      max={props.max}
    />
  );
};

export default Input;
