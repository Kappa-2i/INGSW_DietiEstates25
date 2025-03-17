import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/button/Button';
import './InsertionSummary.scss';

const InsertionSummary = ({ title, price, agentId, province, municipality, insertionId }) => {
  const [agentName, setAgentName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem("token");

  let formattedPrice = "";
  if (price) {
    const prezzoNumber = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    formattedPrice = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(prezzoNumber);
  }

  // Recupera il nome dell'agente
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${agentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { first_name, last_name } = response.data.data;
        setAgentName(`${first_name} ${last_name}`);
      } catch (error) {
        console.error("Errore nel recupero dei dati dell'agente:", error);
      }
    };

    if (agentId) {
      fetchAgentData();
    }
  }, [agentId, token]);

  // Gestione del bottone preferiti
  const handleFavorites = async (event) => {
    event.stopPropagation();
    if (!token) {
      alert("Per aggiungere ai preferiti devi effettuare il login o registrarti.");
      return;
    }
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8000/api/favorite/${insertionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Rimosso dai preferiti!");
      } else {
        await axios.post(`http://localhost:8000/api/favorite/${insertionId}`, {}, {
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
    <div className="insertion-summary">
      <h1 className="insertion-title">{title}</h1>
      <p className="insertion-location">{province} - {municipality}</p>
      <p className="insertion-price">{formattedPrice}</p>
      <div className="agent-row">
        <p className="insertion-agent">Inserzionista: {agentName}</p>
        <Button 
          label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          onClick={handleFavorites}
          defaultStyle="login"
        />
      </div>
    </div>
  );
};

export default InsertionSummary;
