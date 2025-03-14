import React, { useState } from "react";
import axios from "axios";

import Input from "../../components/input/Input";
import NumberInput from "../../components/NumberInput/NumberInput";
import Button from "../../components/button/Button";

import "./CreateManualOffer.scss";

const CreateManualOffer = ({ insertionId }) => {
  
  
  // Stati per i campi del form e per la visibilità del form
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [offer, setOffer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmitManualOffer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token mancante. Effettua il login.");
      return;
    }
    if (!insertionId) {
      setError("Insertion ID mancante.");
      return;
    }
    const payload = {
      insertionId,  // Assicurati che il backend si aspetti 'insertionId'
      price: offer.replace('.', ''),
      first_name: firstName,
      last_name: lastName,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/offer/manualCreation",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        window.location.reload();
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error("Errore nella creazione dell'offerta manuale:", err);
      setMessage("Errore nella creazione dell'offerta manuale.");
    }
  };

  return (
    <div className="create-manual-offer">
      <Button 
        onClick={toggleForm} 
        defaultStyle="login" 
        label={showForm ? "Nascondi Form" : "Aggiungi Offerta Manuale"} 
      />
      {showForm && (
        <div className="manual-offer-form">
          <h2>Aggiungi Offerta Manuale</h2>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmitManualOffer}>
            <div className="form-group">
              <Input
                defaultStyle="login"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nome"
                required
              />
            </div>
            <div className="form-group">
              <Input
                defaultStyle="login"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Cognome"
                required
              />
            </div>
            <div className="form-group">
              <NumberInput
                label="Prezzo proposto"
                value={offer}
                onChange={setOffer}
                placeholder="Inserisci il prezzo dell'offerta"
                defaultStyle="offer"
              />
            </div>
            <Button 
              label="Aggiungi Offerta" 
              defaultStyle="login" 
              type="submit" 
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateManualOffer;
