import React from 'react';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';

import addInsertionIcon from '../../assets/house-add-fill.svg';
import yourInsertionsIcon from '../../assets/house-fill.svg';
import profileIcon from '../../assets/person.svg';
import logoutIcon from '../../assets/box-arrow-left.svg';

import './MenuListAgent.scss';

const MenuListAgent = ({ 
  onAddInsertion, 
  onYourInsertions,  
  onProfile, 
  onLogout 
}) => {
  return (
    <div className='menu-list-agent'>
      <ul>
        <li onClick={onAddInsertion}>
          <ImageDisplay 
            src={addInsertionIcon} 
            alt='Aggiungi Inserzione' 
            defaultStyle='menu-icon' 
          />
          <span>Aggiungi Inserzione</span>
        </li>
        <li onClick={onYourInsertions}>
          <ImageDisplay 
            src={yourInsertionsIcon} 
            alt='Le tue Inserzioni' 
            defaultStyle='menu-icon' 
          />
          <span>Le tue Inserzioni</span>
        </li>
        <li onClick={onProfile}>
          <ImageDisplay 
            src={profileIcon} 
            alt='Profilo' 
            defaultStyle='menu-icon' 
          />
          <span>Profilo</span>
        </li>
        <li onClick={onLogout}>
          <ImageDisplay 
            src={logoutIcon} 
            alt='Logout' 
            defaultStyle='menu-icon' 
          />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default MenuListAgent;
