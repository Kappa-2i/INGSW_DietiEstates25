import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../elements/navbar/navbar";
import "./OfferInsertion.scss";

const OfferInsertion = () => {
  const { insertionId } = useParams();
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/offer/my/${insertionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Supponiamo che la risposta abbia questa struttura:
        // { success: true, receivedOffers: [...], sentOffers: [...] }
        if (response.data.success) {
          setReceivedOffers(response.data.receivedOffers);
          setSentOffers(response.data.sentOffers);
        }
      } catch (err) {
        console.error("Errore nel recupero delle offerte:", err);
        setError("Errore nel recupero delle offerte.");
      }
    };

    if (insertionId) {
      fetchOffers();
    }
  }, [insertionId, token]);

  return (
    <div className="offer-insertion-page">
      <Navbar />
      <h1>Offerte per l'inserzione {insertionId}</h1>
      {error && <p className="error">{error}</p>}
      <div className="offers-tables">
        <div className="offers-table received-offers">
          <h2>Offerte Ricevute</h2>
          <table>
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
              {receivedOffers.length > 0 ? (
                receivedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.first_name}</td>
                    <td>{offer.last_name}</td>
                    <td>{offer.price}</td>
                    <td>{new Date(offer.created_at).toLocaleDateString()}</td>
                    <td>{offer.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nessuna offerta ricevuta</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="offers-table sent-offers">
          <h2>Offerte Inviate</h2>
          <table>
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
              {sentOffers.length > 0 ? (
                sentOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.first_name}</td>
                    <td>{offer.last_name}</td>
                    <td>{offer.price}</td>
                    <td>{new Date(offer.created_at).toLocaleDateString()}</td>
                    <td>{offer.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nessuna offerta inviata</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfferInsertion;
