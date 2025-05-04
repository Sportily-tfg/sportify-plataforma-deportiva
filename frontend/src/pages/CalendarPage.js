import React, { useEffect, useState } from 'react';
import CalendarActivities from '../components/CalendarActivities';
import '../styles/CalendarPage.css';
import { useAuth } from '../context/AuthContext';

const CalendarPage = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const res = await fetch('/api/reservations', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                setReservations(data);
            }

            const actRes = await fetch('/api/activities');
            const actData = await actRes.json();
            setActivities(actData);
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