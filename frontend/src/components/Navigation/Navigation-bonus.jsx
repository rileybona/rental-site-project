import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import logo from '../../assests/logo.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='navBar'>
      <div className='home-logo'>
        <NavLink to='/'><img className='logo' src={logo}/></NavLink>
        <NavLink to="/" className='logo-text'>Breeze-Inn</NavLink>
      </div>
      {isLoaded && (
        <div className='profile-button-div'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;