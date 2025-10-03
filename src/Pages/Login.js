import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { Button } from '../Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
    // ZAMENI OVAJ DEO:
      const response = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
      });
    
      const { token, is_admin } = response.data;
      console.log('Login API Response:', response.data);

    // Store the token in local storage or any other storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        is_admin: is_admin
      }));

      window.dispatchEvent(new Event('authChange'));

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

      const response = await axios.post('http://localhost:8000/api/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: password
      });

      console.log('Signup API Response:', response.data);
      // Store the token in local storage or any other storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: name,
        email: email,
        is_admin: response.data.is_admin
      }));

      window.dispatchEvent(new Event('authChange'));

      // Redirect to the Podcast Gallery page
      navigate('/podcasts');
    } catch (error) {
      console.error('Signup error: ', error.response?.data);
      setError('Signup failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        {isSignup && (
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
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


        <Button 
          type="submit"
          buttonStyle="btn--primary"
          buttonSize="btn--medium"
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </Button>


        <Button 
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          buttonStyle="btn--solid-black"
          buttonSize="btn--medium"
          className="toggle-button"
        >

          {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </Button>



        {!isSignup && (
          <div className="forgot-password-container">
            <Link to="/request-password-reset" className="forgot-password-link">
             Forgot password?
            </Link>
          </div>
        )}

      </form>
    </div>
  );
};

export default Login;
