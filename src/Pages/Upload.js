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
    media_file: null
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
      media_file: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Provera veličine fajla
    if (formData.media_file && formData.media_file.size > 20 * 1024 * 1024) {
      setMessage('Error: File size must be less than 20MB');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Uploading episode...');
      
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('guest_id', formData.guest_id);
      
      if (formData.keywords) {
        submitData.append('keywords', formData.keywords);
      }
      
      // Add media file (matches backend 'audio_video' field name)
      if (formData.media_file) {
        submitData.append('audio_video', formData.media_file);
      }

      console.log('Sending request to server...');

      const response = await axios.post('http://localhost:8000/api/episodes', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 sekundi timeout
      });

      console.log('Upload successful:', response.data);
      setMessage('Episode uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        guest_id: '',
        keywords: '',
        media_file: null
      });
      
      // Reset file input
      document.querySelector('input[type="file"]').value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Error uploading episode: ';
      
      if (error.response?.status === 413) {
        errorMessage = 'File too large. Maximum size is 20MB.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage += errors.join(', ');
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Network error. Please check if server is running.';
      } else {
        errorMessage += error.message || 'Unknown error occurred';
      }
      
      setMessage(errorMessage);
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
              <label>Keywords (optional):</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="form-group">
              <label>Media File (Audio or Video):</label>
              <input
                type="file"
                name="media_file"
                accept=".mp3,.mp4,.wav"
                onChange={handleFileChange}
                required
              />
              <small>Accepted formats: MP3, MP4, WAV (max 20MB)</small>
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