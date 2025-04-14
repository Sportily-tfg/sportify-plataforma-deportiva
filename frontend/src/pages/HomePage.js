import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import SecondaryButton from '../components/buttons/SecondaryButton';
import PrimaryButton from '../components/buttons/PrimaryButton';
import '../styles/HomePage.css';

const HomePage = () => {

    const navigate = useNavigate();
    return (
        <div className='home-page'>
            <Navbar/>
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