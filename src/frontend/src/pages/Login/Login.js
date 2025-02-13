import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.scss';
import GoogleLoginButton from "../../components/googleButton/googleLoginButton";

const Login = () => {
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

    return (
        <div className="login-container">
            <h2>Dieti Estates</h2>
            <h3>Sign In</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email"
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password"
                        required 
                    />
                </div>
                <button className="access-button" type="submit">Accedi</button>
                <p>Oppure</p>
                <GoogleLoginButton/>
            </form>
        </div>
    );
};

export default Login;
