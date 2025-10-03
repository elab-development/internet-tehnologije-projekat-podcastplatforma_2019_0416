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
import Upload from './Pages/Upload';
import AdminPanel from './Pages/AdminPanel';
import Footer from './Footer';
import './App.css';
import AddGuest from './Pages/AddGuest.js';
import Profile from './Pages/Profile.js';

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
          <Route path="/upload" element={<Upload />} /> 
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/add-guest" element={<AddGuest />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
