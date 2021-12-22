import React from 'react'


const bookingsItem = props =>{
    return (
      <div
        key={props.bookingId}
        className="card shadow-2xl lg:card-side bg-primary text-primary-content"
      >
        <div className="card-body">
          <li>
            <span className='font-extrabold'>{props.eventTitle}</span> 
            <br></br>
            <p>Speaker: {props.speakerName} {props.speakerLastName}</p>
            <br></br>
            {props.createdAt}
          </li>
          <div className="justify-end card-actions">
            <button
              className="btn btn-primary"
              onClick={props.cancelBooking.bind(this, props.bookingId)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
}

export default bookingsItem