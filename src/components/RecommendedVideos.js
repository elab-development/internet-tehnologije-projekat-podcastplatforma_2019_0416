// src/components/RecommendedVideos.js
import React, { useState, useEffect } from 'react';
import YouTubeService from '../services/YouTubeService';
import './RecommendedVideos.css';

const RecommendedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Popularne podcast teme za preporuke
  const podcastTopics = ['technology', 'business', 'comedy', 'health', 'education', 'news'];

  useEffect(() => {
    fetchRecommendedVideos();
  }, []);

  const fetchRecommendedVideos = async () => {
    try {
      setLoading(true);
      setError('');

      // Biram nasumičnu temu za raznovrsnije preporuke
      const randomTopic = podcastTopics[Math.floor(Math.random() * podcastTopics.length)];
      const videosData = await YouTubeService.searchPodcasts(randomTopic);
      
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching recommended videos:', error);
      setError('Failed to load recommended videos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="recommended-videos">
        <h2>Recommended Podcasts</h2>
        <div className="videos-loading">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="recommended-videos">
      <div className="recommended-header">
        <h2>Recommended Podcasts</h2>
        <button 
          className="refresh-btn"
          onClick={fetchRecommendedVideos}
          disabled={loading}
        >
          🔄 New Recommendations
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="videos-grid">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <a 
              href={video.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="video-link"
            >
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="play-overlay">▶</div>
              </div>
              
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-channel">{video.channelTitle}</p>
                <p className="video-date">{formatDate(video.publishedAt)}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {videos.length === 0 && !loading && !error && (
        <div className="no-videos">
          <p>No recommendations available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendedVideos;