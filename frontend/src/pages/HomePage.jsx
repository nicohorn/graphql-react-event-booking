import React, { Component } from 'react';
import AuthContext from '../context/auth-context'
import Modal from '../components/modal/modal'
import AppointmentList from '../components/appointments/appointmentList/appointmentList'


class BookingsPage extends Component {
  state = {
    viewing: false,
    appointments: []
  };
  static contextType = AuthContext;

  modalCancelHandler = () => {
    this.setState({ viewing: false });
  };
  appointmentsHandler = () => {
    this.setState({ viewing: true });
    this.fetchAppointments()
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
        'Authorization': 'Bearer ' + token
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
        this.setState({ appointments: appointments });
        console.log(this.state.appointments)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.viewing && (
          <Modal
            title="Turno"
            canCancel
            cancelText = "Return"
            onCancel={this.modalCancelHandler}
          >
            <AppointmentList appointments={this.state.appointments}/>
          </Modal>
        )}
        <div class="container mx-auto mt-20 card lg:card-side border-2 border-white">
          <figure>
            <img
              alt="profile"
              src={this.context.imageUrl}
            ></img>
          </figure>
          <div class="card-body">
            <h2 class="card-title">
              <span className="font-semibold">Bienvenido</span>{" "}
              {this.context.profileName}
            </h2>
            <p>
              Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.
              Sit sit necessitatibus veritatis sed molestiae voluptates incidunt
              iure sapiente.
            </p>
            <div class="card-actions">
              <button onClick={this.appointmentsHandler} class="btn btn-primary">My Appointments</button>
              <button  class="btn btn-ghost">
                Go to your profile
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BookingsPage;