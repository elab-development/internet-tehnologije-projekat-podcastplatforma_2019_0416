import React, { useState } from 'react';
import axios from 'axios';
import './RequestPasswordReset.css'; 
import { Button } from '../Button';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/forgot-password', { 
        email 
      });
    
      console.log('Full response:', response.data);
    
    // Ako postoji reset_url, prikaži ga korisniku
      if (response.data.reset_url) {
        setMessage(
          <div>
            <p>Password reset link generated successfully!</p>
            <p>Copy this link to reset your password:</p>
            <div style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              border: '1px solid #ddd',
              margin: '10px 0',
              wordBreak: 'break-all'
            }}>
              <a href={response.data.reset_url} target="_blank" rel="noopener noreferrer">
                {response.data.reset_url}
              </a>
            </div>
            <p>Or click this button: 
              <button 
                onClick={() => window.open(response.data.reset_url, '_blank')}
                style={{ marginLeft: '10px', padding: '5px 10px' }}
              >
                Open Reset Page
              </button>
            </p>
          </div>
        );
      } else {
        setMessage('Check your email for the password reset link.');
      }
    
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to send password reset email.');
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

        <Button 
          type="submit" 
          buttonStyle="btn--primary" 
          buttonSize="btn--medium"
        >
          Send Reset Link
        </Button>

      </form>
    </div>
  );
};

export default RequestPasswordReset;
