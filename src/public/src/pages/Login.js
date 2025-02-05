import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style/Login.css';

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
            navigate("/dashboard");
        } catch (err) {
            setError("Credenziali non valide");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Accedi</button>
            </form>
        </div>
    );
};

export default Login;
