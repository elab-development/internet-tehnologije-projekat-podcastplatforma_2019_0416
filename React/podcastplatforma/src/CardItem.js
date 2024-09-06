import React from 'react';

const CardItem = ({ podcast }) => {
  return (
    <div className='podcast-item'>
      <div className='podcast-item__content'>
        <video className='podcast-item__video' controls>
          <source src={podcast.videoSrc} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        <div className='podcast-item__info'>
          <h2 className='podcast-item__title'>{podcast.title}</h2>
          <p className='podcast-item__description'>{podcast.description}</p>
          <p className='podcast-item__keywords'>Keywords: {podcast.keywords.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
