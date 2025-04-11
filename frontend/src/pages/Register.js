import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import Login from "./Login";
import '../styles/Login.css'; 

const Register = () => {
    const navigate = useNavigate();
    return (
        <div className="login-page"> {/* Mantén la misma clase para coherencia visual */}
            <Navbar />
            <section className="login-section">
                <h1 className="login-title">Sportify</h1>
                <h2 className="login-slogan">Crea tu cuenta</h2>

                <div className="login-inputs">
                    <input type="text" placeholder="Nombre completo" className="login-input"/>
                    <input type="email" placeholder="Correo electrónico" className="login-input"/>
                    <input type="password" placeholder="Contraseña" className="login-input"/>
                    <input type="password" placeholder="Confirmar contraseña" className="login-input"/>
                </div>

                <div className="login-buttons">
                    <PrimaryButton texto="Registrarse" lightText={true} />
                    <SecondaryButton texto="Volver"  onClick={() => navigate('/login')} lightText={true} />
                </div>
            </section>
        </div>
    );
};

export default Register;