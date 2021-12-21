import React from 'react'
import AppointmentItem from './appointmentItem/appointmentItem'

const appointmentList = (props) => {
    const appointments = props.appointments.map(appointment => {
        return (
          <AppointmentItem 
          professionalName = {appointment.professional.name}
          professionalLastName = {appointment.professional.lastname}
          date =  {new Date(appointment.startDate).toLocaleDateString()}
          time = {new Date(appointment.startDate).toTimeString().slice(0,5)}
          appointmentId = {appointment._id}
          />
        );
});
    return(<ul className='p-4'>{appointments}</ul>)
}

export default appointmentList;