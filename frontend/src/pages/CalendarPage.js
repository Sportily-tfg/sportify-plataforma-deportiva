import React from 'react';
import CalendarActivities from '../components/CalendarActivities';
import '../styles/CalendarPage.css';

const CalendarPage = () => {
    return (
        <div className="calendar-page">
            <h1>Calendario de Actividades</h1>
            <CalendarActivities />
        </div>
    );
};

export default CalendarPage;