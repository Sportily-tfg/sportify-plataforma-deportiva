import React, { useState } from 'react';
import PrimaryButton from '../components/buttons/PrimaryButton'; // Importa tu SendButton
import '../styles/Login.css'; // Importa el archivo CSS
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
    <div className="login-page">
      <Navbar />
      <div className="login-section">
        {/* Título "Contáctanos" */}
        <h1 className="login-title">Contáctanos</h1>
        {/* Subtítulo o descripción */}
        <p className="login-slogan">
          ¿Tienes alguna pregunta o comentario? ¡Estamos aquí para ayudarte!
        </p>

        <form onSubmit={handleSubmit}>
          {/* Campo para Nombre y Apellidos */}
          <div className="login-inputs">
            <input
              required
              placeholder='Nombre y apellidos'
              name="name"
              id="name"
              type="text"
              className='login-input'
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Campo para Correo Electrónico */}
          <div className="login-inputs">
            <input
              required
              placeholder='Correo Electrónico'
              name="email"
              id="email"
              type="email"
              className='login-input'
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Campo para el Mensaje */}
          <div className="login-inputs">
            <textarea
              required
              placeholder='Mensaje'
              name="message"
              id="message"
              className='login-input'
              cols={50}
              rows={10}
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {/* Botón de Enviar */}
          <div style={{ marginTop: '1.5rem' }}>
            <PrimaryButton type="submit" texto="Enviar" lightText={ true }/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;