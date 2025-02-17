import React, { useEffect, useState } from "react";
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Impostiamo il profilo; inizialmente impostiamo anche il nuovo numero di telefono
        setProfile(response.data.data);
        setNewPhone(response.data.data.phone);
      } catch (err) {
        console.error("Errore nel recupero delle informazioni dell'utente:", err);
        setError("Errore nel recupero dell'utente");
      }
    };

    getProfile();
  }, []);

  // Gestione del caricamento o dell'errore
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div>Caricamento...</div>;
  }

  // Handler per la sottomissione della modifica
  const handleModifySubmit = async (e) => {
    e.preventDefault();
    // Esempio: invia i dati aggiornati (telefono e password) al backend
    try {
      const token = localStorage.getItem("token");
      const payload = {
        phone: newPhone,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };
      console.log(payload);
      await axios.patch("http://localhost:8000/api/user/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profilo aggiornato con successo!");
      window.location.reload();
    } catch (err) {
      console.error("Errore nell'aggiornamento del profilo:", err);
      alert("Si è verificato un errore durante l'aggiornamento");
    }
  };

  return (
    <div className="user-details-card-wrapper">
      {/* Header con i pulsanti per passare da una sezione all'altra */}
      <div className="card-header">
        <button
          className={activeSection === "info" ? "active" : ""}
          onClick={() => setActiveSection("info")}
        >
          Informazioni
        </button>
        <button
          className={activeSection === "modify" ? "active" : ""}
          onClick={() => setActiveSection("modify")}
        >
          Modifica
        </button>
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

      {/* Sezione Modifica */}
      {activeSection === "modify" && (
        <div className="profile-info-section modify">
          <div className="section-title">Modifica Profilo</div>
          <form onSubmit={handleModifySubmit}>
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
            <Button label="Salva modifiche" type="submit" />
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDetailsCard;
