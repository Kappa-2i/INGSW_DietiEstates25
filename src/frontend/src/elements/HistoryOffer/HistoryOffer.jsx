import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistoryOffer.scss";
import Button from "../../components/button/Button";
import NumberInput from "../../components/NumberInput/NumberInput";

const HistoryOffer = ({ insertionId }) => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);
  const [newOffer, setNewOffer] = useState("");
  const token = localStorage.getItem("token");

  // Funzione helper per censurare un nome: la prima lettera seguita da 4 asterischi
  const censorName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + "****";
  };

  // Mappatura per lo status
  const statusMapping = {
    WAIT: "In attesa",
    COUNTEROFFER: "Controfferta",
    REJECTED: "Rifiutata",
    ACCEPTED: "Accettata",
  };

  // Funzione helper per formattare il prezzo
  const formatPrice = (price) => {
    if (!price) return "";
    const prezzoNumber = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(prezzoNumber);
  };

  useEffect(() => {
    const fetchOffersHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/offer/history/${insertionId}`
        );
        // Supponiamo che la risposta sia direttamente un array di offerte
        setOffers(response.data.data);
      } catch (err) {
        console.error("Errore nel recupero della cronologia delle offerte:", err);
        setError("");
      }
    };

    if (insertionId) {
      fetchOffersHistory();
    }
  }, [insertionId]);

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Devi effettuare il login per proporre un'offerta.");
      return;
    }
    try {
      const payload = { price: newOffer.replace('.', '') };
      const response = await axios.post(
        `http://localhost:8000/api/offer/creation/${insertionId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message || "Offerta proposta con successo!");
      setNewOffer("");
      window.location.reload(); // Aggiorna le offerte
    } catch (err) {
      console.error("Errore nel proporre l'offerta:", err);
      alert("Errore nel proporre l'offerta!");
    }
  };

  // Se esiste almeno un'offerta con status ACCEPTED, non mostrare il form
  const acceptedOfferExists = offers.some((offer) => offer.status === "ACCEPTED");

  return (
    <div className="history-offer-container">
      <h3>Cronologia Offerte</h3>
      {error && <p className="error">{error}</p>}
      <div className="history-offer-table-wrapper">
        <table className="history-offer-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Offerta Proposta</th>
              <th>Data</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer.id}>
                  <td>{censorName(offer.first_name)}</td>
                  <td>{censorName(offer.last_name)}</td>
                  <td>{formatPrice(offer.price)}</td>
                  <td>{new Date(offer.created_at).toLocaleDateString()}</td>
                  <td>{statusMapping[offer.status] || offer.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nessuna offerta trovata</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!acceptedOfferExists && (
        <div className="offer-proposal">
          <h4>Proponi un'offerta</h4>
          <form onSubmit={handleOfferSubmit} className="offer-form">
            <NumberInput
              value={newOffer}
              onChange={setNewOffer}
              placeholder="Inserisci il prezzo dell'offerta"
              defaultStyle="offer"
            />
            <Button defaultStyle="offer" label="Proponi Offerta" type="submit" />
          </form>
        </div>
      )}
    </div>
  );
};

export default HistoryOffer;
