import React from 'react';
import GoogleImg from '../../assets/google.svg'
import './googleLoginButton.scss'
const GoogleLoginButton = () => {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  return (
    <button className="google-button" onClick={handleGoogleLogin}>
      <img src={GoogleImg} alt="Google Logo" className="google-icon" />
      Accedi con Google
    </button>
  );
};

export default GoogleLoginButton;
