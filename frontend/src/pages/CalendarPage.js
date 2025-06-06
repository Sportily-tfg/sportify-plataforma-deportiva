import React, { useEffect, useState } from 'react';
import CalendarActivities from '../components/CalendarActivities';
import '../styles/CalendarPage.css';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const CalendarPage = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [activities, setActivities] = useState([]);

useEffect(() => {
    const token = localStorage.getItem('token');

    if (!user || !token) {
        console.log('Esperando a que user y token estén disponibles');
        return; // No ejecutar fetch aún
    }

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/api/reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            setReservations(data);
        } catch (err) {
            console.error("Error fetching reservations:", err);
        }

        try {
            const actRes = await fetch(`${API_URL}/api/activities`);
            const actData = await actRes.json();
            setActivities(actData);
        } catch (err) {
            console.error("Error fetching activities:", err);
        }
    };

    fetchData();
}, [user]);

    //Función que determina si una actividad está reservada
    const isReserved = (activityId) => {
        return reservations.some(r => r.id_actividad === activityId);
    };
 
    return (
        <div className="calendar-page">
            <h1>Calendario de Actividades</h1>
            <CalendarActivities 
                activities={activities}
                isReserved={isReserved}/>
        </div>
    );
};

export default CalendarPage;