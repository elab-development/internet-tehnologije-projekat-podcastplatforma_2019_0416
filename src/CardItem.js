import React from 'react';
import './CardItem.css';

const CardItem = ({ podcast }) => {
  const title = podcast.naslov || podcast.title || 'No Title';
  const description = podcast.opis || podcast.description || 'No Description';

  let keywords = [];
  if (podcast.kljucneReci) {
    keywords = typeof podcast.kljucneReci === 'string' 
      ? podcast.kljucneReci.split(',').map(k => k.trim())
      : podcast.kljucneReci;
  } else if (podcast.keywords) {
    keywords = podcast.keywords;
  }


  let videoSrc = '';
  if (podcast.audio_video_path) {
    // Probaj različite formate putanja
    if (podcast.audio_video_path.startsWith('episodes/')) {
      videoSrc = `http://localhost:8000/storage/${podcast.audio_video_path}`;
    } else {
      videoSrc = `http://localhost:8000/storage/episodes/${podcast.audio_video_path}`;
    }
  } else {
    videoSrc = podcast.videoSrc || '';
  }

  console.log('Video source:', videoSrc);


  // const videoSrc = podcast.audio_video_path 
  //   ? `http://localhost:8000/storage/${podcast.audio_video_path}`
  //   : podcast.videoSrc;

  return (
    <div className='podcast-item'>
      <div className='podcast-item__content'>
        <video className='podcast-item__video' controls>
          <source src={videoSrc} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        <div className='podcast-item__info'>
          <h2 className='podcast-item__title'>{title}</h2>
          <p className='podcast-item__description'>{description}</p>
          <p className='podcast-item__keywords'>
            Keywords: {keywords.length > 0 ? keywords.join(', ') : 'No keywords'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardItem;