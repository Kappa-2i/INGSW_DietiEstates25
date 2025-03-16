import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import InsertionCard from '../../elements/insertionCard/InsertionCard';
import FilterComponent from '../../elements/FilterComponent/FilterComponent';
import './ResultSearch.scss'
import Navbar from "../../elements/navbar/navbar";
import NoResultsFound from '../../elements/NoResultFound/NoResultFound';
import ImageDisplay from '../../components/imageDisplay/imageDisplay';



const ResultSearch = () => {

    const { activeSection, searchTerm } = useParams();
    const location = useLocation();
    const initialFilters = location.state || {
      contract: activeSection,
      province: searchTerm,
    };

    const [ insertions, setInsertions ] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");  // Stato per il messaggio di errore
    const [loading, setLoading] = useState(true);
    const [filters] = useState(initialFilters);


    
    useEffect(() => {
        const getFilteredInsertions = async () => {
          try {
            
            const filters = location.state || {
                contract: activeSection,
                municipality: searchTerm,
            };
            
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/insertion/filtered`, filters);
	    console.log("Result Search:", response.data.data);
            setInsertions(response.data.data);
          } catch (err) {
              setErrorMessage("Errore durante il recupero delle inserzioni");
          }
          finally {
            setTimeout(() => setLoading(false), 500);
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
                {loading ? (
                    <div className="notFound-container">
                    <ImageDisplay  
                      defaultStyle="cursor" 
                    />
                  </div>
                ) : insertions.length > 0 ? (
                    insertions.map((insertion) => (
                        <InsertionCard key={insertion.id} insertion={insertion} />
                    ))
                ) : (
                    <NoResultsFound/>
                )}
            </div>
        </div>
      );
}

export default ResultSearch
