import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './navBar.css';
import logo from './mylogo.png';
import { Button } from './Button';
import { useAuth } from './hooks/useAuth';

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
      await fetchUserData(token);
    } else {
      setUserName('');
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      setUserName(response.data.name || response.data.email);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Ako je 401, token je istekao
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserName('');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await axios.post('http://localhost:8000/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserName('');
      
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    }
  };

  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <Link to='/'>
          <img src={logo} alt='Logo' className='logo-image' />
        </Link>
      </div>
      <ul className='nav-menu'>
        <li className='nav-item'>
          <Link to='/' className='nav-links'>
            Home
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/podcasts' className='nav-links'>
            Podcasts
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/guests' className='nav-links'>
            Guests
          </Link>
        </li>
        
        {isAdmin && (
          <li className='nav-item'>
            <Link to='/admin' className='nav-links admin-link'>
              Admin Panel
            </Link>
          </li>
        )}
      </ul>

      <div className='navbar-right'>
        {isLoggedIn ? (
          <div className="user-menu">
            <Link to="/profile" className="nav-links user-profile-link">
              Welcome, {user?.name || user?.email || 'User'}
            </Link>
            <Button 
              buttonStyle='btn--outline' 
              buttonSize='btn--medium' 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button 
            buttonStyle='btn--outline' 
            buttonSize='btn--medium' 
            link='/login'
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;