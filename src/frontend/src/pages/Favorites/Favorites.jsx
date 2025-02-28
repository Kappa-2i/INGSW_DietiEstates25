import React, { useEffect, useState } from "react";
import axios from "axios";
import InsertionCard from "../../elements/insertionCard/InsertionCard";
import Navbar from "../../elements/navbar/navbar";
import ImageDisplay from "../../components/imageDisplay/imageDisplay";
import "./Favorites.scss";
import notFound from "../../assets/notfound.png";

const Favorites = () => {
  const [insertions, setInsertions] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchInsertions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/favorite", {
          headers: { Authorization: `Bearer ${token}` },
        });



        if (!Array.isArray(response.data.data) || response.data.data.length === 0) {
          console.error("Errore: la risposta API non è un array valido o è vuoto", response.data);
          return;
        }

        const insertionIds = response.data.data.map(fav => fav.insertionid);


        const insertionsData = await Promise.allSettled(
          insertionIds.map(async (id) => {
            try {

              const res = await axios.get(`http://localhost:8000/api/insertion/${id}`);
              return res.data; // res.data ha forma { success: true, data: { ... } }
            } catch (error) {
              console.error(`Errore nel recupero dell'inserzione ${id}:`, error);
              return null; // Evita di interrompere tutto il flusso
            }
          })
        );

        // Filtra solo i risultati andati a buon fine e mappa per ottenere solo la proprietà data
        const successfulInsertions = insertionsData
          .filter(result => result.status === "fulfilled" && result.value)
          .map(result => result.value.data); // Estrai solo l'oggetto inserzione



        if (successfulInsertions.length > 0) {
          setInsertions(successfulInsertions);
        } else {
          console.warn("Nessuna inserzione valida trovata.");
        }
      } catch (err) {
        console.error("Errore nel recupero delle inserzioni:", err);
        setError("Errore nel recupero delle inserzioni");
      }
    };

    fetchInsertions();
  }, []);
  
  useEffect(() => {
    
  }, [insertions]);

  return (
    <div className="favorites-wrapper">
      <div>
        <Navbar />
      </div>

      <div className="favorites-insertions">
        <h2>I Tuoi Preferiti</h2>
      </div>
      
      <div className="insertion-card-wrapper">
        {insertions.length > 0 ? (
          insertions
            .filter(insertion => insertion !== null && insertion !== undefined)
            .map((insertion) => (
              <InsertionCard 
                key={insertion.id} 
                insertion={insertion} 
              />
            ))
        ) : (
          <ImageDisplay 
            src={notFound} 
            alt="Not Found" 
            defaultStyle="notFound" 
          />
        )}
      </div> 
    </div>
  );
};

export default Favorites;
