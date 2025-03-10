import React from 'react';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';

// Importa le icone specifiche per il ruolo di amministratore
import createAgentIcon from '../../assets/person-fill-add.svg';
import yourAgentsIcon from '../../assets/people-fill.svg';
import addInsertionIcon from '../../assets/house-add-fill.svg';
import yourInsertionsIcon from '../../assets/house-fill.svg';
import manageOffersIcon from '../../assets/notfound.png';
import profileIcon from '../../assets/person.svg';
import logoutIcon from '../../assets/box-arrow-left.svg';

import './MenuListAdmin.scss';

const MenuListAdmin = ({ 
  onCreateManagerOrAgents,
  onYourManagersOrAgents,
  onAddInsertion,
  onYourInsertions,
  onManageOffers,
  onProfile,
  onLogout
}) => {
  return (
    <div className='menu-list-admin'>
      <ul>
        <li onClick={onCreateManagerOrAgents}>
          <ImageDisplay 
            src={createAgentIcon}
            alt='Crea Manager/Agenti'
            defaultStyle='menu-icon'
          />
          <span>Crea Manager/Agenti</span>
        </li>
        <li onClick={onYourManagersOrAgents}>
          <ImageDisplay 
            src={yourAgentsIcon}
            alt='I Tuoi Manager/Agenti'
            defaultStyle='menu-icon'
          />
          <span>I Tuoi Manager/Agenti</span>
        </li>
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
        <li onClick={onManageOffers}>
          <ImageDisplay 
            src={manageOffersIcon}
            alt='Gestisci Offerte'
            defaultStyle='menu-icon'
          />
          <span>Gestisci Offerte</span>
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

export default MenuListAdmin;
