import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import InsertionCard from '../../elements/insertionCard/InsertionCard';
import FilterComponent from '../../elements/FilterComponent/FilterComponent';

const ResultSearch = () => {
    const { activeSection, searchTerm} = useParams();
    const [ insertions, setInsertions ] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");  // Stato per il messaggio di errore

    const location = useLocation();
    // Recupera i filtri dallo state, se disponibili
    //const filters = location.state || {};



    
    useEffect(() => {
        const getFilteredInsertions = async () => {
          try {
            
            const filters = location.state || {
                contract: activeSection,
                municipality: searchTerm,
            };
            
            const response = await axios.post("http://localhost:8000/api/insertion/filtered", filters);
            setInsertions(response.data.data);
          } catch (err) {
            if (err.response && err.response.status === 404) {
              setErrorMessage("Nessuna inserzione trovata");
            } else {
              setErrorMessage("Errore durante il recupero delle inserzioni");
            }
          }
        };
    
        getFilteredInsertions();
      }, [activeSection, searchTerm, location.state]);

  return (
    <div>
      <h2>Risultati della ricerca</h2>
      {errorMessage ? (
          <p>{errorMessage}</p> 
      ) : (
          insertions.length > 0 ? (
              insertions.map((insertion) => (
                  <InsertionCard key={insertion.id} insertion={insertion} />
              ))
          ) : (
              <p>Caricamento...</p>
          )
      )}
      <div>
        <FilterComponent/>
      </div>
  </div>
  )
}

export default ResultSearch