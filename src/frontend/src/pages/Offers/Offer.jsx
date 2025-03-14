import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../elements/navbar/navbar";

import ImageDisplay from "../../components/imageDisplay/imageDisplay";

import notFound from "../../assets/notfound.png";

import "./Offer.scss";
import InsertionCardOffer from "../../elements/InsertionCardOffer/InsertionCardOffer";

const Offer = () => {
  const [insertions, setInsertions] = useState([]);
  const [error, setError] = useState(null);

  


  useEffect(() => {
    const fetchInsertions = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:8000/api/offer/my/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response.data.data);
          setInsertions(response.data.data);

        } catch (err) {
          console.error("Errore nel recupero delle inserzioni:", err);
          setError("Errore nel recupero di inserzioni con offerte.");
        }
    }; fetchInsertions();
  }, []);

  return (
    <div className="offers-wrapper">
      <div>
        <Navbar />
      </div>

      <div className="offers-insertions">
        <h2>Le Tue Offerte</h2>
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
  )
}

export default Offer