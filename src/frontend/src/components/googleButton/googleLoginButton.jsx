import React from 'react';

const GoogleLoginButton = () => {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  return (
    <button onClick={handleGoogleLogin}>
      Accedi con Google
    </button>
  );
};

export default GoogleLoginButton;
