import React from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryButton from '../components/buttons/SecondaryButton';
import PrimaryButton from '../components/buttons/PrimaryButton';
import '../styles/HomePage.css';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirigir si ya está autenticado
    if (user) {
        navigate('/about');
        return null;
    }

    return (
        <div className='home-page'>
            <section className='hero-section'>
                <h1 className='hero-title'>Sportify</h1>
                <h2 className='slogan'>Reserva, Entrena, Gana.</h2>
                <div className='hero-buttons'>
                    <PrimaryButton texto="Acceder" onClick={() => navigate('/login')} />
                    <SecondaryButton texto="Explorar" onClick={() => navigate('/about')}/>
                </div>
            </section>
        </div>
    );
};

export default HomePage;