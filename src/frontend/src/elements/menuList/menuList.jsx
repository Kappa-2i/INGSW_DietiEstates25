import React from 'react';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';
import './menuList.scss';

import profileIcon from '../../assets/person.svg';
import favoritesIcon from '../../assets/star.svg';
import offersIcon from '../../assets/google.svg';
import logoutIcon from '../../assets/box-arrow-left.svg';

const MenuList = ({ onProfile, onFavorites, onOffers, onLogout }) => {
  return (
    <div className='menu-list'>
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
            defaultStyle='cursor' 
          />
          <span>Preferiti</span>
        </li>
        <li onClick={onOffers}>
          <ImageDisplay 
            src={offersIcon} 
            alt='Offerte' 
            defaultStyle='cursor' 
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

export default MenuList;
