import React from 'react';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';

import profileIcon from '../../assets/person.svg';
import favoritesIcon from '../../assets/star.svg';
import offersIcon from '../../assets/google.svg';
import logoutIcon from '../../assets/box-arrow-left.svg';

import './MenuListUser.scss';

const MenuListUser = ({ onProfile, onFavorites, onOffers, onLogout }) => {
  return (
    <div className='menu-list-user'>
      <ul>
        <li onClick={onProfile}>
          <ImageDisplay 
            src={profileIcon} 
            alt='Profilo Icon' 
            defaultStyle='menu-icon' 
          />
          <span>Profilo</span>
        </li>
        <li onClick={onFavorites}>
          <ImageDisplay 
            src={favoritesIcon} 
            alt='Preferiti' 
            defaultStyle='menu-icon' 
          />
          <span>Preferiti</span>
        </li>
        <li onClick={onOffers}>
          <ImageDisplay 
            src={offersIcon} 
            alt='Offerte' 
            defaultStyle='menu-icon' 
          />
          <span>Offerte</span>
        </li>
        <li onClick={onLogout}>
          <ImageDisplay 
            src={logoutIcon} 
            alt='Logout Icon' 
            defaultStyle='menu-icon' 
          />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default MenuListUser;
