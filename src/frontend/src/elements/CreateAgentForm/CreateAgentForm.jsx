import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Input from "../../components/input/Input";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Button from "../../components/button/Button";

import "./CreateAgentForm.scss";

const CreateAgentForm = ({ userRole }) => {
  const navigate = useNavigate();
  
  // Stato dei campi del form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(userRole); // Se ADMIN, verrà modificabile
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone,
      // Se l'utente è ADMIN, usa il ruolo selezionato; altrimenti, forza "AGENT"
      role: userRole === "ADMIN" ? role : "AGENT",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token mancante. Effettua il login.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/user/myagent/creation",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        navigate("/your-agent");
      } else {
        setMessage("Errore durante la creazione dell'agente.");
      }
    } catch (err) {
      console.error("Errore nella creazione dell'agente:", err);
      setMessage("Errore nella creazione dell'agente.");
    }
  };

  return (
    <div className="create-agent-form">
      <h2>Crea Agente</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
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
          <Input
            defaultStyle="login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <Input
            defaultStyle="login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="form-group">
          <Input
            defaultStyle="login"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefono"
            required
          />
        </div>
        <div className="select-group">
          {userRole === "ADMIN" && (
            <div className="form-group">
              <CustomSelect
                label="Ruolo"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                defaultStyle="dropdown"
                className="select"
              >
                {["AGENT", "MANAGER"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CustomSelect>
            </div>
          )}
        </div>
        <Button label="Crea Agente" defaultStyle="login" type="submit" />
      </form>
    </div>
  );
};

export default CreateAgentForm;
