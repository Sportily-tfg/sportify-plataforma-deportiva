import React, { useState, useEffect } from 'react';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
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

  // Obtener usuarios del backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
  
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Captura el error del backend
        throw new Error(errorData.error || 'Error al obtener usuarios');
      }
  
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error completo:', err); // Ver esto en la consola del navegador
      setError(err.message);
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

  // Crear usuario
  const handleCreateUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async (id, userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => user.id_usuario === id ? updatedUser : user));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
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

      setUsers(users.filter(user => user.id_usuario !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isEditing) {
      await handleUpdateUser(isEditing, formData);
    } else {
      await handleCreateUser(formData);
    }
    setIsEditing(null);
    setFormData({ nombre: '', email: '', contraseña: '', rol: 'user' });
    fetchUsers(); // Refrescar lista
  };

  const handleEdit = (user) => {
    setIsEditing(user.id_usuario);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      contraseña: '',
      rol: user.rol
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      handleDeleteUser(id);
    }
  };

  if (isLoading) return <div className="management-container">Cargando...</div>;
  if (error) return <div className="management-container">Error: {error}</div>;

  return (
    <div className="management-container">
      <h2>Gestión de Usuarios</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h3>
        
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

        <div className="form-buttons">
          <PrimaryButton 
            lightText={true}
            texto={isEditing ? 'Guardar' : 'Crear'} 
            type="submit" 
          />
          {isEditing && (
            <SecondaryButton 
              lightText={true}
              texto="Cancelar" 
              onClick={() => {
                setIsEditing(null);
                setFormData({ nombre: '', email: '', contraseña: '', rol: 'user' });
              }} 
            />
          )}
        </div>
      </form>
      
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
    </div>
  );
};

export default UsersManagement;