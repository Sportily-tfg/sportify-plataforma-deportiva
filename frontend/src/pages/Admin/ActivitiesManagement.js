import React, { useState, useEffect } from "react";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import ModalPersonalizado from "../../components/modal/ModalPersonalizado";
import "../../styles/AdminComponents.css";

const API_URL = process.env.REACT_APP_API_URL;

const ActivitiesManagement = () => {
  const [activities, setActivities] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre_actividad: "",
    descripcion: "",
    descripcion_larga: "",
    nivel_dificultad: "Intermedio",
    max_participantes: "",
    precio: "",
    fecha: "",
    horario: "",
    categoria: "General",
  });

  // Modal para confirmaciones o mensajes (el tuyo original)
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    confirmText: "",
    cancelText: "",
  });

  // Modal para el formulario (nuevo estado)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const openModal = (
    title,
    message,
    type = "info",
    onConfirm = null,
    confirmText = "Confirmar",
    cancelText = "Cerrar"
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (categoria = null) => {
    try {
      const url = categoria
        ? `${API_URL}/api/activities?categoria=${encodeURIComponent(categoria)}`
        : `${API_URL}/api/activities`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar actividades');
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
      openModal('Error', 'Error al cargar actividades', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Abrir modal para crear (vacío)
  const openCreateModal = () => {
    setIsEditing(null);
    setFormData({
      nombre_actividad: "",
      descripcion: "",
      descripcion_larga: "",
      nivel_dificultad: "Intermedio",
      max_participantes: "",
      precio: "",
      fecha: "",
      horario: "",
      categoria: "General",
    });
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (activity) => {
    setIsEditing(activity.id_actividad);
    setFormData({
      nombre_actividad: activity.nombre_actividad,
      descripcion: activity.descripcion,
      descripcion_larga: activity.descripcion_larga || "",
      nivel_dificultad: activity.nivel_dificultad,
      max_participantes: activity.max_participantes,
      precio: activity.precio,
      fecha: activity.fecha ? activity.fecha.split("T")[0] : "",
      horario: activity.horario ? formatTimeForInput(activity.horario) : "",
      categoria: activity.categoria || "General"
    });
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setIsEditing(null);
    setFormData({
      nombre_actividad: "",
      descripcion: "",
      descripcion_larga: "",
      nivel_dificultad: "Intermedio",
      max_participantes: "",
      precio: "",
      fecha: "",
      horario: "",
      categoria: "General",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `${API_URL}/api/activities/${isEditing}` : `${API_URL}/api/activities`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la actividad');
      }

      fetchActivities();
      closeFormModal();

      openModal(
        'Éxito',
        isEditing ? 'Actividad actualizada correctamente' : 'Actividad creada correctamente',
        'success'
      );
    } catch (error) {
      console.error('Error:', error);
      openModal('Error', 'Error al guardar la actividad', 'error');
    }
  };

  const handleDelete = async (id) => {
    openModal(
      'Eliminar actividad',
      '¿Estás seguro de eliminar esta actividad?',
      'warning',
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/activities/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Error al eliminar la actividad');
          }

          fetchActivities();
          openModal('Éxito', 'Actividad eliminada correctamente', 'success');
        } catch (error) {
          console.error('Error:', error);
          openModal('Error', 'Error al eliminar la actividad', 'error');
        }
      },
      'Eliminar',
      'Cancelar'
    );
  };

  return (
    <div className="management-container">
      <h2>Gestión de Actividades</h2>

      <PrimaryButton texto="Crear Nueva Actividad" lightText={true} onClick={openCreateModal} />

      {/* Lista de actividades */}
      <div className="filter-section">
        <label>Filtrar: </label>
        <select
          onChange={(e) => {
            const categoria = e.target.value;
            fetchActivities(categoria);
          }}
        >
          <option value="">Todas las categorías</option>
          <option value="General">General</option>
          <option value="Aventura">Aventura</option>
          <option value="Bienestar">Bienestar</option>
          <option value="Equipo">Equipo</option>
        </select>
      </div>

      <div className="items-list">
        <h3>Actividades Programadas</h3>
        {activities.length === 0 ? (
          <p>No hay actividades registradas</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id_actividad} className="item-card">
              <div className="item-info">
                <h4>{activity.nombre_actividad}</h4>
                <p>{activity.descripcion}</p>
                <p><strong>Dificultad:</strong> {activity.nivel_dificultad}</p>
                <p><strong>Participantes máx:</strong> {activity.max_participantes}</p>
                <p><strong>Categoría:</strong> {activity.categoria}</p>
                <p><strong>Precio:</strong> {activity.precio} €</p>
              </div>
              <div className="item-actions">
                <SecondaryButton lightText={true} texto="Editar" onClick={() => handleEdit(activity)} />
                <SecondaryButton lightText={true} texto="Eliminar" onClick={() => handleDelete(activity.id_actividad)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para formulario */}
      <ModalPersonalizado
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={isEditing ? "Editar Actividad" : "Crear Nueva Actividad"}
        type="info" // suponiendo que tu modal soporta un tipo custom para mostrar contenido arbitrario
        confirmText={isEditing ? "Guardar cambios" : "Crear actividad"}
        cancelText="Cancelar"
        onConfirm={handleSubmit}
      >
        {/* Aquí va el formulario */}
        <form onSubmit={handleSubmit} className="admin-form" style={{ padding: '1rem' }}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre_actividad"
              value={formData.nombre_actividad}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción corta:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Descripción larga:</label>
            <textarea
              name="descripcion_larga"
              value={formData.descripcion_larga}
              onChange={handleInputChange}
              rows="5"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nivel de dificultad:</label>
              <select
                name="nivel_dificultad"
                value={formData.nivel_dificultad}
                onChange={handleInputChange}
                required
              >
                <option value="Bajo">Bajo</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Categoría:</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
              >
                <option value="General">General</option>
                <option value="Aventura">Aventura</option>
                <option value="Bienestar">Bienestar</option>
                <option value="Equipo">Equipo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Máx. participantes:</label>
              <input
                type="number"
                name="max_participantes"
                value={formData.max_participantes}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Horario (HH:MM):</label>
            <input
              type="time"
              name="horario"
              value={formData.horario}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Precio (€):</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>
        </form>
      </ModalPersonalizado>

      {/* Modal para mensajes y confirmaciones */}
      <ModalPersonalizado
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
    </div>
  );
};

const formatTimeForInput = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

export default ActivitiesManagement;
