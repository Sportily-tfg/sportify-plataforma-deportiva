import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import LightboxDetalles from '../components/LightboxDetalles';
import '../styles/ActividadesPanel.css';

const actividadesMock = [
    {
        id_actividad: 1,
        nombre_actividad: "Fútbol 7",
        descripcion: "Partido amistoso en campo de césped artificial.",
        descripcion_larga: "Partidos amistosos semanales en nuestro campo de césped artificial de última generación. Ideal para mejorar tu técnica y hacer equipo. Se incluye árbitro y balones oficiales.",
        nivel_dificultad: "Intermedio",
        max_participantes: 14,
        precio: 5.00
    },
    {
        id_actividad: 2,
        nombre_actividad: "Yoga al aire libre",
        descripcion: "Sesión de yoga para todos los niveles.",
        descripcion_larga: "Partidos amistosos semanales en nuestro campo de césped artificial de última generación. Ideal para mejorar tu técnica y hacer equipo. Se incluye árbitro y balones oficiales.",
        nivel_dificultad: "Bajo",
        max_participantes: 20,
        precio: 3.50
    },
    {
        id_actividad: 3,
        nombre_actividad: "Clases de pádel",
        descripcion: "Entrenamiento técnico con partidos de práctica.",
        descripcion_larga: "Partidos amistosos semanales en nuestro campo de césped artificial de última generación. Ideal para mejorar tu técnica y hacer equipo. Se incluye árbitro y balones oficiales.",
        nivel_dificultad: "Avanzado",
        max_participantes: 8,
        precio: 6.75
    }
];


const ActividadesPanel = () => {
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

    return (
        <div className='actividades-page'>
            <Navbar />
            <section className='actividades-section'>
                <h1 className='actividades-title'>Actividades Disponibles</h1>
                <div className='actividades-list'>
                    {actividadesMock.map((actividad) => (
                        <div className="actividad-card" key={actividad.id_actividad}>
                        <h2 className="actividad-nombre">{actividad.nombre_actividad}</h2>
                        <p className="actividad-descripcion">{actividad.descripcion}</p>
                        <p className="actividad-info">Dificultad: {actividad.nivel_dificultad}</p>
                        <p className="actividad-info">Máx. participantes: {actividad.max_participantes}</p>
                        <p className="actividad-precio">Precio: {actividad.precio.toFixed(2)} €</p>
                        <div className='actividad-buttons'>
                            <PrimaryButton texto="Reservar" lightText={true} className='reservar-btn' />
                            <SecondaryButton texto="Detalles" lightText={true} onClick={() => setActividadSeleccionada(actividad)} />
                        </div>
                    </div>                    
                    ))}
                </div>
            </section>

            {actividadSeleccionada && (
                <LightboxDetalles actividad={actividadSeleccionada} onClose={() => setActividadSeleccionada(null)} />
            )}
        </div>
    );
};

export default ActividadesPanel;
