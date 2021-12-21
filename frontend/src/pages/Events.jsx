import React, { Component } from 'react';
import Modal from '../components/modal/modal'
import AuthContext from '../context/auth-context'
import EventList from '../components/events/eventList/eventList'
import Spinner from '../components/spinner/spinner'


class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event.date);

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    const token = this.context.token;

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId
            }
          })
          return {events: updatedEvents}
        })
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({isLoading: true})
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        if(this.isActive){
          this.setState({ events: events, isLoading:false });
        }   
      })
      .catch(err => {
        console.log(err);
        if(this.isActive){
          this.setState({isLoading:false})
        }
      });
  }

  showDetailHandler = eventId =>{
    this.setState(prevState =>{
      const selectedEvent = prevState.events.find(e=>e._id === eventId)
      return {selectedEvent: selectedEvent}
    })
  }

  bookEventHandler = () =>{
     if(!this.context.token){
       this.setState({selectedEvent: null})
       return;
     }

     const requestBody = {
      query: `
          mutation{
            bookEvent(eventId: "${this.state.selectedEvent._id}"){
              _id
              user{
                email
              }
              createdAt
              updatedAt
            }
          }
        `
    };

    const token = this.context.token;

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({selectedEvent: null})
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount(){
    this.isActive = false;
  }

  render() {
    
    return (
      <React.Fragment>
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            confirmText="Confirm"
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label className="label" htmlFor="title">
                  Title
                </label>
                <input
                  className="input input-bordered"
                  type="text"
                  id="title"
                  ref={this.titleElRef}
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="price">
                  Price
                </label>
                <input
                  className="input input-bordered"
                  type="number"
                  id="price"
                  ref={this.priceElRef}
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="date">
                  Date
                </label>
                <input
                  className="input input-bordered"
                  type="datetime-local"
                  id="date"
                  ref={this.dateElRef}
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        <div className="container mx-auto px-8">
          {this.state.selectedEvent && (
            <Modal
              title={this.state.selectedEvent.title}
              canConfirm
              canCancel
              cancelText = "Cancel"
              confirmText={this.context.token ? "Book" : "Confirm"}
              onCancel={this.modalCancelHandler}
              onConfirm={this.bookEventHandler}
            >
              <h1 className="font-bold">
                {this.state.selectedEvent.title}
              </h1>
              <h1 >
                {this.state.selectedEvent.description}
              </h1>
              <h1 >$ {this.state.selectedEvent.price}</h1>
              <h1 >
                {new Date(this.state.selectedEvent.date).toLocaleDateString()} at {new Date(this.state.selectedEvent.date).toTimeString().slice(0,5)}
              </h1>
              
            </Modal>
          )}
          {this.context.isAdmin && (
            <div className="events-control">
              <button
                className="btn mt-2 mb-4"
                onClick={this.startCreateEventHandler}
              >
                Create Event
              </button>
            </div>
          )}
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <EventList
              events={this.state.events}
              authUserId={this.context.userId}
              onViewDetail={this.showDetailHandler}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;