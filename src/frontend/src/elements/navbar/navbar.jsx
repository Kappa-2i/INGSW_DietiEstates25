import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import MenuListUser from '../MenuListUser/MenuListUser';
import MenuListAgent from '../MenuListAgent/MenuListAgent';
import MenuListManager from '../MenuListManager/MenuListManager';
import MenuListAdmin from '../MenuListAdmin/MenuListAdmin';

import listIcon from '../../assets/list.svg';
import favoritesIcon from '../../assets/heart-fill.svg';
import offersIcon from '../../assets/google.svg';

import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Stato per il profilo utente ottenuto dal backend
  const [userProfile, setUserProfile] = useState(null);
  
  // Altri stati per la navbar
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("BUY");

  // Recupera il profilo utente se il token esiste
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data.data);
      } catch (error) {
        console.error("Errore nel recupero del profilo:", error);
      }
    };
    fetchProfile();
  }, [token]);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    console.log("Ruolo utente:", userProfile?.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  // Funzioni per utente "USER"
  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleOffers = () => {
    navigate('/offers');
  };

  // Funzioni per "AGENT"
  const handleAddInsertion = () => {
    //navigate('/agent/add');
  };

  const handleYourInsertions = () => {
    navigate('/your-insertions');
  };

  const handleManageOffers = () => {
    navigate('/agent/offers');
  };

  const handleOnCreateManagerOrAgents = () => {
    navigate('/create-agent', { state: { userRole: userProfile.role } });
  }

  const handleYourAgents = () => {
    navigate('/your-agents');
  }

  // Gestione della ricerca
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/search/${activeSection}/${encodeURIComponent(searchTerm)}`);
    } else {
      alert("Inserisci un termine di ricerca");
    }
  };

  return (
    <nav className='navbar'>
      <div className='navbar__container'>
        {/* LOGO */}
        <div className='navbar__logo'>
          <a href='/'>
            <ImageDisplay 
              src='/assets/project-logo.svg' 
              alt='Project Logo' 
              defaultStyle='logo' 
            />
          </a>
        </div>

        <div className='div__invisible'/>

        {/* Centro: SearchBar */}
        <div className='navbar__center'>
          <div className='navbar__search'>
            <Button 
              defaultStyle="active-style"
              label="Vendita" 
              onClick={() => setActiveSection("BUY")}
              active={activeSection === "BUY"}
            />
            <Button 
              defaultStyle="active-style"
              label="Affitto" 
              onClick={() => setActiveSection("RENT")}
              active={activeSection === "RENT"}
            />
            <Input 
              placeholder='Inserisci Provincia...' 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className='div__invisible'/>
            <Button 
              label="Cerca"
              defaultStyle="search-style"
              onClick={handleSearch}
            />
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
            onClick={handleFavorites}
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
                {userProfile && userProfile.role === "AGENT" ? (
                  <MenuListAgent 
                    onProfile={handleProfile}
                    onAddInsertion={handleAddInsertion}
                    onManageOffers={handleManageOffers}
                    onYourInsertions={handleYourInsertions}
                    onLogout={handleLogout}
                  />
                ) : userProfile && userProfile.role === "MANAGER" ? (
                  <MenuListManager 
                    onProfile={handleProfile}
                    onYourInsertions={handleYourInsertions}
                    onLogout={handleLogout}
                    onCreateManagerOrAgents={handleOnCreateManagerOrAgents}
                    onYourAgents={handleYourAgents}
                  />
                ) : userProfile && userProfile.role === "ADMIN" ? (
                  <MenuListAdmin 
                    onProfile={handleProfile}
                    onManageOffers={handleManageOffers}
                    onLogout={handleLogout}
                    onCreateManagerOrAgents={handleOnCreateManagerOrAgents}
                    onYourManagersOrAgents={handleYourAgents}
                  />
                ) : (
                  // Fallback per utente normale (USER)
                  <MenuListUser
                    onProfile={handleProfile}
                    onFavorites={handleFavorites}
                    onOffers={handleOffers}
                    onLogout={handleLogout}
                  />
                )}
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
