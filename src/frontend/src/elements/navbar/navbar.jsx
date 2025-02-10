import React, { useState } from 'react';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';
import Input from '../../components/input/Input';
import './navbar.scss';
import listIcon from '../../assets/list.svg';
import favoritesIcon from '../../assets/star.svg';
import offersIcon from '../../assets/google.svg';
import { useNavigate } from 'react-router-dom';
import MenuList from '../menuList/menuList';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleOffers = () => {
    navigate('/offers');
  };



  return (
    <nav className='navbar'>
      <div className='navbar__container'>
        {/* LOGO */}
        <div className='navbar__logo'>
          <ImageDisplay 
            src='/assets/project-logo.svg' 
            alt='Project Logo' 
            defaultStyle='logo' 
          />
        </div>

        {/* Centro: SearchBar */}
        <div className='navbar__center'>
          <div className='navbar__search'>
            <Input placeholder='Cerca...' />
          </div>
        </div>

        {/* Icona Offerte */}
        <div className='offers-wrapper'>
          <ImageDisplay
            src={offersIcon}
            alt='Offerte'
            defaultStyle='cursor'
          />
        </div>

        {/* Icona Preferiti */}
        <div className='favorites-wrapper'>
          <ImageDisplay
            src={favoritesIcon}
            alt='Preferiti'
            defaultStyle='cursor'
          />
        </div>

        {/* Menu Utente / Login */}
        {token ? (
          <div className='navbar__user'>
            <div className='navbar__user-icon' onClick={toggleUserMenu}>
              <ImageDisplay 
                src={listIcon}
                alt='User Logo' 
                defaultStyle='cursor' 
              />
            </div>
            {showUserMenu && (
              <div className='navbar__user-menu'>
                <MenuList 
                  onProfile={handleProfile}
                  onFavorites={handleFavorites}
                  onOffers={handleOffers}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        ) : (
          <div className='login-wrapper'>
            <p onClick={() => navigate('/login')}>Accedi</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
