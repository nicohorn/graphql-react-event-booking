import React from 'react';
import BookingsItem from './bookingsItem/bookingsItem'

const bookingsList = (props) => {
    console.log(props.bookings)
    const bookings = props.bookings.map(booking => {
        return (
          <BookingsItem 
          eventTitle = {booking.event.title}
          speakerName = {booking.user.profile.name}
          speakerLastName = {booking.user.profile.lastname}
          createdAt = {new Date(booking.createdAt).toLocaleDateString()}
          cancelBooking = {props.cancelBooking}
          bookingId = {booking._id}
          />
        );
});
    return(<ul className='grid grid-cols-3 gap-10'>{bookings}</ul>)
}

export default bookingsList;