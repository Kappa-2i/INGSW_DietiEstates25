import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InsertionCard.scss"; 
import { useNavigate } from "react-router-dom";
import ImageDisplay from "../../components/imageDisplay/imageDisplay";
import favoritesIcon from '../../assets/heart.svg';
import favoritesFilledIcon from '../../assets/heart-fill.svg';

const InsertionCard = ({ insertion }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem("token");

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
        const response = await axios.get("http://localhost:8000/api/favorite", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favorites = response.data.data || [];
        setIsFavorite(favorites.some(fav => fav.insertionid === insertion.id));
      } catch (error) {
        console.error("Errore nel recupero dei preferiti:", error);
      }
    };

    if (token) {
      fetchFavorites();
    }
  }, [insertion.id, token]);

  const handleFavorites = async (event) => {
    event.stopPropagation();
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8000/api/favorite/${insertion.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Rimosso dai preferiti!");
      } else {
        await axios.post(`http://localhost:8000/api/favorite/${insertion.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Aggiunto ai preferiti!");
      }
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
      <p>
        {insertion.room || 1} {insertion.room > 1 ? "Camere" : "Camera"} | {insertion.bathroom || 1} {insertion.bathroom > 1 ? "Bagni" : "Bagno"} | {insertion.contract === "BUY" ? "In Vendita" : "In Affitto"}
      </p>
      <div className="price-wrapper">
        <p className="price">{formattedPrice}</p>
        <div className="favorites-wrapper-card" onClick={(e) => handleFavorites(e)}>
          <ImageDisplay
            src={isFavorite ? favoritesFilledIcon : favoritesIcon}
            alt='Preferiti'
            defaultStyle='cursor'
          />
        </div>
      </div>
    </div>
  );
};

export default InsertionCard;
