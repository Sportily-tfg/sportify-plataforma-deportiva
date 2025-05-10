import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserPanel.css';

const UserPanel = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error al cargar datos');
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (user && !data) {
            fetchData();
        } else if (!user) {
            navigate('/login');
        }
    }, [navigate, user, data]); 

    if (loading) return <div className="user-panel">Cargando...</div>;
    if (error) return <div className="user-panel error-message">{error}</div>;

    return (
        <div className="user-panel">
            <section className="profile-section">
                <h2>Mi perfil</h2>
                <div className="avatar-placeholder"></div>

                <div className="user-info">
                    <p><strong>Nombre:</strong> {data?.usuario.nombre}</p>
                    <p><strong>Email:</strong> {data?.usuario.email}</p>
                    <p><strong>Miembro desde:</strong> {new Date(data?.usuario.fecha_registro).toLocaleDateString()}</p>
                    <p><strong>Puntos:</strong> {data?.usuario.puntos}</p>
                </div>
            </section>

            <section className="reservations-section">
                <h3>Mis reservas</h3>
                {data?.reservas?.length > 0 ? (
                    data.reservas.map((reserva) => (
                        <div key={reserva.id_reserva} className="reservation-card">
                            <p><strong>ID:</strong> {reserva.id_reserva} (Tipo: {typeof reserva.id_reserva})</p>
                            <p><strong>Actividad:</strong> {reserva.nombre_actividad}</p>
                            <p><strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString()}</p>
                            <p><strong>Estado:</strong> {reserva.estado}</p>
                            
                            {reserva.estado === 'pendiente'}
                        </div>
                    ))
                ) : (
                    <p>No tienes reservas</p>
                )}
            </section>

            <section className="rewards-section">
                <h3>Recompensas</h3>
                {data?.recompensas?.length > 0 ? (
                    data.recompensas.map((recompensa, index) => (
                        <div key={index} className="reward-card">
                            <p><strong>{recompensa.nombre_recompensa}</strong></p>
                            <p>Canjeado: {new Date(recompensa.fecha_canje).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No has canjeado recompensas</p>
                )}
            </section>
        </div>
    );
};

export default UserPanel;