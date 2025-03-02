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
const NumberInput = ({ label, value, onChange, placeholder, unit, defaultStyle="primary" }) => {
    // Funzione per gestire il cambiamento dell'input
    const handleInputChange = (e) => {
        let input = e.target.value;
    
        // Rimuovi tutti i caratteri tranne i numeri, il punto e la virgola
        input = input.replace(/[^0-9,]/g, ""); // Rimuovi qualsiasi altro carattere tranne numeri e virgola
    
        // Dividi l'input in parte intera e decimale
        let [integer, decimal] = input.split(",");
    
        // Aggiungi separatori di migliaia (per esempio: 1.000.000)
        if (integer) {
            // Inserisci il punto ogni 3 cifre
            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    
        // Limita la parte decimale a 2 cifre, se esiste
        if (decimal) {
            decimal = decimal.slice(0, 2); // Limita a 2 decimali
        }
    
        // Combina la parte intera e decimale con la virgola
        let formattedValue = integer;
        if (decimal) {
            formattedValue += "," + decimal;
        }
    
        // Passa il valore formattato al callback onChange
        onChange(formattedValue);
    };
    
  
    return (
      <div className="input-container">
        {/* Se l'etichetta è presente, visualizzala */}
        {label && <label className="input-label">{label}</label>}
  
        <div className="input-wrapper number-style">
          {/* Campo di input numerico */}
          <input
            className={`number-input-style ${defaultStyle}`}
            type="text" // Usa tipo text per formattare e convalidare manualmente
            value={value}
            onChange={handleInputChange} // Usa onChange per aggiornare il valore
            placeholder={placeholder}
          />
          {/* Unità di misura (m², o altro se specificato) */}
          {unit && <span className="unit">{unit}</span>}
        </div>
      </div>
    );
  };
  
  

export default NumberInput;
