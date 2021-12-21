import React from 'react';

const professionalItem = (props) => (
  <div className="card shadow-2xl lg:card-side bg-white text-primary-content">
    <li key={props.professionalId} className="w-full">
      <figure>
        <img
          alt="Profile"
          src={props.image}
        ></img>
      </figure>
      <div className="card-body">
        <h1 className="font-bold card-title">
          {props.name} {props.lastname}
        </h1>
        <div className="card-body">
          <h2>${props.price}</h2>
          <h2>{props.professionalId}</h2>
        </div>

        <div className="justify-end card-actions">
          <button
            className="btn btn-primary"
            onClick={props.onDetail.bind(this, props.professionalId)}
          >
            View details
          </button>
          <button
            className="btn"
            onClick={props.bookAppointment.bind(this, props.professionalId)}
          >
            Book appointment
          </button>
        </div>
      </div>
    </li>
  </div>
);

export default professionalItem;
