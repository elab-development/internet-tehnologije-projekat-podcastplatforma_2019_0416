// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './navBar';
import Home from './Pages/Home';
import Podcasts from './Pages/Podcasts';
import Guests from './Pages/Guests';
import Login from './Pages/Login';
import RequestPasswordReset from './Pages/RequestPasswordReset';
import ResetPassword from './Pages/ResetPassword';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
