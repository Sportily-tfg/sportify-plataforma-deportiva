import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    contraseña: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = response.data;
      
      login(user, token);
      // Redirección basada en el rol
      if (user.rol === 'admin') {
        window.location.href = '/admin'; // Redirige al panel de admin
      } else {
        window.location.href = '/about'; // Redirige a about para usuarios normales
      }
    } catch (err) {
      if (err.response?.data?.details) {
        setError(err.response.data.error + ": " + err.response.data.details.join(', '));
      } else {
        setError(err.response?.data?.error || 'Credenciales inválidas');
      }
    }
  };

  return (
    <div className="login-page">
      <section className="login-section">
        <h1 className="login-title">Sportify</h1>
        <h2 className="login-slogan">Inicia sesión</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-inputs">
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
              required
            />
          </div>

          <div className="login-buttons">
            <PrimaryButton type="submit" texto="Entrar" lightText={true} />
            <SecondaryButton
              texto="Registrarse"
              onClick={() => navigate("/register")}
              lightText={true}
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;