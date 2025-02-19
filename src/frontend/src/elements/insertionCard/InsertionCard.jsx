import React from "react";
import "./InsertionCard.scss"; 
import { useNavigate } from "react-router-dom";

const InsertionCard = ({ insertion }) => {
    const navigate = useNavigate();
    return (
        <div className="card" onClick={() => navigate(`/insertion/${insertion.id}`)}>
            <img src={insertion.image_url[0]} alt="Immagine" />
            <h3>{insertion.title}</h3>
            <p> {insertion.room || 1} {insertion.room > 1 ? "Camere" : "Camera"} | {insertion.bathroom || 1} {insertion.bathroom > 1 ? "Bagni" : "Bagno"} | {insertion.contract === "BUY" ? "In Vendita" : "In Affitto"}</p>
            <p  className="price"> {insertion.price}</p>
        </div>
    );
};

export default InsertionCard;
