import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './RegisterForm.scss'
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";

const RegisterForm = () => {
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
          const response = await axios.post(`http://localhost:8000/api/auth/register`, formData);
          setSuccess(response.data.message);
          setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
          if (error.response && error.response.data.errors) {
            const backendErrors = {};
            error.response.data.errors.forEach((err) => {
              backendErrors[err.path] = err.msg; // Associa errori ai campi
            });
            setErrors(backendErrors);
          } else if (error.response && error.response.data.message === "Utente già registrato. Riprova!"){
            setErrors({ general: "Utente già registrato. Riprova!" });
          } else {
            setErrors({ general: "Errore durante la registrazione" });
          }
        }
      };
    
    
      const signIn = () => {
        navigate("/login");
      };
    
      return (
        <div className="register-container">
          <h2>Dieti Estates</h2>
          <h3>Sign Up</h3>
          {success && <p className="success">{success}</p>}
          {errors.general && <p className="errors">{errors.general}</p>}
    
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                defaultStyle="login"
                type="text"
                name="first_name"
                placeholder="Nome"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <p className="errors">{errors.first_name}</p>}
            </div>
    
            <div className="form-group">
              <Input
                defaultStyle="login"
                type="text"
                name="last_name"
                placeholder="Cognome"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <p className="errors">{errors.last_name}</p>}
            </div>
    
            <div className="form-group">
              <Input
                defaultStyle="login"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="errors">{errors.email}</p>}
            </div>
    
            <div className="form-group">
              <Input
                defaultStyle="login"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="errors">{errors.password}</p>}
            </div>
    
            <div className="form-group">
              <Input
                defaultStyle="login"
                type="text"
                name="phone"
                placeholder="Telefono"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="errors">{errors.phone}</p>}
            </div>
            <Button label="Registrati" defaultStyle="login" type="submit"/>
          </form>
          <p className="register-text">Hai già un account? <span onClick={signIn} className="register-link">Accedi</span></p>
        </div>
      );
}

export default RegisterForm
