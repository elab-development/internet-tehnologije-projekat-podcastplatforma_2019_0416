import React from 'react';
import './Card.css';
import CardItem from './CardItem';

function Cards({ podcasts }) {
  return (
    <div className='cards'>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {podcasts.map((podcast, index) => (
              <CardItem key={index} podcast={podcast} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
