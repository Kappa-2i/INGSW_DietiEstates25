import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './style/Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", formData);
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg; // Associa errori ai campi
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: "Errore durante la registrazione" });
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Registrati</h2>
      {success && <p className="success">{success}</p>}
      {errors.general && <p className="error">{errors.general}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="Nome"
          value={formData.first_name}
          onChange={handleChange}
        />
        {errors.first_name && <p className="error">{errors.first_name}</p>}

        <input
          type="text"
          name="last_name"
          placeholder="Cognome"
          value={formData.last_name}
          onChange={handleChange}
        />
        {errors.last_name && <p className="error">{errors.last_name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Telefono"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        

        <button type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
