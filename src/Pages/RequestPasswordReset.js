import React, { useState } from 'react';
import axios from 'axios';
import './RequestPasswordReset.css'; // Create this CSS file for styling

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post('http://localhost:3000/request-password-reset', { email });
      setMessage('Check your email for the password reset link.');
    } catch (err) {
      setError('Failed to send password reset email.');
    }
  };

  return (
    <div className="request-password-reset-container">
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;
