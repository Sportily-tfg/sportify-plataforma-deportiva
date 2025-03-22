import React, { useState } from 'react';
import PrimaryButton from '../components/buttons/PrimaryButton'; // Importa tu SendButton
import '../styles/ContactPage.css'; // Importa el archivo CSS
import Navbar from '../components/navbar/Navbar.js';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('Mensaje enviado con éxito');
  };

  return (
    <div className="contact-page">
      <Navbar />
      <div className="form-container">
        {/* Título "Contáctanos" */}
        <h1 className="form-title">Contáctanos</h1>
        {/* Subtítulo o descripción */}
        <p className="form-subtitle">
          ¿Tienes alguna pregunta o comentario? ¡Estamos aquí para ayudarte!
        </p>

        <form className="form" onSubmit={handleSubmit}>
          {/* Campo para Nombre y Apellidos */}
          <div className="form-group">
            <label htmlFor="name">Nombre y Apellidos</label>
            <input
              required
              name="name"
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Campo para Correo Electrónico */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              required
              name="email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Campo para el Mensaje */}
          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              required
              name="message"
              id="message"
              cols={50}
              rows={10}
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {/* Botón de Enviar */}
          <div className="form-submit">
            <PrimaryButton type="submit" texto="Enviar" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;