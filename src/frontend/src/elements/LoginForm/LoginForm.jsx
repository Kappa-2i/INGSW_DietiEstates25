import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import GoogleLoginButton from "../../components/googleButton/googleLoginButton";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";

import './LoginForm.scss';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Per reindirizzare dopo il login

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/auth/login", {
                email,
                password,
            });

            // Salva il token nel localStorage
            localStorage.setItem("token", response.data.token);
            
            // Reindirizza alla home o a una dashboard
            navigate("/");
        } catch (err) {
            setError("Credenziali non valide");
        }
    };

    const signUp = () => {
        navigate("/register");
    };

    return (
        <div className="login-container">
            <h2>Dieti Estates</h2>
            <h3>Sign In</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
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
                <Button label="Accedi" defaultStyle="login" type="submit"/>
            </form>
            <p>Oppure</p>
            <GoogleLoginButton/>
            <p className="register-text">Non hai un account? <span onClick={signUp} className="register-link">Registrati</span></p>
        </div>
    );
}

export default LoginForm