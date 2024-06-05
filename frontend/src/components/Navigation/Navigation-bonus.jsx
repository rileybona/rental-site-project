import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import logo from '../../assests/logo.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const logedIn = (sessionUser !== null);

  return (
    <nav className='navBar'>
      <div className='home-logo'>
        <NavLink to='/'><img className='logo' src={logo}/></NavLink>
        <NavLink to="/" className='logo-text'>Breeze-Inn</NavLink>
      </div>
      {logedIn && <NavLink to='/spots/new'>Create a New Spot</NavLink>}
      {isLoaded && (
        <div className='profile-button-div'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;