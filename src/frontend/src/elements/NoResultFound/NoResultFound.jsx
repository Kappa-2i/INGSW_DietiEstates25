import React from 'react';
import ImageDisplay from './ImageDisplay';
import './NoResultsFound.scss';

const NoResultsFound = ({
  imageSrc = '/images/no-results.png', // Percorso dell'immagine di default
  imageAlt = 'Nessun risultato trovato',
  message = 'nessun inserzione trovata'
}) => {
  return (
    <div className="no-results-found">
      <ImageDisplay 
        src={imageSrc} 
        alt={imageAlt} 
        defaultStyle="secondary" 
        customClass="no-results-image" 
      />
      <p className="no-results-text">{message}</p>
    </div>
  );
};

export default NoResultsFound;
