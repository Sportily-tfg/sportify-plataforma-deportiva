import React, { useState, useEffect, useCallback } from "react";
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import ModalPersonalizado from '../../components/modal/ModalPersonalizado';
import '../../styles/AdminComponents.css';

const API_URL = process.env.REACT_APP_API_URL;

const StoreManagement = () => {
  const [recompensas, setRecompensas] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    puntos_requeridos: "",
    stock: "",
    imagen_url: "",
    tipo: "instantaneo",
  });

  // Estados para los modales
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    confirmText: "",
    cancelText: "",
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Memorizar openModal para usar en fetchRecompensas sin warning
  const openModal = useCallback((
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
  }, []);

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Memorizar fetchRecompensas para que sea estable y evitar warnings
  const fetchRecompensas = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/recompensas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error cargando recompensas');
      }

      const data = await response.json();
      setRecompensas(data);
    } catch (error) {
      openModal('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [openModal]);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Abrir modal para crear
  const openCreateModal = () => {
    setIsEditing(null);
    setFormData({
      nombre: "",
      descripcion: "",
      puntos_requeridos: "",
      stock: "",
      imagen_url: "",
      tipo: "instantaneo",
    });
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (recompensa) => {
    setIsEditing(recompensa.id_recompensa);
    setFormData({
      nombre: recompensa.nombre,
      descripcion: recompensa.descripcion,
      puntos_requeridos: recompensa.puntos_requeridos,
      stock: recompensa.stock,
      imagen_url: recompensa.imagen_url,
      tipo: recompensa.tipo,
    });
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setIsEditing(null);
    setFormData({
      nombre: "",
      descripcion: "",
      puntos_requeridos: "",
      stock: "",
      imagen_url: "",
      tipo: "instantaneo",
    });
  };

  // Eliminar recompensa
  const handleDelete = (id) => {
    openModal(
      'Eliminar recompensa',
      '¿Estás seguro de eliminar esta recompensa?',
      'warning',
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/recompensas/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Error al eliminar la recompensa');
          }

          fetchRecompensas();
          openModal('Éxito', 'Recompensa eliminada correctamente', 'success');
        } catch (error) {
          console.error('Error:', error);
          openModal('Error', error.message, 'error');
        }
      },
      'Eliminar',
      'Cancelar'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `${API_URL}/api/recompensas/${isEditing}` 
        : `${API_URL}/api/recompensas`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          puntos_requeridos: parseInt(formData.puntos_requeridos),
          stock: parseInt(formData.stock) || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la operación');
      }

      closeFormModal();
      fetchRecompensas();
      openModal(
        'Éxito', 
        isEditing ? 'Recompensa actualizada con éxito' : 'Recompensa creada con éxito', 
        'success'
      );
    } catch (error) {
      console.error('Error:', error);
      openModal('Error', error.message, 'error');
    }
  };

  if (isLoading) return <div className="management-container">Cargando...</div>;

  return (
    <div className="management-container">
      <h2>Gestión de Tienda</h2>
      
      <PrimaryButton 
        texto="Crear Nueva Recompensa" 
        lightText={true} 
        onClick={openCreateModal} 
      />

      {/* Lista de recompensas */}
      <div className="items-list">
        <h3>Recompensas Disponibles</h3>
        {recompensas.length === 0 ? (
          <p>No hay recompensas registradas</p>
        ) : (
          recompensas.map(recompensa => (
            <div key={recompensa.id_recompensa} className="item-card">
              <div className="item-info">
                <h4>{recompensa.nombre}</h4>
                <p>{recompensa.descripcion}</p>
                <p><strong>Puntos requeridos:</strong> {recompensa.puntos_requeridos}</p>
                <p><strong>Stock:</strong> {recompensa.stock}</p>
                <p><strong>Tipo:</strong> {recompensa.tipo}</p>
              </div>
              <div className="item-actions">
                <SecondaryButton 
                  lightText={true}
                  texto="Editar" 
                  onClick={() => handleEdit(recompensa)} 
                />
                <SecondaryButton 
                  lightText={true}
                  texto="Eliminar" 
                  onClick={() => handleDelete(recompensa.id_recompensa)}  
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para formulario */}
      <ModalPersonalizado
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={isEditing ? "Editar Recompensa" : "Crear Recompensa"}
        type="info"
        confirmText={isEditing ? "Guardar" : "Crear"}
        cancelText="Cancelar"
        onConfirm={handleSubmit}
      >
        <form onSubmit={handleSubmit} className="admin-form" style={{ padding: '1rem' }}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Puntos requeridos:</label>
            <input
              type="number"
              name="puntos_requeridos"
              value={formData.puntos_requeridos}
              onChange={handleInputChange}
              required
              min={0}
            />
          </div>

          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min={0}
            />
          </div>

          <div className="form-group">
            <label>URL de la imagen:</label>
            <input
              name="imagen_url"
              value={formData.imagen_url}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Tipo:</label>
            <select 
              name="tipo" 
              value={formData.tipo} 
              onChange={handleInputChange}
            >
              <option value="instantaneo">Instantáneo</option>
              <option value="envio">Envío</option>
            </select>
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

export default StoreManagement;
