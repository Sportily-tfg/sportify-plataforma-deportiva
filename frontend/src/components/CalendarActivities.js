import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import PrimaryButton from '../components/buttons/PrimaryButton';
import '../styles/CalendarActivities.css';

const CalendarActivities = () => {
    const [date, setDate] = useState(new Date());
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener actividades de la API
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('/api/activities');
                if (!response.ok) {
                    throw new Error('Error al cargar actividades');
                }
                const data = await response.json();
                setActivities(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

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
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ activityId })
            });

            if (response.ok) {
                alert('Reserva realizada con éxito');
            } else {
                throw new Error('Error al realizar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al realizar la reserva');
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
                            <div key={activity.id_actividad} className="activity-item">
                                <h4>{activity.nombre_actividad}</h4>
                                <p><strong>Hora:</strong>{new Date(activity.fecha).toLocaleDateString([], { hour: '2-digit', minute: '2-digit'})}</p>
                                {activity.lugar && <p><strong>Lugar:</strong> {activity.lugar}</p>}
                                {activity.instructor && <p><strong>Instructor:</strong> {activity.instructor}</p>}
                                <PrimaryButton 
                                    texto="Reservar" 
                                    lightText={true}
                                    onClick={() => handleReserve(activity.id_actividad)} 
                                />
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