import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import ProfessionalsPage from './pages/Professionals'
import HomePage from './pages/HomePage'
import MainNavigation from './components/navigation/MainNavigation'
import AuthContext from './context/auth-context'
import { Component } from 'react';

class App extends Component {

  state = {
    token: null,
    userId: null,
    isAdmin: null,
    profileName: null,
    profileLastName: null
  }

  login = (token, userId, isAdmin, tokenExpiration, profileName, profileLastName) =>{
    this.setState({token: token, userId: userId, isAdmin: isAdmin, profileName: profileName, profileLastName: profileLastName})
  }

  logout = () => {
    this.setState({token: null, userId: null})
  }

  render() {
    return (
      <div className="App" data-theme="dracula">
        <Router>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              isAdmin: this.state.isAdmin,
              profileName: this.state.profileName,
              profileLastName: this.state.profileLastName,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
            {!this.state.token && <Routes>
                <Route path="/" element={<AuthPage/>} />
                <Route path="/professionals" element={<AuthPage />} /> 
                <Route path="/bookings" element={<AuthPage />} /> 
                <Route path="/events" element={<AuthPage />} /> 
              </Routes>}
            {this.state.token && <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/professionals" element={<ProfessionalsPage />} /> 
                <Route path="/bookings" element={<BookingsPage />} /> 
                <Route path="/events" element={<EventsPage />} /> 
              </Routes>}
            </main>
          </AuthContext.Provider>
        </Router>
      </div>
    );
  }
}

export default App;
