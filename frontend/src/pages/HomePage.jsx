import React, { Component } from 'react';
import AuthContext from '../context/auth-context'


class BookingsPage extends Component {
    
static contextType = AuthContext;
    render() {
        return <h1>{this.context.profileName} {this.context.profileLastName}</h1>;
    }
}

export default BookingsPage;