import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import LightboxDetalles from '../components/LightboxDetalles';
import '../styles/ActividadesPanel.css';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const ActividadesPanel = () => {
    const { user } = useAuth();
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [actividadesFiltradas, setActividadesFiltradas] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [categorias, setCategorias] = useState(['Todas']);

 useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener actividades
                const response = await fetch(`${API_URL}/api/activities`);
                if (!response.ok) throw new Error('Error al cargar actividades');
                const data = await response.json();
                setActividades(data);
                setActividadesFiltradas(data);

                // Extraer categorías únicas de las actividades
                const categoriasUnicas = ['Todas', ...new Set(data.map(a => a.categoria))];
                setCategorias(categoriasUnicas);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrar actividades cuando cambia la categoría seleccionada
    useEffect(() => {
        if (categoriaSeleccionada === 'Todas') {
            setActividadesFiltradas(actividades);
        } else {
            const filtradas = actividades.filter(actividad => 
                actividad.categoria === categoriaSeleccionada
            );
            setActividadesFiltradas(filtradas);
        }
    }, [categoriaSeleccionada, actividades]);

    if (loading) return <div className='actividades-page'>Cargando actividades...</div>;
    if (error) return <div className='actividades-page'>Error: {error}</div>;

    const handleReservar = async (id_actividad) => {
        if (!user) {
            alert('Debes iniciar sesión para reservar');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id_actividad })
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            alert('Reserva realizada con éxito');
        } catch (error) {
            console.error('Error al reservar:', error);
            alert(error.message);
        }
    }

    return (
        <div className='actividades-page'>
            <section className='actividades-section'>
            <div className="filtro-container">
                <h1 className='actividades-title'>Actividades Disponibles</h1>
                <div className="filtro-categoria">
                        <label>Filtrar por categoría:</label>
                        <select
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        >
                            {categorias.map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='actividades-list'>
                    {actividadesFiltradas.map((actividad) => (
                        <div className="actividad-card" key={actividad.id_actividad}>
                            <h2 className="actividad-nombre">{actividad.nombre_actividad}</h2>
                            <p className="actividad-descripcion">{actividad.descripcion}</p>
                            <p className="actividad-info">Dificultad: {actividad.nivel_dificultad}</p>
                            <p className="actividad-info">Máx. participantes: {actividad.max_participantes}</p>
                            <p className="actividad-info">Categoría: {actividad.categoria}</p>
                            <p className="actividad-info">Fecha: {new Date(actividad.fecha).toLocaleDateString('es-ES')}</p>
                            <p className="actividad-info">Hora: {actividad.horario}</p>
                            <p className="actividad-precio">Precio: {Number(actividad.precio).toFixed(2)} €</p>
                            <div className='actividad-buttons'>
                                <PrimaryButton texto="Reservar" lightText={true} className='reservar-btn' onClick={() => handleReservar(actividad.id_actividad)}/>
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