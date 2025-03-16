import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../elements/navbar/navbar";
import Button from "../../components/button/Button";
import CreateManualOffer from "../../elements/ CreateManualOffer/CreateManualOffer";
import "./OfferInsertion.scss";

const OfferInsertion = () => {
  const { insertionId } = useParams();
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [counterOfferDetails, setCounterOfferDetails] = useState({}); // mappa: offer.id -> dettagli offerta originale
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Funzione per formattare il prezzo
  const formattedPrice = (price) => {
    if (price) {
      const prezzoNumber = parseFloat(price.replace(/[^0-9.-]+/g, ""));
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(prezzoNumber);
    }
    return "";
  };

  // Funzioni per gestire le azioni sulle offerte ricevute
  const handleAcceptOffer = async (offerId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/offer/my/${offerId}/accepted`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setReceivedOffers(receivedOffers.filter((offer) => offer.id !== offerId));
    } catch (err) {
      console.error("Errore accettazione offerta:", err);
      alert("Errore nell'accettare l'offerta.");
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/offer/my/${offerId}/rejected`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setReceivedOffers(receivedOffers.filter((offer) => offer.id !== offerId));
    } catch (err) {
      console.error("Errore rifiuto offerta:", err);
      alert("Errore nel rifiutare l'offerta.");
    }
  };

  const handleCounterOffer = async (offerId) => {
    const newPrice = prompt("Inserisci il nuovo prezzo per la controfferta:");
    if (!newPrice) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/offer/my/${offerId}/counteroffer`,
        { price: newPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setReceivedOffers(receivedOffers.filter((offer) => offer.id !== offerId));
    } catch (err) {
      console.error("Errore durante la controfferta:", err);
      alert("Errore nel fare la controfferta.");
    }
  };

  // Funzione per recuperare i dettagli dell'offerta originale di una controfferta
  const fetchCounterOfferDetails = async (offerId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/offer/my/${offerId}/counteroffer/details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Res parent:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Errore nel recupero dei dettagli della controfferta", error);
      return null;
    }
  };

  // useEffect per recuperare le offerte dal backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/offer/my/${insertionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  // useEffect per recuperare i dettagli delle controfferte nelle offerte inviate
  useEffect(() => {
    const fetchDetailsForSentOffers = async () => {
      const detailsMap = {};
      for (let offer of sentOffers) {
        if (offer.parent_offer_id) {
          const details = await fetchCounterOfferDetails(offer.id);
          detailsMap[offer.id] = details;
        }
      }
      setCounterOfferDetails(detailsMap);
    };

    if (sentOffers.length > 0) {
      fetchDetailsForSentOffers();
    }
  }, [sentOffers]);

  const acceptedOfferExists =
    receivedOffers.some((offer) => offer.status === "ACCEPTED") ||
    sentOffers.some((offer) => offer.status === "ACCEPTED");

  return (
    <div className="offer-insertion-page">
      <Navbar />
      <h1>Offerte per l'inserzione {insertionId}</h1>
      {error && <p className="error">{error}</p>}
      {/* Se non esiste un'offerta ACCEPTED, mostra il form per creare un'offerta manuale */}
      {!acceptedOfferExists && <CreateManualOffer insertionId={insertionId} />}
      <div className="offers-tables">
        {/* Tabella Offerte Ricevute */}
        <div className="table-container received-offers">
          <h2>Offerte Ricevute</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Offerta Proposta</th>
                <th>Data</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {receivedOffers.length > 0 ? (
                receivedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.first_name}</td>
                    <td>{offer.last_name}</td>
                    <td>{formattedPrice(offer.price)}</td>
                    <td>{new Date(offer.created_at).toLocaleDateString()}</td>
                    <td>{offer.status}</td>
                    <td>
                      {["WAIT", "COUNTEROFFER"].includes(offer.status) && (
                        <>
                          <Button onClick={() => handleAcceptOffer(offer.id)} label="Accetta" defaultStyle="accept" />
                          <Button onClick={() => handleRejectOffer(offer.id)} label="Rifiuta" defaultStyle="reject" />
                          <Button onClick={() => handleCounterOffer(offer.id)} label="Controfferta" defaultStyle="counteroffer" />
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Nessuna offerta ricevuta</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tabella Offerte Inviate */}
        <div className="table-container sent-offers">
          <h2>Offerte Inviate</h2>
          <table>
            <thead>
              <tr>
                <th>Offerta proposta</th>
                <th>Data</th>
                <th>Stato</th>
                <th>Nome Offerta Originale</th>
                <th>Cognome Offerta Originale</th>
                <th>Prezzo Offerta Originale</th>
              </tr>
            </thead>
            <tbody>
              {sentOffers.length > 0 ? (
                sentOffers.map((offer) => {
                  const details = offer.parent_offer_id
                    ? counterOfferDetails[offer.id]
                    : null;
                  return (
                    <tr key={offer.id}>
                      <td>{formattedPrice(offer.price)}</td>
                      <td>{new Date(offer.created_at).toLocaleDateString()}</td>
                      <td>{offer.status}</td>
                      {offer.parent_offer_id && details ? (
                        <>
                          <td>{details.original_first_name}</td>
                          <td>{details.original_last_name}</td>
                          <td>{formattedPrice(details.original_price)}</td>
                        </>
                      ) : (
                        <td colSpan="3">N/D</td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">Nessuna offerta inviata</td>
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
