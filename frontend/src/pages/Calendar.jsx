import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import AuthContext from '../context/auth-context'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today


function createEventId() {
    return String(eventGuid++)
}


export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    transformedAppointments: [
      {
        id: "aa",
        title: "All-day event",
        start: new Date().toISOString().replace(/T.*$/, ""),
      },
      {
        id: "asd",
        title: "Timed event",
        start:
          new Date().toISOString().replace(/T.*$/, "") +
          new Date().toLocaleString().slice(10, 19),
      },
    ],
    appointments: [],
  };

  static contextType = AuthContext;
  appointmentsTransformed;

  componentDidMount() {
    this.fetchAppointments();
  }

  render() {
    return (
      <div className="demo-app container m-auto max-h-20">
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            initialEvents={this.state.appointments} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          />
        </div>
      </div>
    );
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  handleEventClick = (clickInfo) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: this.state.appointments,
    });
  };

  fetchAppointments() {
    const requestBody = {
      query: `
      query{
        appointments{
          _id
          professional{
            name
            lastname
          }
          startDate
        }
      }
          `,
    };
    const token = this.context.token;
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const appointments = resData.data.appointments;
        //this.setState({ appointments: appointments });

        const formattedAppointments = appointments.map((appointment) => {
          return {
            id: `${appointment._id}`,
            title: `Turno con ${appointment.professional.name}`,
            start:
              new Date(appointment.startDate)
                .toISOString()
                .replace(/T.*$/, "") +
              new Date().toLocaleString().slice(10, 19),
          };
        });
        this.setState({ appointments: formattedAppointments });

        console.log("APPOINTMENTS TRANSFORMED");
        console.log(this.state.appointments);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}


