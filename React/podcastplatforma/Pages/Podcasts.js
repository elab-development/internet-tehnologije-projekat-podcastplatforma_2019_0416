import React, { useState } from 'react';
import SearchBar from '../SearchBar';
import './Podcasts.css';
import CardItem from '../CardItem';

const Podcasts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const podcastsData = [
    {
      title: 'Podcast 1',
      description: 'Description for Podcast 1',
      keywords: ['tech', 'innovation'],
      videoSrc: '/videos/podcast1.mp4'
    },
    {
      title: 'Podcast 2',
      description: 'Description for Podcast 2',
      keywords: ['science', 'education'],
      videoSrc: '/videos/podcast2.mp4'
    },
    {
      title: 'Podcast 3',
      description: 'Description for Podcast 2',
      keywords: ['science', 'education'],
      videoSrc: '/videos/podcast2.mp4'
    },
    {
      title: 'Podcast 4',
      description: 'Description for Podcast 2',
      keywords: ['science', 'education'],
      videoSrc: '/videos/podcast2.mp4'
    },
    {
      title: 'Podcast 5',
      description: 'Description for Podcast 1',
      keywords: ['tech', 'innovation'],
      videoSrc: '/videos/podcast1.mp4'
    }  ];

  const filteredPodcasts = podcastsData.filter(podcast => 
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className='podcasts'>
      <h1>Podcast Gallery</h1>
      <SearchBar onSearch={setSearchQuery} />
      <div className='podcasts__container'>
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map((podcast, index) => (
            <CardItem key={index} podcast={podcast} />
          ))
        ) : (
          <p>No podcasts found.</p>
        )}
      </div>
    </div>
  );
};

export default Podcasts;
