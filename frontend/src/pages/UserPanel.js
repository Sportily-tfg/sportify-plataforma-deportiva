"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/UserPanel.css"
import PrimaryButton from "../components/buttons/PrimaryButton"

const UserPanel = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        setData(response.data)
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar datos")
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    if (user && !data) {
      fetchData()
    } else if (!user) {
      navigate("/login")
    }
  }, [navigate, user, data])

  const [editForm, setEditForm] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    password: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(
        "https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/users/mi-cuenta",
        editForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      alert(res.data.message || "Datos actualizados")
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("Error al actualizar datos")
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async () => {
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Las contraseñas nuevas no coinciden")
      return
    }

    try {
      const res = await axios.put(
        "https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/users/cambiar-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      alert(res.data.message || "Contraseña actualizada correctamente")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowPasswordModal(false)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || "Error al actualizar la contraseña")
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.")) return
    try {
      await axios.delete(
        "https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/users/mi-cuenta",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      localStorage.clear()
      alert("Cuenta eliminada")
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Error al eliminar cuenta")
    }
  }

  const handleCancelReservation = async (id_reserva) => {
    if (!id_reserva) {
      alert("Error: ID de reserva no válido")
      return
    }

    try {
      const response = await axios.delete(
        `https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/reservations/cancelar/${id_reserva}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setData((prev) => ({
        ...prev,
        reservas: prev.reservas.map((r) => (r.id_reserva === id_reserva ? { ...r, estado: "cancelada" } : r)),
      }))
    } catch (error) {
      alert("No se pudo cancelar la reserva")
    }
  }

  const handleDeleteReservation = async (id_reserva) => {
    if (!id_reserva) {
      alert("Error: ID no válido")
      return
    }

    try {
      await axios.delete(
        `https://sportify-plataforma-deportiva-production-7eec.up.railway.app/api/reservations/admin/eliminar/${id_reserva}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setData((prev) => ({
        ...prev,
        reservas: prev.reservas.filter((r) => r.id_reserva !== id_reserva),
      }))
    } catch (error) {
      alert("No se pudo eliminar la reserva")
    }
  }

  if (loading) return <div className="user-panel">Cargando...</div>
  if (error) return <div className="user-panel error-message">{error}</div>

  return (
    <div className="user-panel">
      <section className="profile-section">
        <h2>Mi perfil</h2>
        <div className="avatar-placeholder"></div>

        <div className="user-info">
          <p>
            <strong>Nombre:</strong> {data?.usuario.nombre}
          </p>
          <p>
            <strong>Email:</strong> {data?.usuario.email}
          </p>
          <p>
            <strong>Miembro desde:</strong> {new Date(data?.usuario.fecha_registro).toLocaleDateString()}
          </p>
          <p>
            <strong>Puntos:</strong> {data?.usuario.puntos || 0}
          </p>
          <div className="button-group">
            <button className="edit-btn light-text" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancelar" : "Editar datos"}
            </button>
            <button className="edit-btn light-text" onClick={() => setShowPasswordModal(true)}>
              Cambiar contraseña
            </button>
            <button className="danger-btn light-text" onClick={handleDeleteAccount}>
              Eliminar cuenta
            </button>
          </div>
        </div>
      </section>

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
          <PrimaryButton onClick={handleEditSubmit}>Guardar cambios</PrimaryButton>
        </div>
      )}

      <section className="reservations-section">
        <h3>Mis reservas</h3>
        {data?.reservas?.length > 0 ? (
          data.reservas.map((reserva, index) => {
            const reservationId = reserva.id_reserva || reserva.id || reserva.reserva_id || `temp-${index}`

            return (
              <div key={reservationId} className="reservation-card">
                <p>
                  <strong>Actividad:</strong> {reserva.nombre_actividad}
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString()}
                </p>
                <p>
                  <strong>Estado:</strong> {reserva.estado}
                </p>

                {user.rol === "admin" ? (
                  <button className="danger light-text" onClick={() => handleDeleteReservation(reservationId)}>
                    Eliminar (Admin)
                  </button>
                ) : (
                  reserva.estado !== "cancelada" && (
                    <PrimaryButton
                      onClick={() => handleCancelReservation(reservationId)}
                      texto="Cancelar reserva"
                      className="cancel-button"
                    />
                  )
                )}
              </div>
            )
          })
        ) : (
          <p>No tienes reservas aún.</p>
        )}
      </section>

      {/* Modal para cambiar contraseña */}
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
                <button className="edit-btn light-text" onClick={handlePasswordSubmit}>
                  Guardar contraseña
                </button>
                <button className="cancel-modal-btn light-text" onClick={() => setShowPasswordModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="rewards-section">
        <h3>Recompensas</h3>
        {data?.recompensas?.length > 0 ? (
          data.recompensas.map((recompensa, index) => (
            <div key={index} className="reward-card">
              <p>
                <strong>{recompensa.nombre_recompensa}</strong>
              </p>
              <p>Canjeado: {new Date(recompensa.fecha_canje).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No has canjeado recompensas</p>
        )}
      </section>
    </div>
  )
}

export default UserPanel
