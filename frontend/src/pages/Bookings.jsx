import React, { Component } from 'react';
import AuthContext from '../context/auth-context'
import BookingsList from '../components/bookings/bookingsList/bookingsList'
import Spinner from '../components/spinner/spinner'
class BookingsPage extends Component {

static contextType = AuthContext;

    state = {
        isLoading: false,
        bookings: []
    }

    fetchBookings = () => {
        this.setState({isLoading: true})
        const requestBody = {
          query: `
              query {
                bookings {
                  _id
                  createdAt
                  event{
                      title
                  }
                  user{
                      email
                      profile{
                        name
                        lastname
                      }
                  }
                }
              }
            `
        };
    
        fetch('http://localhost:3000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.context.token
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            const bookings = resData.data.bookings;
            this.setState({ bookings: bookings, isLoading:false });
          })
          .catch(err => {
            console.log(err);
            this.setState({isLoading:false})
          });
      }

    componentDidMount(){
        this.fetchBookings()
    }

    cancelBookingHandler = (bookingId) => {
      this.setState({isLoading: true})
        const requestBody = {
          query: `
              mutation {
                cancelBooking (bookingId: "${bookingId}") {
                 _id
                 title
                }
              }
            `
        };
    
        fetch('http://localhost:3000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.context.token
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(() => {
            this.setState(prevState => {
              const updatedBookings = prevState.bookings.filter(booking => {
                return booking._id !== bookingId;
              })
              return {bookings: updatedBookings, isLoading:false}
            });
          })
          .catch(err => {
            console.log(err);
            this.setState({isLoading:false})
          });
    }

    render() {
      return (
        <div className="container mx-auto px-8 mt-8">
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <BookingsList bookings={this.state.bookings} cancelBooking = {this.cancelBookingHandler} />
          )}
        </div>
      );
    }
}

export default BookingsPage;