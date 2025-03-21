import React from 'react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
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
                    <PrimaryButton>Enviar</PrimaryButton>
                    <SecondaryButton>Cancelar</SecondaryButton>
                </div>
            </section>
        </div>
    );
};

export default ContactForm;