import React from 'react';
import './DetailsSurfaceInsertion.scss';

const DetailsSurfaceInsertion = ({ rooms, bathrooms, balconies, surface, floor, energyClass, contract }) => {
  return (
    <div className="details-surface">
      <h3>Caratteristiche Specifiche</h3>
      <p>
        <strong>Camere:</strong> {rooms || 0}
      </p>
      <p>
        <strong>Bagni:</strong> {bathrooms || 0}
      </p>
      <p>
        <strong>Balconi:</strong> {balconies || 0}
      </p>
      <br />
      <p>
        <strong>Superficie:</strong> {surface} mq
      </p>
      <p>
        <strong>Piano:</strong> {floor !== undefined ? floor : "-"}
      </p>
      <p>
        <strong>Classe Energetica:</strong> {energyClass}
      </p>
      <br />
      <p>
        <strong>Tipologia Contratto:</strong>{" "}
        {contract === "BUY" ? "In Vendita" : contract === "RENT" ? "In Affitto" : contract}
      </p>
    </div>
  );
};

export default DetailsSurfaceInsertion;
