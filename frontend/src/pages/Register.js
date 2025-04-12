import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/navbar/Navbar";
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import '../styles/Login.css';

/**
 * Componente de registro con validación de formulario
 * y conexión al endpoint del backend
 */
const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contraseña: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar que las contraseñas coincidan
        if (formData.contraseña !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            // Enviar datos al backend
            await axios.post('http://localhost:5000/api/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                contraseña: formData.contraseña
            });
            
            // Redirigir al login después de registro exitoso
            navigate('/login');
            
        } catch (err) {
            // Mostrar error específico del backend o genérico
            setError(err.response?.data?.error || 'Error al registrar usuario');
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            <section className="login-section">
                <h1 className="login-title">Sportify</h1>
                <h2 className="login-slogan">Crea tu cuenta</h2>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="login-inputs">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            className="login-input"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            className="login-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="contraseña"
                            placeholder="Contraseña"
                            className="login-input"
                            value={formData.contraseña}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            className="login-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="login-buttons">
                        <PrimaryButton 
                            type="submit"
                            texto="Registrarse" 
                            lightText={true}
                        />
                        <SecondaryButton 
                            texto="Volver" 
                            onClick={() => navigate('/login')} 
                            lightText={true} 
                        />
                    </div>
                </form>
            </section>
        </div>
    );
};

export default Register;