import { Link } from 'react-router-dom';
import './navBar.css';
import logo from './mylogo.png';

function NavBar() {
  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
      <Link to='/'>
      <img src= {logo} alt='Logo' className='logo-image' />
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
        <Link to='/login' className='login-button'>
          Login
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
