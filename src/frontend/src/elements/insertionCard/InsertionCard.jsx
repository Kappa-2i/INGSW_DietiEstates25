import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InsertionCard.scss"; 
import { useNavigate } from "react-router-dom";
import ImageDisplay from "../../components/imageDisplay/imageDisplay";
import favoritesIcon from '../../assets/star.svg';
import favoritesFilledIcon from '../../assets/star-fill.svg'

const InsertionCard = ({ insertion }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem("token");

  // Se insertion.price esiste, rimuoviamo eventuali caratteri non numerici e formattiamo in Euro.
  let formattedPrice = "";
  if (insertion.price) {
    const prezzoNumber = parseFloat(insertion.price.replace(/[^0-9.-]+/g, ""));
    formattedPrice = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(prezzoNumber);
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/insertion/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Controlla se l'inserzione corrente è nei preferiti
        const favorites = response.data.data || [];
        setIsFavorite(favorites.some(fav => fav.id === insertion.id));
      } catch (error) {
        console.error("Errore nel recupero dei preferiti:", error);
      }
    };

    if (token) {
      fetchFavorites();
    }
  }, [insertion.id, token]);

  const handleFavorites = async (event) => {
    event.stopPropagation(); // Evita la propagazione del click alla card
  
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8000/api/insertion/favorites/${insertion.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Rimosso dai preferiti!");

      } else {
        await axios.post(`http://localhost:8000/api/insertion/favorites/${insertion.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Aggiunto ai preferiti!");
      }

      // Cambia lo stato dopo la richiesta
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Errore nell'aggiornamento dei preferiti:", error);
      alert("Errore nell'aggiornamento dei preferiti!");
    }
  };

  return (
    <div className="card" onClick={() => navigate(`/insertion/${insertion.id}`)}>
      <img src={insertion.image_url[0]} alt="Immagine" />
      <h3>{insertion.title}</h3>
      <div className='favorites-wrapper'>
          <ImageDisplay
            src={isFavorite ? favoritesFilledIcon : favoritesIcon}
            alt='Preferiti'
            defaultStyle='cursor'
            onClick={(e) => handleFavorites(e)}
          />
      </div>
      <p>
        {insertion.room || 1} {insertion.room > 1 ? "Camere" : "Camera"} | {insertion.bathroom || 1} {insertion.bathroom > 1 ? "Bagni" : "Bagno"} | {insertion.contract === "BUY" ? "In Vendita" : "In Affitto"}
      </p>
      <p className="price">{formattedPrice}</p>
    </div>
  );
};

export default InsertionCard;
