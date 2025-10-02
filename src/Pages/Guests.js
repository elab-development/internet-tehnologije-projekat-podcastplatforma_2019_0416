import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Guests.css';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      };

      const response = await axios.get('http://localhost:8000/api/guests', config);
      console.log('Guests API Response:', response.data);
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      setError('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  // Funkcija za dobijanje putanje slike
  const getImageSrc = (guest) => {
    console.log('Guest image data:', guest.imePrezimeG, guest.image);
    
    if (guest.image) {
      // Ako slika počinje sa 'images/', koristi je direktno
      if (guest.image.startsWith('images/')) {
        return `/${guest.image}`;
      }
      // Ako je samo ime fajla, dodaj putanju
      return `/images/${guest.image}`;
    }
    // Podrazumevana slika
    return '/images/default-guest.jpg';
  };

  if (loading) {
    return <div className='guests'><p>Loading guests...</p></div>;
  }

  if (error) {
    return <div className='guests'><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className='guests'>
      <h1>Upcoming Guests</h1>
      <div className='guests__container'>
        {guests.length > 0 ? (
          guests.map((guest) => (
            <div key={guest.id} className='guest-card'>
              <div className='guest-card__image'>
                {/* OVO JE ISPRAVLJENO - getImageSrc(guest) umesto guest.imageSrc */}
                <img 
                  src={getImageSrc(guest)} 
                  alt={guest.imePrezimeG} 
                  onError={(e) => {
                    e.target.src = '/images/default-guest.jpg';
                  }}
                />
              </div>
              <div className='guest-card__info'>
                <h2 className='guest-card__name'>{guest.imePrezimeG}</h2>
                <p className='guest-card__description'>{guest.bio || 'No description available'}</p>
                {guest.firma && (
                  <p className='guest-card__company'>Company: {guest.firma}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No guests found.</p>
        )}
      </div>
    </div>
  );
};

export default Guests;