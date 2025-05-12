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
                const response = await axios.get(`https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                console.log('Datos COMPLETOS recibidos del servidor:', response.data);
                console.log('Estructura de una reserva:', response.data.reservas[0]); // Debug adicional
                
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

    const handleCancelReservation = async (reservaId) => {
        try {
            console.log('[handleCancelReservation] ID recibido:', reservaId);
            
            if (reservaId === undefined || reservaId === null) {
                console.error('Error: ID es null/undefined');
                alert('Error interno: no se pudo identificar la reserva');
                return;
            }

            // Si el ID es temporal (comienza con 'temp-'), no intentar cancelar
            if (typeof reservaId === 'string' && reservaId.startsWith('temp-')) {
                alert('Esta reserva no puede ser cancelada (ID temporal)');
                return;
            }

            const id = Number(reservaId);
            if (isNaN(id)) {
                console.error('Error: ID no es número', reservaId);
                alert('ID de reserva no válido');
                return;
            }

            console.log('Cancelando reserva ID:', id);
            
            const response = await axios.put(
                `https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/reservations/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Respuesta del servidor:', response.data);

            setData(prev => {
                if (!prev?.reservas) return prev;
                
                return {
                    ...prev,
                    reservas: prev.reservas.map(r => {
                        const currentId = r.id || r.id_reserva || r.reserva_id;
                        return (currentId === id) ? { ...r, estado: 'cancelada' } : r;
                    })
                };
            });

        } catch (error) {
            console.error('Error en cancelación:', {
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });
            
            alert(error.response?.data?.error || 
                 error.message || 
                 'Error al cancelar reserva');
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
                        // Obtener ID de todas las posibles propiedades
                        const reservationId = reserva.id || reserva.id_reserva || reserva.reserva_id || `temp-${index}`;
                        
                        // Si no hay ID válido, mostrar mensaje de debug
                        if (!reserva.id && !reserva.id_reserva && !reserva.reserva_id) {
                            console.warn('Reserva sin ID estándar:', reserva);
                        }

                        return (
                            <div key={reservationId} className="reservation-card">
                                <p><strong>Actividad:</strong> {reserva.nombre_actividad || 'Nombre no disponible'}</p>
                                <p><strong>Fecha:</strong> {reserva.fecha_reserva ? new Date(reserva.fecha_reserva).toLocaleDateString() : 'Fecha no disponible'}</p>
                                <p><strong>Estado:</strong> {reserva.estado || 'Estado no disponible'}</p>
                                
                                {reserva.estado === 'pendiente' && (
                                    <PrimaryButton 
                                        onClick={() => handleCancelReservation(reservationId)}
                                        className="cancel-button"
                                        texto="Cancelar reserva"
                                        $lightText={true}  // Usando prop transitoria
                                    />
                                )}
                            </div>
                        );
                    })
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