import React, { useState } from "react";
import ContactForm from "../components/contact/ContactForm";
import "../styles/ContactPage.css";
import FAQCard from "../components/FAQCard";
import styled from "styled-components";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const faqs = [
    {
      question: "¿Cómo cancelo una reserva?",
      answer: "Puedes cancelar desde tu perfil en la sección 'Mis Reservas'.",
      label: "¿Cómo cancelo una reserva?",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos tarjetas de crédito/débito y PayPal.",
      label: "¿Qué métodos de pago aceptan?",
    },
    {
      question: "¿Puedo modificar una reserva?",
      answer: "Sí, puedes modificarla hasta 24 horas antes.",
      label: "¿Puedo modificar una reserva?",
    },
    {
      question: "¿Hay reembolsos?",
      answer: "Sí, según nuestras políticas de cancelación.",
      label: "¿Hay reembolsos?",
    },
  ];

const handleSubmit = async (formData) => {
  setIsSubmitting(true);
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    const success = response.ok;

    setSubmitStatus({
      success,
      message: success
        ? "Mensaje enviado con éxito"
        : data.error || "Error al enviar el mensaje",
    });

    return { success }; 
  } catch (error) {
    setSubmitStatus({
      success: false,
      message: "Error de conexión con el servidor",
    });
    return { success: false }; 
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="contact-page">
      <div className="form-wrapper">
        <FAQSection>
          <h1 className="form-title">Preguntas Frecuentes</h1>
          <FAQGrid>
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                question={faq.question}
                answer={faq.answer}
                label={faq.label}
              />
            ))}
          </FAQGrid>
        </FAQSection>
        <h1 className="form-title">Contáctanos</h1>
        <p className="form-subtitle">
          ¿Tienes alguna pregunta o comentario? ¡Estamos aquí para ayudarte!
        </p>

        {submitStatus && (
          <div
            className={`alert ${
              submitStatus.success ? "alert-success" : "alert-error"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

const FAQSection = styled.section`
  margin: 3rem 0;
  width: %;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin: 2rem 0;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;


export default ContactPage;
