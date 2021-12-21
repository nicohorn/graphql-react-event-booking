import React from 'react';


const eventItem = (props) => (
  <li key={props.eventId}>
    <div class="card shadow-2xl lg:card-side bg-primary text-primary-content">
      <div class="card-body">
        <h1 className="font-bold">{props.title}</h1>
        <h2>
          ${props.price} - {new Date(props.date).toLocaleDateString()}
        </h2>
        <div class="justify-end card-actions">
          {props.userId === props.creatorId ? (
            <p>You're the owner of this event</p>
          ) : (
            <button
              className="btn btn-primary"
              onClick={props.onDetail.bind(this, props.eventId)}
            >
              View details
            </button>
          )}
        </div>
      </div>
    </div>
  </li>
);

export default eventItem;
