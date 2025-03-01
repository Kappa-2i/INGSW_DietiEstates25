import React, { useState } from 'react';

import ImageDisplay from '../../components/imageDisplay/imageDisplay';

import './GalleryInsertion.scss';


const GalleryInsertion = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    // Apre l'immagine in una nuova scheda
    window.open(images[currentIndex], '_blank');
  };

  if (!images || images.length === 0) {
    return <div className="gallery-insertion">Nessuna immagine disponibile</div>;
  }

  return (
    <div className="gallery-insertion">
      <div className="main-image" onClick={handleImageClick}>
        <img src={images[currentIndex]} alt={`Immagine ${currentIndex + 1}`} />
      </div>
      <div className="controls">
        <button onClick={goToPrevious} className="prev-button">&lt;</button>
        <button onClick={goToNext} className="next-button">&gt;</button>
      </div>
      <div className="thumbnails">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Miniatura ${index + 1}`}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryInsertion;
