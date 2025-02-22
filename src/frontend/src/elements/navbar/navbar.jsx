import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import MenuList from '../menuList/menuList';
import listIcon from '../../assets/list.svg';
import favoritesIcon from '../../assets/star.svg';
import offersIcon from '../../assets/google.svg';
import regionsData from '../../data/Italy.json';
import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("BUY");

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

  // Costruisci un array di tutti i comuni (in minuscolo) dall'oggetto regionsData
  const validMunicipalities = Object.values(regionsData)
    .flat()
    .map(comune => comune.toLowerCase());

  const handleSearch = () => {
    // Confronta in modo case-insensitive
    if (validMunicipalities.includes(searchTerm.trim().toLowerCase())) {
      navigate(`/search/${activeSection}/${encodeURIComponent(searchTerm)}`);
    } else {
      alert("Inserisci un comune corretto");
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
