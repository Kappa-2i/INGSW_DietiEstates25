import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import InsertionCard from '../../elements/insertionCard/InsertionCard';

const ResultSearch = () => {
    const { activeSection, searchTerm} = useParams();
    const [ insertions, setInsertions ] = useState([]);

    const location = useLocation();
    // Recupera i filtri dallo state, se disponibili
    const filters = location.state || {};



    
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
            console.log("Errore");
          }
        };
    
        getFilteredInsertions();
      }, [activeSection, searchTerm, location.state]);

  return (
    <div>ResultSearch
        {insertions.length > 0 ? (
                    insertions.map((insertion) => (
                        <InsertionCard key={insertion.id} insertion={insertion} />
                    ))
                ) : (
                    <p>Caricamento...</p>
                )}
    </div>
  )
}

export default ResultSearch