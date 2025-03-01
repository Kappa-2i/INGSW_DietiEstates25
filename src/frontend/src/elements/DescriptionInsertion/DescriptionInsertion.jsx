import React from 'react';
import './DescriptionInsertion.scss';

const DescriptionInsertion = ({ description }) => {
  return (
    <div className="description-insertion">
      <h3>Descrizione</h3>
      <p>{description}</p>
    </div>
  );
};

export default DescriptionInsertion;
