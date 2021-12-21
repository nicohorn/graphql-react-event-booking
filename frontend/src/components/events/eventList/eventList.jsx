import React from 'react';
import EventItem from './eventItem/eventItem'

const eventList = (props) => {
    const events = props.events.map(event => {
        return (
          <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price}
            date={event.date}
            userId={props.authUserId}
            creatorId={event.creator._id}
            onDetail={props.onViewDetail}
          />
        );
});
    return(<ul className='grid grid-cols-2 gap-10'>{events}</ul>)
}

export default eventList;


