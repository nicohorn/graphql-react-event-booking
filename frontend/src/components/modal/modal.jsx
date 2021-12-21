import React from 'react';



const modal = props => {
  const divStyle = {
    visibility: "visible",
    opacity: "100%",
  };
  return (
    <div id="my-modal" className="modal" style={divStyle}>
      <div className="modal-box">
        {props.children}
        <div class="modal-action">
          {props.canCancel && (
            <button className="btn" onClick={props.onCancel}>
              Cancel
            </button>
          )}
          {props.canConfirm && (
            <button className="btn btn-primary" onClick={props.onConfirm}>
              {props.confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default modal;