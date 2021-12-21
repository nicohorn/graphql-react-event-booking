import React from 'react'

const appointmentItem = (props) =>{
    return (
        <div
          key={props.appointmentId}
          className="card shadow-2xl lg:card-side bg-primary text-primary-content mt-3"
        >
          <div className="card-body">
            <li>
              Appointment with <span className='font-bold'>{props.professionalName} {props.professionalLastName}</span> 
            </li>
                <p><span className='font-bold'>Date: </span>{props.date} at {props.time}</p>
            <div className="justify-end card-actions">
              <button
                className="btn btn-primary"
              >
                Cancel appointment
              </button>
            </div>
          </div>
        </div>
      );
}

export default appointmentItem;