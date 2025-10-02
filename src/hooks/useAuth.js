import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);

    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUserData = localStorage.getItem('user');
      const updatedToken = localStorage.getItem('token');
      
      if (updatedUserData && updatedToken) {
        setUser(JSON.parse(updatedUserData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const isAdmin = user?.is_admin === true;

  return { user, isAdmin, loading };
};