import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import LightboxDetalles from '../components/LightboxDetalles';
import '../styles/ActividadesPanel.css';

const ActividadesPanel = () => {
    const [actividades, setActividades] = useState([]);
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar actividades al montar el componente
    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const response = await fetch('/api/activities');
                if (!response.ok) {
                    throw new Error('Error al cargar actividades');
                }
                const data = await response.json();
                setActividades(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActividades();
    }, []);

    if (loading) return <div className='actividades-page'>Cargando actividades...</div>;
    if (error) return <div className='actividades-page'>Error: {error}</div>;

    return (
        <div className='actividades-page'>
            <section className='actividades-section'>
                <h1 className='actividades-title'>Actividades Disponibles</h1>
                <div className='actividades-list'>
                    {actividades.map((actividad) => (
                        <div className="actividad-card" key={actividad.id_actividad}>
                            <h2 className="actividad-nombre">{actividad.nombre_actividad}</h2>
                            <p className="actividad-descripcion">{actividad.descripcion}</p>
                            <p className="actividad-info">Dificultad: {actividad.nivel_dificultad}</p>
                            <p className="actividad-info">Máx. participantes: {actividad.max_participantes}</p>
                            <p className="actividad-info">Fecha: {new Date(actividad.fecha).toLocaleDateString('es-ES')}</p>
                            <p className="actividad-info">Hora: {actividad.horario}</p>
                            <p className="actividad-precio">Precio: {Number(actividad.precio).toFixed(2)} €</p>
                            <div className='actividad-buttons'>
                                <PrimaryButton texto="Reservar" lightText={true} className='reservar-btn' />
                                <SecondaryButton 
                                    texto="Detalles" 
                                    lightText={true} 
                                    onClick={() => setActividadSeleccionada(actividad)} 
                                />
                            </div>
                        </div>                    
                    ))}
                </div>
            </section>

            {actividadSeleccionada && (
                <LightboxDetalles 
                    actividad={actividadSeleccionada} 
                    onClose={() => setActividadSeleccionada(null)} 
                />
            )}
        </div>
    );
};

export default ActividadesPanel;