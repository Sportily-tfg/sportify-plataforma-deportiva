import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirigir si ya está autenticado
  if (user) {
    navigate('/about');
  }

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("Al menos una mayúscula");
    if (!/[a-z]/.test(password)) errors.push("Al menos una minúscula");
    if (!/[0-9]/.test(password)) errors.push("Al menos un número");
    setPasswordErrors(errors);
    const isValid = errors.length === 0;
    setIsPasswordValid(isValid);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "contraseña") {
      validatePassword(value);
    }

    if (error && name === "confirmPassword" && value === formData.contraseña) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!isPasswordValid) {
      setError("La contraseña no cumple los requisitos");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        nombre: formData.nombre,
        email: formData.email,
        contraseña: formData.contraseña,
      });

      if (response.status === 201) {
        navigate("/login", { state: { registrationSuccess: true } });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error al registrar usuario"
      );
    }
  };

  return (
    <div className="login-page">
      <section className="login-section">
        <h1 className="login-title">Sportify</h1>
        <h2 className="login-slogan">Crea tu cuenta</h2>

        {error && <div className="error-message">{error}</div>}

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
              className={`login-input ${
                passwordErrors.length > 0 && formData.contraseña
                  ? "error"
                  : isPasswordValid
                  ? "valid"
                  : ""
              }`}
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
            {passwordErrors.length > 0 && (
              <ul className="password-errors">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              className={`login-input ${
                error.includes("coinciden") ? "error" : ""
              }`}
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
              disabled={!isPasswordValid}
            />
            <SecondaryButton
              texto="Volver"
              onClick={() => navigate("/login")}
              lightText={true}
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;