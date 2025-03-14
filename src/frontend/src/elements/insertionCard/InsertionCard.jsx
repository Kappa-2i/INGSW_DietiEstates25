import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageDisplay from "../../components/imageDisplay/imageDisplay";
import favoritesIcon from "../../assets/heart.svg";
import favoritesFilledIcon from "../../assets/heart-fill.svg";
import "./InsertionCard.scss";

const InsertionCard = ({ insertion }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isFavorite, setIsFavorite] = useState(false);

  // Formatta il prezzo in Euro
  let formattedPrice = "";
  if (insertion.price) {
    const prezzoNumber = parseFloat(insertion.price.replace(/[^0-9.-]+/g, ""));
    formattedPrice = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(prezzoNumber);
  }

  // Controlla che l'immagine sia disponibile, altrimenti usa un fallback
  const imageSrc =
    insertion.image_url && insertion.image_url.length > 0
      ? insertion.image_url[0]
      : "https://via.placeholder.com/250x150?text=No+Image";

  // Troncamento del titolo se supera i 60 caratteri
  const truncatedTitle =
    insertion.title.length > 60
      ? insertion.title.substring(0, 60) + "..."
      : insertion.title;

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
    if (!token) {
      alert("Per aggiungere ai preferiti devi effettuare il login o registrarti.");
      return;
    }
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
      <div className="card-image">
        <img src={imageSrc} alt="Immagine" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{truncatedTitle}</h3>
        <p className="card-info">
          {insertion.room || 1} {insertion.room > 1 ? "Camere" : "Camera"} | {insertion.bathroom || 1} {insertion.bathroom > 1 ? "Bagni" : "Bagno"} | {insertion.contract === "BUY" ? "In Vendita" : "In Affitto"}
          <br />
          <span>{insertion.province} - {insertion.municipality} - {insertion.surface} mq</span>
        </p>
      </div>
      <div className="card-footer">
        <div className="price-wrapper">
          <p className="price">{formattedPrice}</p>
          <div className="favorites-wrapper-card" onClick={(e) => handleFavorites(e)}>
            <ImageDisplay
              src={isFavorite ? favoritesFilledIcon : favoritesIcon}
              alt="Preferiti"
              defaultStyle="cursor"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertionCard;
