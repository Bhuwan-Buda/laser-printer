import "./Modal.css";
import React from "react";

const Modal = ({ children, showModal, setShowModal, header }) => {
  const modalClass = showModal ? "modal display-block" : "modal display-none";

  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <div
      className={modalClass}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div className={`modal-dialog modal-dialog-centered modal-md`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="myExtraLargeModalLabel">
              {header}
            </h5>

            <button
              onClick={handleClose}
              type="button"
              className="btn btn-sm btn-close btn-secondary bg-white text-secondary"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
