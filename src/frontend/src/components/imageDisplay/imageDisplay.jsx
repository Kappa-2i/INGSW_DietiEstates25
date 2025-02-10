import React from 'react';
import './imageDisplay.scss';

/**
 * A reusable component for displaying images.
 *
 * @param {string} src - L'URL dell'immagine da visualizzare.
 * @param {string} alt - Il testo alternativo dell'immagine.
 * @param {Function} onClick - Callback da eseguire al click sull'immagine.
 * @param {string} defaultStyle - Preset di stile CSS (es. 'primary', 'secondary').
 * @param {string} customClass - Classi CSS aggiuntive per personalizzare lo stile.
 * @param {object} style - Oggetto di stile inline per eventuali ulteriori personalizzazioni.
 *
 * @returns {React.Element} Il componente immagine renderizzato.
 */
const ImageDisplay = ({
  src,
  alt = '',
  onClick,
  defaultStyle = 'primary',
  customClass = '',
  style = {}
}) => {
  return (
    <div
      className={`image-display-wrapper ${defaultStyle} ${customClass}`}
      style={style}
      onClick={onClick}
    >
      <img src={src} alt={alt} />
    </div>
  );
};

export default ImageDisplay;
