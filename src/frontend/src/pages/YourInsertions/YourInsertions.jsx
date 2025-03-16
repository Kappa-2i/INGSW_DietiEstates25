import React, { useEffect, useState } from "react";
import axios from "axios";


import Navbar from "../../elements/navbar/navbar";
import ImageDisplay from "../../components/imageDisplay/imageDisplay";
import notFound from "../../assets/notfound.png";

import "./YourInsertions.scss";
import InsertionCardOffer from "../../elements/InsertionCardOffer/InsertionCardOffer";


const YourInsertions = () => {
  const [insertions, setInsertions] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchInsertions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/insertion/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Insertions response:", response.data.data);
        setInsertions(response.data.data);
      } catch (err) {
        console.error("Errore nel recupero delle inserzioni:", err);
        setError("Errore nel recupero delle inserzioni");
      }
    };

    fetchInsertions();
  }, []);
  
  return (
    <div className="favorites-wrapper">
      <div>
        <Navbar />
      </div>

      <div className="favorites-insertions">
        <h2>Le Tue Inserzioni</h2>
      </div>
      
      <div className="insertion-card-wrapper">
        {insertions.length > 0 ? (
          insertions
            .filter(insertion => insertion !== null && insertion !== undefined)
            .map((insertion) => (
              <InsertionCardOffer 
                key={insertion.id} 
                insertion={insertion} 
              />
            ))
        ) : (
          <ImageDisplay 
            src={notFound} 
            alt="Not Found" 
            defaultStyle="cursor" 
          />
        )}
      </div> 
    </div>
  );
};

export default YourInsertions;
