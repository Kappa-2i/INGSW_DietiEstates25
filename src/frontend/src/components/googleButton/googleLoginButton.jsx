import React from 'react';

import GoogleImg from '../../assets/google.svg';

import './googleLoginButton.scss';

const GoogleLoginButton = () => {

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <button className="google-button" onClick={handleGoogleLogin}>
      <img src={GoogleImg} alt="Google Logo" className="google-icon" />
      Accedi con Google
    </button>
  );
};

export default GoogleLoginButton;
