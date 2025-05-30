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

  // Estados para canje con envío
  const [esEnvio, setEsEnvio] = useState(false);
  const [direccionEnvio, setDireccionEnvio] = useState({
    calle: '',
    puerta: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    pais: ''
  });
  const [confirmarEnvio, setConfirmarEnvio] = useState(false);

  // Guarda datos del canje actual para usar en confirmación
  const [idRecompensaActual, setIdRecompensaActual] = useState(null);
  const [puntosRequeridosActual, setPuntosRequeridosActual] = useState(0);

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
    setConfirmarEnvio(false);
    setEsEnvio(false);
    setDireccionEnvio({
      calle: '',
      puerta: '',
      codigoPostal: '',
      ciudad: '',
      provincia: '',
      pais: ''
    });
  };

  const handleCanjear = (recompensa) => {
    if (puntosUsuario < recompensa.puntos_requeridos) {
      setModalTitle('Puntos insuficientes');
      setModalMessage('No tienes suficientes puntos para canjear esta recompensa.');
      setModalType('error');
      setModalOpen(true);
      return;
    }

    setIdRecompensaActual(recompensa.id_recompensa);
    setPuntosRequeridosActual(recompensa.puntos_requeridos);

    if (recompensa.tipo === 'envio') {
      // Abrimos modal para pedir dirección
      setEsEnvio(true);
      setModalTitle('Dirección de envío');
      setModalMessage('');
      setModalType('info');
      setConfirmarEnvio(false);
      setModalOpen(true);
    } else {
      // Canje instantáneo, solo confirmación
      setEsEnvio(false);
      setModalTitle('Confirmar canje');
      setModalMessage(`¿Quieres canjear esta recompensa por ${recompensa.puntos_requeridos} puntos?`);
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
            { id_recompensa: recompensa.id_recompensa },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setModalTitle('Canje exitoso');
          setModalMessage('¡Recompensa canjeada con éxito!');
          setModalType('success');
          setModalOnConfirm(null);

          setPuntosUsuario(prev => prev - recompensa.puntos_requeridos);
        } catch (error) {
          setModalTitle('Error al canjear');
          setModalMessage(error.response?.data?.error || 'Ha ocurrido un error al canjear la recompensa.');
          setModalType('error');
          setModalOnConfirm(null);
        }
      });
      setModalOpen(true);
    }
  };

  const handleEnviarDireccion = () => {
    const { calle, codigoPostal, ciudad, pais } = direccionEnvio;
    if (!calle.trim() || !codigoPostal.trim() || !ciudad.trim() || !pais.trim()) {
      alert('Por favor, completa todos los campos obligatorios: Calle, Código Postal, Ciudad y País.');
      return;
    }
    // Pasamos a confirmación con dirección
    setConfirmarEnvio(true);
    setModalTitle('Confirmar canje');
    setModalMessage(`¿Quieres canjear esta recompensa por ${puntosRequeridosActual} puntos?`);
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
          { id_recompensa: idRecompensaActual, direccion_envio: direccionEnvio },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setModalTitle('Canje exitoso');
        setModalMessage('¡Recompensa canjeada con éxito!');
        setModalType('success');
        setModalOnConfirm(null);
        setConfirmarEnvio(false);
        setEsEnvio(false);

        setPuntosUsuario(prev => prev - puntosRequeridosActual);
      } catch (error) {
        setModalTitle('Error al canjear');
        setModalMessage(error.response?.data?.error || 'Ha ocurrido un error al canjear la recompensa.');
        setModalType('error');
        setModalOnConfirm(null);
        setConfirmarEnvio(false);
        setEsEnvio(false);
      }
    });
  };

  // Botón cancelar o cerrar modal resetea todo
  const handleCancelarModal = () => {
    setModalOpen(false);
    setModalOnConfirm(null);
    setConfirmarEnvio(false);
    setEsEnvio(false);
    setDireccionEnvio({
      calle: '',
      puerta: '',
      codigoPostal: '',
      ciudad: '',
      provincia: '',
      pais: ''
    });
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
              onClick={() => handleCanjear(recompensa)}
              disabled={puntosUsuario < recompensa.puntos_requeridos}
            >
              Canjear
            </button>
          </div>
        ))}
      </div>

      <ModalPersonalizado
        isOpen={modalOpen}
        onClose={handleCancelarModal}
        title={modalTitle}
        message={!esEnvio || confirmarEnvio ? modalMessage : null}
        type={modalType}
        onConfirm={confirmarEnvio ? modalOnConfirm : esEnvio ? handleEnviarDireccion : modalOnConfirm}
        confirmText={confirmarEnvio ? "Sí" : esEnvio ? "Enviar dirección" : "Sí"}
        cancelText={confirmarEnvio ? "No" : esEnvio ? "Cancelar" : "No"}
      >
        {esEnvio && !confirmarEnvio && (
          <form className="form-direccion-envio" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Calle *"
              value={direccionEnvio.calle}
              onChange={e => setDireccionEnvio({ ...direccionEnvio, calle: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Número / Puerta"
              value={direccionEnvio.puerta}
              onChange={e => setDireccionEnvio({ ...direccionEnvio, puerta: e.target.value })}
            />
            <input
              type="text"
              placeholder="Código Postal *"
              value={direccionEnvio.codigoPostal}
              onChange={e => setDireccionEnvio({ ...direccionEnvio, codigoPostal: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Ciudad *"
              value={direccionEnvio.ciudad}
              onChange={e => setDireccionEnvio({ ...direccionEnvio, ciudad: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Provincia"
              value={direccionEnvio.provincia}
              onChange={e => setDireccionEnvio({ ...direccionEnvio, provincia: e.target.value })}
            />
            <input
              type="text"
              placeholder="País *"
              value={direccionEnvio.pais}
              onChange={e => setDireccionEnvio({ ...direccionEnvio, pais: e.target.value })}
              required
            />
          </form>
        )}
      </ModalPersonalizado>
    </div>
  );
};

export default Tienda;
