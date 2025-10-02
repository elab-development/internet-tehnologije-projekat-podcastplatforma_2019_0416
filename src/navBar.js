import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './navBar.css';
import logo from './mylogo.png';
import { Button } from './Button';

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    
    const handleAuthChange = () => checkLoginStatus();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

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
          <Link to='/Podcasts' className='nav-links'>
            Podcasts
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/Guests' className='nav-links'>
            Guests
          </Link>
        </li>
      </ul>

      <div className='navbar-right'>
        {isLoggedIn ? (
          <Button 
            buttonStyle='btn--outline' 
            buttonSize='btn--medium' 
            onClick={handleLogout}
          >
            Logout
          </Button>
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