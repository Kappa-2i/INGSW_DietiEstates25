import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.scss';
import GoogleLoginButton from "../../components/googleButton/googleLoginButton";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import LoginForm from "../../elements/LoginForm/LoginForm";

const Login = () => {

    return (
        <div className="loginFrame-container">
            <LoginForm/>
        </div>
        
    );
};

export default Login;
