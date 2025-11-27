import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TravelModes from './components/TravelModes';
import HotelBooking from './components/HotelBooking';
import Flights from './components/Flights';
import Trains from './components/Trains';
import Buses from './components/Buses';
import Cabs from './components/Cabs';
import Ferries from './components/Ferries';
import ItineraryPlanner from './components/ItineraryPlanner';
import Payments from './components/Payments';
import Profile from './components/Profile';
import Footer from './components/Footer';
import LoginSignupPopup from './components/LoginSignupPopup';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [initialMode, setInitialMode] = useState('login');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.body.className = darkMode ? 'dark' : '';
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLoginPopup(false);
  };

  const handleLoginClick = () => {
    setInitialMode('login');
    setShowLoginPopup(true);
  };

  const handleSignupClick = () => {
    setInitialMode('signup');
    setShowLoginPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.className = newDarkMode ? 'dark' : '';
  };

  return (
    <Router basename="/Ushakiran-Front">
      <div className="App">
        <Navbar
          isAuthenticated={isAuthenticated}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          onLogout={handleLogout}
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
        />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/travel-modes" element={<TravelModes />} />
            <Route path="/hotels" element={<HotelBooking />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/cabs" element={<Cabs />} />
            <Route path="/ferries" element={<Ferries />} />
            <Route path="/itinerary" element={<ItineraryPlanner />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
          </Routes>
        </main>
        <Footer />
        {showLoginPopup && (
          <LoginSignupPopup
            onClose={() => setShowLoginPopup(false)}
            onLogin={handleLogin}
            initialMode={initialMode}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
