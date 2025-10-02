import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css';
import AdminOnly from '../components/AdminOnly';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    guest_id: '',
    keywords: '',
    audio_file: null,
    video_file: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      // Dodaj text polja
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('guest_id', formData.guest_id);
      submitData.append('keywords', formData.keywords);
      
      // Dodaj fajlove ako postoje
      if (formData.audio_file) {
        submitData.append('audio_file', formData.audio_file);
      }
      if (formData.video_file) {
        submitData.append('video_file', formData.video_file);
      }

      const response = await axios.post('http://localhost:8000/api/episodes', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Episode uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        guest_id: '',
        keywords: '',
        audio_file: null,
        video_file: null
      });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Error uploading episode: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminOnly>
      <div className="upload">
        <div className="upload__container">
          <h1>Upload New Podcast Episode</h1>
          
          <form onSubmit={handleSubmit} className="upload__form">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Guest ID:</label>
              <input
                type="number"
                name="guest_id"
                value={formData.guest_id}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Keywords:</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="form-group">
              <label>Audio File (MP3):</label>
              <input
                type="file"
                name="audio_file"
                accept=".mp3,audio/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group">
              <label>Video File (MP4):</label>
              <input
                type="file"
                name="video_file"
                accept=".mp4,video/*"
                onChange={handleFileChange}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="upload__button"
            >
              {loading ? 'Uploading...' : 'Upload Episode'}
            </button>

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminOnly>
  );
};

export default Upload;