import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('authChange', checkAuthStatus);
    return () => window.removeEventListener('authChange', checkAuthStatus);
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching profile with token:', token);
      const response = await axios.get('http://localhost:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('Profile response:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Auth check error:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.is_admin === true;

  return { user, isAdmin, loading };
};