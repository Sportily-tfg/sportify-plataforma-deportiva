import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import "../styles/CalendarActivities.css";
import ModalPersonalizado from "../components/modal/ModalPersonalizado";

const API_URL = process.env.REACT_APP_API_URL;

const CalendarActivities = () => {
  const [date, setDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [modalReserva, setModalReserva] = useState({
    abierto: false,
    mensaje: "",
    tipo: "info",
  });

  // Función para verificar si una actividad ya ha pasado
  const actividadHaPasado = (fecha, hora) => {
    const ahora = new Date();
    const [horas, minutos] = hora.split(":").map(Number);
    const fechaActividad = new Date(fecha);
    fechaActividad.setHours(horas, minutos, 0, 0);

    return fechaActividad < ahora;
  };

  // Obtener actividades y reservas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener actividades
        const activitiesResponse = await fetch(`${API_URL}/api/activities`);
        if (!activitiesResponse.ok)
          throw new Error("Error al cargar actividades");
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);

        // Obtener reservas del usuario si está logueado
        if (user) {
          const reservationsResponse = await fetch(
            `${API_URL}/api/reservations`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
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
    return date.toISOString().split("T")[0];
  };

  // Verificar si una fecha tiene actividades
  const hasActivities = (date) => {
    return activities.some(
      (activity) => formatDate(new Date(activity.fecha)) === formatDate(date)
    );
  };

  // Verificar si una actividad está reservada
  const isReserved = (activityId) => {
    return reservations.some(
      (reservation) => reservation.id_actividad === activityId
    );
  };

  // Obtener actividades para la fecha seleccionada
  useEffect(() => {
    if (activities.length > 0) {
      const filtered = activities.filter(
        (activity) => formatDate(new Date(activity.fecha)) === formatDate(date)
      );
      setSelectedActivities(filtered);
    }
  }, [date, activities]);

  // Función para manejar reservas
  const handleReserve = async (activityId) => {
    if (!user) {
      setModalReserva({
        abierto: true,
        mensaje: "Debes iniciar sesión para reservar.",
        tipo: "warning",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id_actividad: activityId }),
      });

      if (response.ok) {
        const newReservation = await response.json();
        setReservations([...reservations, newReservation]);
        setModalReserva({
          abierto: true,
          mensaje: "Reserva realizada con éxito.",
          tipo: "success",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al realizar la reserva");
      }
    } catch (error) {
      console.error("Error:", error);
      setModalReserva({
        abierto: true,
        mensaje: error.message,
        tipo: "danger",
      });
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
            view === "month" &&
            hasActivities(date) && <div className="activity-dot"></div>
          }
        />

        <div className="activities-list">
          <h3>Actividades para {date.toLocaleDateString("es-ES")}</h3>
          {selectedActivities.length > 0 ? (
            selectedActivities.map((activity) => (
              <div
                key={activity.id_actividad}
                className={`activity-item ${
                  isReserved(activity.id_actividad) ? "reserved" : ""
                }`}
              >
                <h4>{activity.nombre_actividad}</h4>
                <p>
                  <strong>Hora:</strong> {activity.horario}
                </p>
                <p>
                  <strong>Dificultad:</strong> {activity.nivel_dificultad}
                </p>
                <p>
                  <strong>Precio:</strong> {activity.precio}€
                </p>
                {actividadHaPasado(activity.fecha, activity.horario) ? (
                  <p className="activity-finished">Actividad Finalizada</p>
                ) : !isReserved(activity.id_actividad) ? (
                  <PrimaryButton
                    texto="Reservar"
                    lightText={true}
                    onClick={() => handleReserve(activity.id_actividad)}
                  />
                ) : (
                  <p></p>
                )}
              </div>
            ))
          ) : (
            <p>No hay actividades programadas para este día</p>
          )}
        </div>
      </div>
      <ModalPersonalizado
        isOpen={modalReserva.abierto}
        onClose={() => setModalReserva({ ...modalReserva, abierto: false })}
        title={
          modalReserva.tipo === "success"
            ? "Reserva confirmada"
            : modalReserva.tipo === "warning"
            ? "Atención"
            : "Error"
        }
        type={modalReserva.tipo}
        cancelText="Cerrar"
      >
        <p>{modalReserva.mensaje}</p>
      </ModalPersonalizado>
    </div>
  );
};

export default CalendarActivities;