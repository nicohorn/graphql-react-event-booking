import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNavigation from './components/navigation/MainNavigation'

function App() {
  return (
    <div className="App">
      <Router>
        <MainNavigation/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
