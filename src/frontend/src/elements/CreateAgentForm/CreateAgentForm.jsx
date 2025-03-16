import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

import Input from "../../components/input/Input";
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
  const [role, setRole] = useState("AGENT");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  // Opzioni per la select (solo per ADMIN)
  const roles = [
    { value: "AGENT", label: "Agente" },
    { value: "MANAGER", label: "Manager" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      phone: phone,
      role: role,
    };
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token mancante. Effettua il login.");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/myagent/creation`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        navigate("/your-agents");
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error("Errore nella creazione dell'agente:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Mappa l'array di errori per creare un messaggio unificato
        const errorMessages = err.response.data.errors.map((error) => error.msg).join("\n");
        setMessage(errorMessages);
      } else {
        setMessage("Errore nella creazione dell'agente.");
      }
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
        {userRole === "ADMIN" && (
          <div className="form-group">
            <Select
              options={roles}
              value={roles.find(option => option.value === role) || null}
              onChange={(selectedOption) => setRole(selectedOption.value)}
              placeholder="Seleziona Ruolo"
              className="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "#ccc",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#aaa" },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          </div>
        )}
        <Button label="Crea Agente" defaultStyle="login" type="submit" />
      </form>
    </div>
  );
};

export default CreateAgentForm;
