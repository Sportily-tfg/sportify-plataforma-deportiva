import React from 'react';
import Navbar from '../components/navbar/Navbar';
import SecondaryButton from '../components/buttons/SecondaryButton';
import PrimaryButton from '../components/buttons/PrimaryButton';
import '../styles/HomePage.css';

const HomePage = () => {
    return (
        <div className='home-page'>
            <Navbar/>
            <section className='hero-section'>

                <h1 className='hero-title'>Sportify</h1>

                <div className='hero-buttons'>
                    <PrimaryButton texto="Registrarse / Iniciar Sesión" />
                    <SecondaryButton texto="Explorar actividades"/>
                </div>
            </section>
        </div>
    );
};

export default HomePage;