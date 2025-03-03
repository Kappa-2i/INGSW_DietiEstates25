import React, { useState } from "react";
import "./NumberInput.scss"; // Importa il file SCSS

/**
 * Componente per l'input numerico con separatori di migliaia e unità di misura.
 * Accetta solo numeri, gestisce correttamente il separatore delle migliaia.
 *
 * @param {string} label - L'etichetta dell'input.
 * @param {string} value - Il valore dell'input.
 * @param {Function} onChange - Funzione per gestire il cambiamento del valore.
 * @param {string} placeholder - Il testo del placeholder.
 * @param {string} unit - L'unità di misura da visualizzare.
 * @param {string} defaultStyle - Tipo di stile applicato nel scss
 * @returns {React.Element}
 */
const NumberInput = ({ label, value, onChange, placeholder, unit, isCap = false, isHouseNumber = false }) => {
    
  // Funzione per input numerici con separatori di migliaia
  const handleNumberInputChange = (e) => {
      let input = e.target.value;

      input = input.replace(/[^0-9,]/g, "");
      let [integer, decimal] = input.split(",");

      if (integer) {
          integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      if (decimal) {
          decimal = decimal.slice(0, 2);
      }

      let formattedValue = decimal ? `${integer},${decimal}` : integer;
      onChange(formattedValue);
  };

  // Funzione per il CAP (solo numeri, massimo 5 cifre)
  const handleCapInputChange = (e) => {
      let input = e.target.value;

      input = input.replace(/\D/g, "");

      // Limita la lunghezza a 5 cifre
      input = input.slice(0, 5);

      onChange(input);
  };

  // Funzione per il Civico (solo numeri, massimo 10 cifre)
  const handleHouseNumberChange = (e) => {
      let input = e.target.value;

      // Permette solo numeri
      input = input.replace(/\D/g, "");

      input = input.slice(0, 10);

      onChange(input);
  };

  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper number-style">
        <input
          className="number-input-style"
          type="text"
          value={value}
          onChange={isCap ? handleCapInputChange : isHouseNumber ? handleHouseNumberChange : handleNumberInputChange}
          placeholder={placeholder}
        />
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  );
};

export default NumberInput;

