import React from "react";
import "./modal.css";
const Modal = props => {
  const { children, show } = props;
  return (
    show && (
      <div className="modal">
        <div className="backdrop">
          <div className="classboxprnt">
            <div className="cls-box">
              <button className="close-button" onClick={props.onClose}>
                +
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    )
  );
};
export default Modal;
