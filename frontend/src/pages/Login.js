import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="login-page">
            <Navbar />
            <section className="login-section">
                <h1 className="login-title">Sportify</h1>
                <h2 className="login-slogan">Login</h2>

                <div className="login-inputs">
                    <input type="email" placeholder="Correo electrónico" className="login-input"/>
                    <input type="password" placeholder="Contraseña" className="login-input"/>
                </div>

                <div className="login-buttons">
                    <PrimaryButton texto="Entrar"  lightText={true}/>
                    <SecondaryButton texto="Resgistro" onClick={() => navigate('/register')} lightText={true} />
                </div>
            </section>
        </div>
    );
};

export default Login;