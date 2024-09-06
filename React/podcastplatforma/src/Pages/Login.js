import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      // Store the token in local storage or any other storage
      localStorage.setItem('token', response.data.token);

      // Redirect to the Podcast Gallery page
      navigate('/podcasts');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/signup', {
        email,
        password,
      });

      // Store the token in local storage or any other storage
      localStorage.setItem('token', response.data.token);

      // Redirect to the Podcast Gallery page
      navigate('/podcasts');
    } catch (error) {
      setError('Signup failed');
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="toggle-button"
        >
          {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Login;
