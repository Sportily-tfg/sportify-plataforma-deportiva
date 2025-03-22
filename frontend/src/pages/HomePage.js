import React from 'react';
import Navbar from '../components/navbar/Navbar';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import '../styles/HomePage.css';

const HomePage = () => {
    return (
        <div className='home-page'>
            <Navbar/>
            <section className='hero-section'>

                <h1 className='hero-title'>Sportify</h1>

                <div className='hero-buttons'>
                    <PrimaryButton>Registrarse / Iniciar Sesión</PrimaryButton>
                    <SecondaryButton>Explorar actividades</SecondaryButton>
                </div>
            </section>
        </div>
    );
};

export default HomePage;