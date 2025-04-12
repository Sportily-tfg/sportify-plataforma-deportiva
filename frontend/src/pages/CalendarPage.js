import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarPage.css';
import PrimaryButton from '../components/buttons/PrimaryButton';

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // datos de prueba
    const activities = [
        { 
          id: 1, 
          name: "Clase de Yoga", 
          date: new Date(2024, 5, 15), 
          time: "10:00 - 11:30",
          capacity: 10,
          instructor: "Ana López"
        },
        { 
          id: 2, 
          name: "Pádel", 
          date: new Date(2024, 5, 18), 
          time: "18:00 - 19:30",
          court: "Pista 3",
          partner: "Juan Pérez" 
        },
      ];

    // filtrar actividades para la fecha seleccionada
    const dailyActivities = activities.filter(
        activity => activity.date.toDateString() === selectedDate.toDateString()
    );

    return (
        <div className="calendar-page">
            <h1>Calendario de Actividades</h1>

            <div className="calendar-container">
                {/*Calendario interactivo*/}
                <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                locale="es-ES"
                className="custom-calendar"
                tileClassName={({ date }) =>
                    activities.some(a => a.date.toDateString() === date.toDateString())
                        ? 'has-activities' : null
                } 
                />

                {/* lista de actividades para la fecha seleccionada */}
                <div className="activities-list">
                    <h2>Actividades para el {selectedDate.toLocaleDateString('es-ES')}</h2>

                    {dailyActivities.length > 0 ? (
                        dailyActivities.map(activity =>(
                            <div key={activity.id} className="activity-card">
                <h3>{activity.name}</h3>
                <p><strong>Hora:</strong> {activity.time}</p>
                {activity.instructor && <p><strong>Instructor:</strong> {activity.instructor}</p>}
                {activity.court && <p><strong>Pista:</strong> {activity.court}</p>}
                <PrimaryButton 
                  texto="Cancelar" 
                  lightText={true}
                  onClick={() => console.log('Reservar:', activity.id)} 
                />
              </div>
            ))
          ) : (
            <p>No hay actividades programadas para este día.</p>
          )}
                </div>
            </div>
        </div>
    )
}

export default CalendarPage;