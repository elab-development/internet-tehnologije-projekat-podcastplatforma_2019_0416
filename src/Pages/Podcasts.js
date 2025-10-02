import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar';
import './Podcasts.css';
import CardItem from '../CardItem';
import AdminOnly from '../components/AdminOnly';
import { Button } from '../Button';

const Podcasts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async (searchTerm = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:8000/api/episodes';
      
      if (searchTerm) {
        url = `http://localhost:8000/api/episodes/search?search=${encodeURIComponent(searchTerm)}`;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      };

      const response = await axios.get(url, config);
      console.log('API Response:', response.data);
      
      setPodcasts(response.data);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchEpisodes(query);
  };

  return (
    <div className='podcasts'>
      <div className="podcasts__header">
        <h1>Podcast Gallery</h1>
        <AdminOnly>
          <Button 
            onClick={() => console.log('Open upload modal')}
            buttonStyle="btn--primary"
            buttonSize="btn--medium"
          >
            Upload New Episode
          </Button>
        </AdminOnly>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      <div className='podcasts__container'>
        {loading ? (
          <p>Loading...</p>
        ) : podcasts.length > 0 ? (
          podcasts.map((podcast) => (
            <CardItem key={podcast.id} podcast={podcast} />
          ))
        ) : (
          <p>No podcasts found.</p>
        )}
      </div>
    </div>
  );
};

export default Podcasts;