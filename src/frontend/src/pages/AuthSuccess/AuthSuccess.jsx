import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Estrai il token dalla query string
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/'); // oppure un'altra rotta, ad esempio '/profile'
    }
  }, [location, navigate]);

  return (
    <div>
      Autenticazione in corso...
    </div>
  );
};

export default AuthSuccess;
