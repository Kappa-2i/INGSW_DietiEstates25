import React from "react";
import "./InsertionCard.scss"; 
import { useNavigate } from "react-router-dom";

const InsertionCard = ({ insertion }) => {
  const navigate = useNavigate();

  // Se insertion.price esiste, rimuoviamo eventuali caratteri non numerici e formattiamo in Euro.
  let formattedPrice = "";
  if (insertion.price) {
    const prezzoNumber = parseFloat(insertion.price.replace(/[^0-9.-]+/g, ""));
    formattedPrice = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(prezzoNumber);
  }

  return (
    <div className="card" onClick={() => navigate(`/insertion/${insertion.id}`)}>
      <img src={insertion.image_url[0]} alt="Immagine" />
      <h3>{insertion.title}</h3>
      <p>
        {insertion.room || 1} {insertion.room > 1 ? "Camere" : "Camera"} | {insertion.bathroom || 1} {insertion.bathroom > 1 ? "Bagni" : "Bagno"} | {insertion.contract === "BUY" ? "In Vendita" : "In Affitto"}
      </p>
      <p className="price">{formattedPrice}</p>
    </div>
  );
};

export default InsertionCard;
