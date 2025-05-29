import React, { useState, useEffect } from 'react';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import ModalPersonalizado from '../../components/modal/ModalPersonalizado';
import '../../styles/AdminComponents.css';

const API_URL = process.env.REACT_APP_API_URL;

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    rol: 'user'
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

  // Obtener usuarios del backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
  
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener usuarios');
      }
  
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error:', err);
      openModal('Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Abrir modal para crear usuario
  const openCreateModal = () => {
    setIsEditing(null);
    setFormData({ nombre: '', email: '', contraseña: '', rol: 'user' });
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar usuario
  const handleEdit = (user) => {
    setIsEditing(user.id_usuario);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      contraseña: '',
      rol: user.rol
    });
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setIsEditing(null);
    setFormData({ nombre: '', email: '', contraseña: '', rol: 'user' });
  };

  // Crear usuario
  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }

      await response.json();
      closeFormModal();
      fetchUsers();
      openModal('Éxito', 'Usuario creado correctamente', 'success');
    } catch (err) {
      console.error('Error:', err);
      openModal('Error', err.message, 'error');
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/${isEditing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      await response.json();
      closeFormModal();
      fetchUsers();
      openModal('Éxito', 'Usuario actualizado correctamente', 'success');
    } catch (err) {
      console.error('Error:', err);
      openModal('Error', err.message, 'error');
    }
  };

  // Eliminar usuario
  const handleDelete = (id) => {
    openModal(
      'Eliminar usuario',
      '¿Estás seguro de eliminar este usuario?',
      'warning',
      async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Error al eliminar usuario');
          }

          fetchUsers();
          openModal('Éxito', 'Usuario eliminado correctamente', 'success');
        } catch (err) {
          console.error('Error:', err);
          openModal('Error', err.message, 'error');
        }
      },
      'Eliminar',
      'Cancelar'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await handleUpdateUser();
    } else {
      await handleCreateUser();
    }
  };

  if (isLoading) return <div className="management-container">Cargando...</div>;

  return (
    <div className="management-container">
      <h2>Gestión de Usuarios</h2>
      
      <PrimaryButton 
        texto="Crear Nuevo Usuario" 
        lightText={true} 
        onClick={openCreateModal} 
      />

      {/* Lista de usuarios */}
      <div className="items-list">
        <h3>Usuarios Registrados</h3>
        {users.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          users.map(user => (
            <div key={user.id_usuario} className="item-card">
              <div className="item-info">
                <h4>{user.nombre}</h4>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.rol}</p>
                <p><strong>Registro:</strong> {new Date(user.fecha_registro).toLocaleDateString()}</p>
              </div>
              <div className="item-actions">
                <SecondaryButton 
                  lightText={true}
                  texto="Editar" 
                  onClick={() => handleEdit(user)} 
                />
                <SecondaryButton 
                  lightText={true}
                  texto="Eliminar" 
                  onClick={() => handleDelete(user.id_usuario)}  
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
        title={isEditing ? "Editar Usuario" : "Crear Usuario"}
        type="info"
        confirmText={isEditing ? "Guardar" : "Crear"}
        cancelText="Cancelar"
        onConfirm={handleSubmit}
      >
        <form onSubmit={handleSubmit} className="admin-form" style={{ padding: '1rem' }}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isEditing && (
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Rol:</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
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

export default UsersManagement;