import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import InsertionCard from '../../elements/insertionCard/InsertionCard';
import FilterComponent from '../../elements/FilterComponent/FilterComponent';
import './ResultSearch.scss'
import Navbar from "../../elements/navbar/navbar";
import ImageDisplay from '../../components/imageDisplay/imageDisplay';
import notFound from "../../assets/notfound.png";



const ResultSearch = () => {

    const { activeSection, searchTerm } = useParams();
    const location = useLocation();
    const initialFilters = location.state || {
      contract: activeSection,
      municipality: searchTerm,
    };

    const [ insertions, setInsertions ] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");  // Stato per il messaggio di errore

    const [filters] = useState(initialFilters);


    
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
            
              setErrorMessage("Errore durante il recupero delle inserzioni");
            
          }
        };
    
        getFilteredInsertions();
      }, [activeSection, searchTerm, location.state, filters]);

      return (
        <div className='resultSearch-wrap'>
          
          <Navbar/>
          <div className='filter-wrapper'>
            <FilterComponent initialFilters={filters}/>
          </div>
        

          <div className="insertions-container">
                {insertions.length > 0 ? (
                    insertions.map((insertion) => (
                        <InsertionCard key={insertion.id} insertion={insertion} />
                    ))
                ) : (
                    <ImageDisplay src={notFound}
                                    alt='Not Found' 
                                    defaultStyle='cursor' />
                )}
            </div>
        </div>
      );
}

export default ResultSearch