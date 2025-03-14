import React from 'react';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';
import './NoResultFound.scss';
import notFound from '../../assets/notfound.png'

const NoResultsFound = ({
  imageSrc = notFound,
  imageAlt = 'Nessun risultato trovato',
  message = 'Nessun inserzione trovata'
}) => {
  return (
    <div className="no-results-found">
      <ImageDisplay 
        src={imageSrc} 
        alt={imageAlt} 
        defaultStyle="notFound" 
      />
      <p className="no-results-text">{message}</p>
    </div>
  );
};

export default NoResultsFound;
