"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UserPanel.css";
import PrimaryButton from "../components/buttons/PrimaryButton";

// URL base de la API obtenida de las variables de entorno
const API_URL = process.env.REACT_APP_API_URL;

// Componente principal del panel de usuario
const UserPanel = () => {
  // Estados para manejar los datos del usuario, carga y errores
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtiene los datos del usuario desde el localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Estados para manejar la edcion de datos y el modal de contraseña
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Efecto para cargar los datos del usuario al mnontar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Peticion GET para obtener los datos del usuario
        const response = await axios.get(`${API_URL}/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(response.data);
      } catch (err) {
        // Manejo de errores, incluyendo redireccion si no esta autenticado
        setError(err.response?.data?.error || "Error al cargar datos");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    // Condiciones para cargar los datos solo si hay usuario
    if (user && !data) {
      fetchData();
    } else if (!user) {
      navigate("/login");
    }
  }, [navigate, user, data]);

  // Estado para el formulario de edicion de datos del usuario
  const [editForm, setEditForm] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    password: "",
  });

  // Maneja cambios en los inputs del formulario de edicion
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envia los datos editados al servidor
  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/users/mi-cuenta`, editForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(res.data.message || "Datos actualizados");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar datos");
    }
  };

  // Maneja cambios en los inputs del formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envia el cambio de contraseña al servidor
  const handlePasswordSubmit = async () => {
    // Validacion de que las contraseñas coincidan
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/users/cambiar-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(res.data.message || "Contraseña actualizada correctamente");
      // Limpia el formulario y cierra el modal
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error al actualizar la contraseña");
    }
  };

  // Maneja la eliminacion de la cuenta del usuario
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    )
      return;
    try {
      await axios.delete(`${API_URL}/api/users/mi-cuenta`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.clear();
      alert("Cuenta eliminada");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cuenta");
    }
  };

  // Maneja la cancelacion de la reserva
  const handleCancelReservation = async (id_reserva) => {
    if (!window.confirm("¿Estás seguro de cancelar esta reserva?")) {
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/reservations/cancelar/${id_reserva}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data.reserva) {
        setData((prev) => ({
          ...prev,
          reservas: prev.reservas.map((r) =>
            r.id_reserva === id_reserva ? { ...r, estado: "cancelada" } : r
          ),
        }));
        alert("Reserva cancelada exitosamente");
      }
    } catch (error) {
      console.error("Error detallado:", error);
      alert(error.response?.data?.error || "Error al cancelar reserva");
    }
  };

  // Estados de carga y error
  if (loading) return <div className="user-panel">Cargando...</div>;
  if (error) return <div className="user-panel error-message">{error}</div>;

  // Renderizado principal del componente
  return (
    <div className="user-panel">
      {/* Seccion de perfil del usuario */} 
      <section className="profile-section">
        <h2>Mi perfil</h2>
        <div className="avatar-placeholder"></div>

        <div className="user-info">
          {/* Informacion basica del usuario */}
          <p>
            <strong>Nombre:</strong> {data?.usuario.nombre}
          </p>
          <p>
            <strong>Email:</strong> {data?.usuario.email}
          </p>
          <p>
            <strong>Miembro desde:</strong>{" "}
            {new Date(data?.usuario.fecha_registro).toLocaleDateString()}
          </p>
          <p>
            <strong>Puntos:</strong> {data?.usuario.puntos || 0}
          </p>
          {/* Botones de acciones del perfil */}
          <div className="button-group">
            <button
              className="edit-btn light-text"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancelar" : "Editar datos"}
            </button>
            <button
              className="edit-btn light-text"
              onClick={() => setShowPasswordModal(true)}
            >
              Cambiar contraseña
            </button>
            <button
              className="danger-btn light-text"
              onClick={handleDeleteAccount}
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Formulario de edicion (solo visible cuando isEditing es true) */}
      {isEditing && (
        <div className="user-panel-section">
          <h2>Editar mis datos</h2>
          <input
            type="text"
            placeholder="Nuevo nombre"
            name="nombre"
            value={editForm.nombre}
            onChange={handleInputChange}
          />
          <input
            type="email"
            placeholder="Nuevo email"
            name="email"
            value={editForm.email}
            onChange={handleInputChange}
          />
          <PrimaryButton onClick={handleEditSubmit}>
            Guardar cambios
          </PrimaryButton>
        </div>
      )}

      {/* Seccion de reservas del usuario */}
      <section className="reservations-section">
        <h3>Mis reservas</h3>
        {data?.reservas?.length > 0 ? (
          data.reservas.map((reserva, index) => {
            // Genera un ID unico para cada reserva
            const reservationId =
              reserva.id_reserva ||
              reserva.id ||
              reserva.reserva_id ||
              `temp-${index}`;

            return (
              <div key={reservationId} className="reservation-card">
                {/* Detalles de la reserva */}
                <p>
                  <strong>Actividad:</strong> {reserva.nombre_actividad}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(reserva.fecha_reserva).toLocaleDateString()}
                </p>
                <p>
                  <strong>Estado:</strong> {reserva.estado}
                </p>
                {/* Muestra el boton de cancelar solo si la reserva no esta cancelada ni finalizada */}
                {reserva.estado !== "cancelada" &&
                  reserva.estado !== "finalizado" && (
                    <PrimaryButton
                      onClick={() => handleCancelReservation(reservationId)}
                      texto="Cancelar reserva"
                      className="cancel-button"
                    />
                  )}
              </div>
            );
          })
        ) : (
          <p>No tienes reservas aún.</p>
        )}
      </section>

      {/* Modal para cambiar contraseña (solo visible cuando showPasswordModal es true */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cambiar contraseña</h2>
            <div className="modal-body">
              <input
                type="password"
                placeholder="Contraseña actual"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
              <div className="modal-buttons">
                <button
                  className="edit-btn light-text"
                  onClick={handlePasswordSubmit}
                >
                  Guardar contraseña
                </button>
                <button
                  className="cancel-modal-btn light-text"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seccion de recompensas del usuario */}
      <section className="rewards-section">
        <h3>Recompensas</h3>
        {data?.recompensas?.length > 0 ? (
          data.recompensas.map((recompensa, index) => (
            <div key={index} className="reward-card">
              <p>
                <strong>{recompensa.nombre_recompensa}</strong>
              </p>
              <p>
                Canjeado:{" "}
                {new Date(recompensa.fecha_canje).toLocaleDateString()}
              </p>
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
