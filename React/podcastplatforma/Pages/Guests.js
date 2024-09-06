import React from 'react';
import './Guests.css';

const guestsData = [
  {
    name: 'John Doe',
    imageSrc: '/images/John.jpg', 
    description: 'John Doe is a renowned speaker known for his insights on technology and innovation.'
  },
  {
    name: 'Jane Smith',
    imageSrc: '/images/Jane.jpg',
    description: 'Jane Smith is a celebrated author and thought leader in the field of literature.'
  },
];

const Guests = () => {
  return (
    <div className='guests'>
      <h1>Upcoming Guests</h1>
      <div className='guests__container'>
        {guestsData.map((guest, index) => (
          <div key={index} className='guest-card'>
            <div className='guest-card__image'>
              <img src={guest.imageSrc} alt={guest.name} />
            </div>
            <div className='guest-card__info'>
              <h2 className='guest-card__name'>{guest.name}</h2>
              <p className='guest-card__description'>{guest.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guests;
