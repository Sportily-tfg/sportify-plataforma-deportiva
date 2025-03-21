import React from 'react';
import CancelButton from '../components/buttons/CancelButton';
import SendButton from '../components/buttons/SendButton';
import '../styles/ContactForm.css';

const ContactForm = () => {
    return (
        <div className='contact-form'>
            <section className='form-section'>
                <h1 className='form-title'>Contacto</h1>

                <form className='form-fields'>
                    <input type='text' placeholder='Nombre' />
                    <input type='email' placeholder='Correo electrónico' />
                    <textarea placeholder='Mensaje'></textarea>
                </form>

                <div className='form-buttons'>
                    <SendButton texto = "Enviar" />
                    <CancelButton texto = "Cancelar" />
                </div>
            </section>
        </div>
    );
};

export default ContactForm;