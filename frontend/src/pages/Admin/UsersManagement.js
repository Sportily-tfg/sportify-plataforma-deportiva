import React, { useState } from 'react';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import '../../styles/AdminComponents.css';

// Datos de prueba
const mockUsers = [
  { id: 1, name: "Carlos Ruiz", email: "carlos@example.com", role: "user", joinDate: "2024-01-15" },
  { id: 2, name: "Admin User", email: "admin@example.com", role: "admin", joinDate: "2023-11-20" }
];

const UsersManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Actualizar usuario existente
      setUsers(users.map(user => 
        user.id === isEditing ? { ...formData, id: isEditing } : user
      ));
    } else {
      // Crear nuevo usuario
      const newUser = {
        ...formData,
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setIsEditing(null);
    setFormData({ name: '', email: '', role: 'user' });
  };

  const handleEdit = (user) => {
    setIsEditing(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="management-container">
      <h2>Gestión de Usuarios</h2>
      
      {/* Formulario para crear/editar usuarios */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
        
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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

        <div className="form-group">
          <label>Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="form-buttons">
          <PrimaryButton lightText={true}
            texto={isEditing ? 'Guardar' : 'Crear Usuario'} 
            type="submit" 
          />
          {isEditing && (
            <SecondaryButton lightText={true}
              texto="Cancelar" 
              onClick={() => {
                setIsEditing(null);
                setFormData({ name: '', email: '', role: 'user' });
              }} 
            />
          )}
        </div>
      </form>
      
      {/* Lista de usuarios */}
      <div className="items-list">
        <h3>Usuarios Registrados</h3>
        {users.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="item-card">
              <div className="item-info">
                <h4>{user.name}</h4>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
                <p><strong>Miembro desde:</strong> {user.joinDate}</p>
              </div>
              <div className="item-actions">
                <SecondaryButton lightText={true}
                  texto="Editar" 
                  onClick={() => handleEdit(user)} 
                />
                <SecondaryButton 
                  texto="Eliminar" lightText={true}
                  onClick={() => handleDelete(user.id)}  
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