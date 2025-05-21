import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import '../styles/CalendarActivities.css';

const CalendarActivities = () => {
    const [date, setDate] = useState(new Date());
    const [activities, setActivities] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Obtener actividades y reservas
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Obtener actividades
                const activitiesResponse = await fetch('sportify-plataforma-deportiva-production-7eec.up.railway.app/api/activities');
                if (!activitiesResponse.ok) throw new Error('Error al cargar actividades');
                const activitiesData = await activitiesResponse.json();
                const parsedActivities = activitiesData.map((act) => ({
                    ...act,
                    fecha: act.fecha ? new Date(act.fecha) : null
                }));
                setActivities(parsedActivities);


                // Obtener reservas del usuario si está logueado
                if (user) {
                    const reservationsResponse = await fetch('sportify-plataforma-deportiva-production-7eec.up.railway.app/api/reservations', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (reservationsResponse.ok) {
                        const reservationsData = await reservationsResponse.json();
                        setReservations(reservationsData);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Formatear fecha para comparación
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Verificar si una fecha tiene actividades
    const hasActivities = (date) => {
        return activities.some(activity => 
            formatDate(new Date(activity.fecha)) === formatDate(date)
        );
    };

    // Verificar si una actividad está reservada
    const isReserved = (activityId) => {
        return reservations.some(reservation => 
            reservation.id_actividad === activityId
        );
    };

    // Obtener actividades para la fecha seleccionada
    useEffect(() => {
        if (activities.length > 0) {
            const filtered = activities.filter(activity => 
                formatDate(new Date(activity.fecha)) === formatDate(date)
            );
            setSelectedActivities(filtered);
        }
    }, [date, activities]);

    // Función para manejar reservas
    const handleReserve = async (activityId) => {
        if (!user) {
            alert('Debes iniciar sesión para reservar');
            return;
        }

        try {
            const response = await fetch('sportify-plataforma-deportiva-production-7eec.up.railway.app/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id_actividad: activityId })
            });

            if (response.ok) {
                const newReservation = await response.json();
                setReservations([...reservations, newReservation]);
                alert('Reserva realizada con éxito');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al realizar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    if (loading) return <div className="loading">Cargando calendario...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <Calendar
                    onChange={setDate}
                    value={date}
                    locale="es-ES"
                    tileContent={({ date, view }) => 
                        view === 'month' && hasActivities(date) && (
                            <div className="activity-dot"></div>
                        )
                    }
                />
                
                <div className="activities-list">
                    <h3>Actividades para {date.toLocaleDateString('es-ES')}</h3>
                    {selectedActivities.length > 0 ? (
                        selectedActivities.map(activity => (
                            <div 
                                key={activity.id_actividad} 
                                className={`activity-item ${isReserved(activity.id_actividad) ? 'reserved' : ''}`}
                            >
                                <h4>{activity.nombre_actividad}</h4>
                                <p><strong>Hora:</strong> {activity.horario}</p>
                                <p><strong>Dificultad:</strong> {activity.nivel_dificultad}</p>
                                <p><strong>Precio:</strong> {activity.precio}€</p>
                                {!isReserved(activity.id_actividad) ? (
                                    <PrimaryButton 
                                        texto="Reservar" 
                                        lightText={true}
                                        onClick={() => handleReserve(activity.id_actividad)} 
                                    />
                                ) : (<p></p>)}
                            </div>
                        ))
                    ) : (
                        <p>No hay actividades programadas para este día</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarActivities;