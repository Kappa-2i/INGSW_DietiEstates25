import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import ImageDisplay from "../../components/imageDisplay/imageDisplay";
import MySVG from "../../assets/person.svg";
import "./userDetailsCard.scss";

const UserDetailsCard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("info");

  // Stati per la sezione "Modifica"
  const [newPhone, setNewPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token mancante. Effettua il login.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Imposta il profilo e, se necessario, potresti anche preimpostare il nuovo numero
        setProfile(response.data.data);
      } catch (err) {
        console.error("Errore nel recupero delle informazioni dell'utente:", err);
        setError("Errore nel recupero dell'utente");
      }
    };

    getProfile();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="loading">Caricamento...</div>;
  }

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        phone: newPhone,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };
      await axios.patch("http://localhost:8000/api/user/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profilo aggiornato con successo!");
      window.location.reload();
    } catch (err) {
      console.error("Errore nell'aggiornamento del profilo:", err);
      let errorMessage = "Si è verificato un errore durante l'aggiornamento";
      if (err.response && err.response.data && err.response.data.errors) {
        errorMessage = err.response.data.errors.map((error) => error.msg).join("\n");
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="user-details-card-wrapper">
      {/* Header con i pulsanti per passare da una sezione all'altra */}
      <div className="card-header">
        <Button
          defaultStyle="active-style"
          label="Informazioni"
          onClick={() => setActiveSection("info")}
          active={activeSection === "info"}
        />
        {/* Mostra il pulsante "Modifica" solo se il ruolo consente la modifica */}
        {!(profile.role === "AGENT" || profile.role === "MANAGER") && (
          <Button
            defaultStyle="active-style"
            label="Modifica"
            onClick={() => setActiveSection("modify")}
            active={activeSection === "modify"}
          />
        )}
      </div>

      {/* Sezione Informazioni */}
      {activeSection === "info" && (
        <div className="profile-info-section">
          <ImageDisplay src={MySVG} alt="Immagine utente" />
          <div className="section-title">Informazioni Profilo</div>
          <Input label="Nome" placeholder={profile.first_name} disabled />
          <Input label="Cognome" placeholder={profile.last_name} disabled />
          <Input label="Telefono" type="tel" placeholder={profile.phone} disabled />
          <Input label="Email" type="email" placeholder={profile.email} disabled />
        </div>
      )}

      {/* Sezione Modifica, resa visibile solo se il ruolo consente la modifica */}
      {activeSection === "modify" && !(profile.role === "AGENT" || profile.role === "MANAGER") && (
        <div className="profile-info-section">
          <div className="section-title">Modifica Profilo</div>
          <form onSubmit={handleModifySubmit}>
            <div className="modify-section">
              <Input
                label="Nuovo numero di telefono"
                type="tel"
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <Input
                label="Password attuale"
                type="password"
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Input
                label="Nuova password"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button label="Salva modifiche" type="submit" defaultStyle="search-style" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDetailsCard;
