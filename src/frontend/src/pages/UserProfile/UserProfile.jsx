import React from 'react'
import Navbar from '../../elements/navbar/navbar';
import UserDetailsCard from '../../elements/userDetailsCard/UserDetailsCard'
import './UserProfile.scss';

const UserProfile = () => {
  return (
    <div className='user-profile-page'>
      <div className='navbar-wrapper'>
        <Navbar/>
      </div>

      {/* Wrapper per contenuti centrali */}
      <div className='profile-content'>
        <div className='user-image-wrapper'>
          {/* Immagine utente */}
        </div>

        <div className='user-info-wrapper'>
          <UserDetailsCard />
        </div>
      </div>
    </div>
  )
}

export default UserProfile;
