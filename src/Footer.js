import React from 'react';
import './Footer.css';
import { Button } from './Button';
import { useState } from 'react';
import axios from 'axios';

function Footer() {
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Šaljem newsletter request:', { email });

      const response = await axios.post('http://localhost:8000/api/newsletter/subscribe', {
        email: email
      });
      
      console.log('Newsletter response:', response);
      alert(response.data.message);
      setEmail('');
    } catch (error) {
      console.error('Newsletter error:', error);
      console.error('Error response:', error.response);
      if (error.response?.data?.errors?.email) {
        alert(error.response.data.errors.email[0]);
      } else {
        alert('Došlo je do greške. Pokušajte ponovo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Morate biti prijavljeni da biste ostavili komentar.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/suggestions', 
        {
          comment: comment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      alert(response.data.message);
      setComment('');
    } catch (error) {
      console.error('Suggestion error:', error);
      if (error.response?.status === 401) {
        alert('Vaša sesija je istekla. Molimo prijavite se ponovo.');
      } else if (error.response?.data?.errors?.comment) {
        alert(error.response.data.errors.comment[0]);
      } else {
        alert('Došlo je do greške. Pokušajte ponovo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Prijavi se na newsletter i budi obavešten o svim novim podkastima!
        </p>
        <p className='footer-subscription-text'>
          Čeka vas dosta uzbudljivog sadržaja.
        </p>
        <div className='input-areas'>
          <form onSubmit={handleNewsletterSubmit}>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              buttonStyle='btn--outline' 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Prijava...' : 'Prijavi se'}
            </Button>
          </form>
        </div>
      </section>
      
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Ostavite nam sugestiju/komentar!
        </p>
        {!isLoggedIn && (
          <p className='footer-subscription-text' style={{ color: '#f00', fontSize: '14px' }}>
            Morate biti prijavljeni da biste ostavili komentar.
          </p>
        )}
        <div className='input-areas'>
          <form onSubmit={handleSuggestionSubmit}>
            <textarea
              className='footer-input footer-textarea'
              name='comment'
              placeholder={isLoggedIn ? 'Komentar' : 'Prijavite se da biste ostavili komentar'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="3"
              disabled={!isLoggedIn}
            />
            <br />
            <Button 
              buttonStyle='btn--outline' 
              type="submit"
              disabled={loading || !isLoggedIn}
            >
              {loading ? 'Slanje...' : 'Pošalji komentar'}
            </Button>
          </form>
        </div>
      </section>
      
      <div className='website-rights'>PODCASTS © 2024</div>
    </div>
  );
}

export default Footer;