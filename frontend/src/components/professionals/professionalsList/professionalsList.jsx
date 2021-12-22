import React from 'react';
import ProfessionalItem from './professionalsItem/professionalsItem'

const professionalList = (props) => {
    const professionals = props.professionals.map(professional => {
        return (

            <ProfessionalItem
              key={professional._id}
              professionalId={professional._id}
              name={professional.name}
              lastname={professional.lastname} 
              price={professional.price}
              image={professional.image}
              userId={props.authUserId}
              onDetail={props.onViewDetail}
              bookAppointment={props.bookAppointment}

            />

        );
});
    return(<ul className='grid grid-cols-3 gap-10'>{professionals}</ul>)
}

export default professionalList;
