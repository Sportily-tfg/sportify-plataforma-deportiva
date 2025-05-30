import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalPersonalizado from '../components/modal/ModalPersonalizado';
import '../styles/Tienda.css';

const API_URL = process.env.REACT_APP_API_URL;

const Tienda = () => {
  const [recompensas, setRecompensas] = useState([]);
  const [puntosUsuario, setPuntosUsuario] = useState(0);

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
  const [modalOnConfirm, setModalOnConfirm] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
          console.error('No hay token o usuario almacenado');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [resRecompensas, resUsuario] = await Promise.all([
          axios.get(`${API_URL}/api/recompensas`, config),
          axios.get(`${API_URL}/api/users/${user.id}`, config)
        ]);

        setRecompensas(resRecompensas.data);
        setPuntosUsuario(resUsuario.data.usuario.puntos);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalOnConfirm(null);
  };

  const handleCanjear = (id_recompensa, puntos_requeridos) => {
    if (puntosUsuario < puntos_requeridos) {
      setModalTitle('Puntos insuficientes');
      setModalMessage('No tienes suficientes puntos para canjear esta recompensa.');
      setModalType('error');
      setModalOpen(true);
      return;
    }

    // Confirmación antes de canjear
    setModalTitle('Confirmar canje');
    setModalMessage(`¿Quieres canjear esta recompensa por ${puntos_requeridos} puntos?`);
    setModalType('info');
    setModalOnConfirm(() => async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setModalTitle('No autenticado');
          setModalMessage('Debes iniciar sesión para canjear recompensas.');
          setModalType('error');
          setModalOnConfirm(null);
          return;
        }

        await axios.post(
          `${API_URL}/api/recompensas/canjear`,
          { id_recompensa },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setModalTitle('Canje exitoso');
        setModalMessage('¡Recompensa canjeada con éxito!');
        setModalType('success');
        setModalOnConfirm(null);

        // Actualizar puntos localmente sin recargar
        setPuntosUsuario(prev => prev - puntos_requeridos);
      } catch (error) {
        setModalTitle('Error al canjear');
        setModalMessage(error.response?.data?.error || 'Ha ocurrido un error al canjear la recompensa.');
        setModalType('error');
        setModalOnConfirm(null);
      }
    });
    setModalOpen(true);
  };

  return (
    <div className="tienda-container">
      <h2>Tienda de Recompensas</h2>
      <p>Tus puntos: <strong>{puntosUsuario}</strong></p>

      <div className="recompensas-grid">
        {recompensas.map((recompensa) => (
          <div key={recompensa.id_recompensa} className="recompensa-card">
            <img src={recompensa.imagen_url} alt={recompensa.nombre} />
            <h3>{recompensa.nombre}</h3>
            <p>{recompensa.descripcion}</p>
            <p>Puntos requeridos: {recompensa.puntos_requeridos}</p>
            <button 
              onClick={() => handleCanjear(recompensa.id_recompensa, recompensa.puntos_requeridos)}
              disabled={puntosUsuario < recompensa.puntos_requeridos}
            >
              Canjear
            </button>
          </div>
        ))}
      </div>

      <ModalPersonalizado
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onConfirm={modalOnConfirm}
        confirmText="Sí"
        cancelText="No"
      />
    </div>
  );
};

export default Tienda;
