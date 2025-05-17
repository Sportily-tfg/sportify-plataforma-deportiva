import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserPanel.css';
import PrimaryButton from '../components/buttons/PrimaryButton';

const UserPanel = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/users/${user.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
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

    const handleCancelReservation = async (id_reserva) => {

        if (!id_reserva) {
            alert('Error: ID de reserva no válido');
            return;
        }

        try {
            const response = await axios.delete(
                `https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/reservations/cancelar/${id_reserva}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setData((prev) => ({
                ...prev,
                reservas: prev.reservas.map((r) =>
                    r.id_reserva === id_reserva ? { ...r, estado: 'cancelada' } : r
                ),
            }));
        } catch (error) {
            alert('No se pudo cancelar la reserva');
        }
    };

    const handleDeleteReservation = async (id_reserva) => {
        if (!id_reserva) {
            alert('Error: ID no válido');
            return;
        }

        try {
            await axios.delete(
                `https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/reservations/admin/eliminar/${id_reserva}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setData((prev) => ({
                ...prev,
                reservas: prev.reservas.filter((r) => r.id_reserva !== id_reserva),
            }));
        } catch (error) {
            alert('No se pudo eliminar la reserva');
        }
    };

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
                    <p><strong>Puntos:</strong> {data?.usuario.puntos || 0}</p>
                </div>
            </section>

            <section className="reservations-section">
                <h3>Mis reservas</h3>
                {data?.reservas?.length > 0 ? (
                    data.reservas.map((reserva, index) => {
                        const reservationId = reserva.id_reserva || reserva.id || reserva.reserva_id || `temp-${index}`;

                        return (
                            <div key={reservationId} className="reservation-card">
                                <p><strong>Actividad:</strong> {reserva.nombre_actividad}</p>
                                <p><strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString()}</p>
                                <p><strong>Estado:</strong> {reserva.estado}</p>

                                {user.rol === 'admin' ? (
                                    <button
                                        className="danger"
                                        onClick={() => handleDeleteReservation(reservationId)}
                                    >
                                        Eliminar (Admin)
                                    </button>
                                ) : (
                                    reserva.estado !== 'cancelada' && (
                                        <PrimaryButton
                                            onClick={() => handleCancelReservation(reservationId)}
                                            texto="Cancelar reserva"
                                            className="cancel-button"
                                        />
                                    )
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No tienes reservas aún.</p>
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
