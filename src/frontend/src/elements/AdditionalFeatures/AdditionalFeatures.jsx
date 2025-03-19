import React from 'react';
import './AdditionalFeatures.scss';

const AdditionalFeatures = ({ garage, terrace, garden, elevator, climate, reception }) => {

  const features = [];
  if (garage) features.push("Garage");
  if (terrace) features.push("Terrazzo");
  if (garden) features.push("Giardino");
  if (elevator) features.push("Ascensore");
  if (climate) features.push("Climatizzazione");
  if (reception) features.push("Portineria");


  if (features.length === 0) return null;

  return (
    <div className="additional-features">
      <h3>Caratteristiche Aggiuntive</h3>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdditionalFeatures;
