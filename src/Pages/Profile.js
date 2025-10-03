import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.password) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      await axios.patch('http://localhost:8000/api/profile', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Osveži podatke
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.errors) {
        setError(Object.values(error.response.data.errors).flat().join(' '));
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete('http://localhost:8000/api/profile', {
        data: { password: deletePassword },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      if (error.response?.data?.errors) {
        setError(Object.values(error.response.data.errors).flat().join(' '));
      } else {
        setError('Failed to delete account. Please check your password.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="profile"><p>Please log in to view your profile.</p></div>;
  }

  return (
    <div className="profile">
      <div className="profile__container">
        <h1>My Profile</h1>
        
        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        {!editMode && !deleteMode && (
          <div className="profile__view">
            <div className="profile__info">
              <div className="profile__field">
                <label>Name:</label>
                <p>{user.name || 'Not set'}</p>
              </div>
              <div className="profile__field">
                <label>Email:</label>
                <p>{user.email || 'Not available'}</p>
              </div>
              <div className="profile__field">
                <label>Account Type:</label>
                <p>{user.is_admin ? 'Administrator' : 'Standard User'}</p>
              </div>
            </div>
            
            <div className="profile__actions">
              <button 
                className="btn btn--primary"
                onClick={() => setEditMode(true)}
                disabled={loading}
              >
                Edit Profile
              </button>
              <button 
                className="btn btn--danger"
                onClick={() => setDeleteMode(true)}
                disabled={loading}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {editMode && (
          <form className="profile__form" onSubmit={handleUpdateProfile}>
            <h2>Edit Profile</h2>
            
            <div className="form__group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* <div className="form__group">
              <label htmlFor="password">New Password (leave blank to keep current):</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="form__group">
              <label htmlFor="password_confirmation">Confirm New Password:</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                placeholder="Confirm new password"
              />
            </div> */}

            <div className="form__actions">
              <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn btn--secondary"
                onClick={() => setEditMode(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {deleteMode && (
          <form className="profile__delete" onSubmit={handleDeleteAccount}>
            <h2>Delete Account</h2>
            <div className="warning-message">
              <p><strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.</p>
            </div>
            
            <div className="form__group">
              <label htmlFor="deletePassword">Enter your password to confirm:</label>
              <input
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="form__actions">
              <button 
                type="submit" 
                className="btn btn--danger"
                disabled={!deletePassword || loading}
              >
                {loading ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
              <button 
                type="button" 
                className="btn btn--secondary"
                onClick={() => setDeleteMode(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;