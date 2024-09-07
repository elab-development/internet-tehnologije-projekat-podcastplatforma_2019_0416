import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import SearchBar from '../SearchBar';
import './Podcasts.css';
import CardItem from '../CardItem';
import axios from 'axios';

const Podcasts = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // podkast podaci
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
      description: 'Description for Podcast 3',
      keywords: ['science', 'education'],
      videoSrc: '/videos/podcast3.mp4'
    },
    {
      title: 'Podcast 4',
      description: 'Description for Podcast 4',
      keywords: ['science', 'education'],
      videoSrc: '/videos/podcast4.mp4'
    },
    {
      title: 'Podcast 5',
      description: 'Description for Podcast 5',
      keywords: ['tech', 'innovation'],
      videoSrc: '/videos/podcast5.mp4'
    }
  ];

  const filteredPodcasts = podcastsData.filter(podcast => 
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ako nije loginovan onda redirect
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login page if user is not logged in
    } else if (user.role === 'admin') {
      setIsAdmin(true); // Set admin flag if user is an admin
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setMessage('Please provide a title and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      await axios.post('/api/podcasts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: Bearer ${user.token},
        },
      });
      setMessage('Podcast uploaded successfully!');
    } catch (error) {
      setMessage('Failed to upload podcast.');
    }
  };

  return (
    <div className='podcasts'>
      <h1>Podcast Gallery</h1>
      <SearchBar onSearch={setSearchQuery} />

      {/* za admina kacenje */}
      {isAdmin && (
        <div className='upload-section'>
          <h2>Upload a New Podcast</h2>
          <input type='text' placeholder='Podcast Title' value={title} onChange={handleTitleChange} />
          <input type='file' onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload Podcast</button>
          {message && <p>{message}</p>}
        </div>
      )}

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

export default Podcasts;