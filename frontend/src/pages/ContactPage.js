import React, { useState } from 'react';
import ContactForm from '../components/contact/ContactForm';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitStatus({ success: true, message: 'Mensaje enviado con éxito' });
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Error al enviar el mensaje' });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Error de conexión con el servidor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="form-wrapper">
        <h1 className="form-title">Contáctanos</h1>
        <p className="form-subtitle">
          ¿Tienes alguna pregunta o comentario? ¡Estamos aquí para ayudarte!
        </p>

        {submitStatus && (
          <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-error'}`}>
            {submitStatus.message}
          </div>
        )}

        <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default ContactPage;