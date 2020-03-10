import React from "react";
import "./button.css";
const Button = ({ text, onClick, type, className, disabled }) => (
  <button
    type={type}
    onClick={onClick}
    className={className}
    disabled={disabled}
  >
    {text}
  </button>
);
export default Button;
