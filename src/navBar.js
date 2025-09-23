import { Link } from 'react-router-dom';
import './navBar.css';
import logo from './mylogo.png';
import { Button } from './Button';

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

        <Button buttonStyle='btn--outline' buttonSize='btn--medium' link='/login'>
          Login
        </Button>

      </div>


    </nav>
  );
}

export default NavBar;
