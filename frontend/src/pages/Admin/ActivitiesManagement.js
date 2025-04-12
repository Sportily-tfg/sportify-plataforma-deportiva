import React, { useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import '../../styles/AdminComponents.css';

// Datos de prueba (simularán tu backend)
const mockActivities = [
  { id: 1, name: "Yoga Matutino", date: "2024-06-15", time: "09:00", capacity: 20, instructor: "Ana López" },
  { id: 2, name: "Pádel Avanzado", date: "2024-06-16", time: "18:00", court: "Pista 1", capacity: 4 }
];

const ActivitiesManagement = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    capacity: '',
    instructor: '',
    court: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Lógica para editar
      setActivities(activities.map(a => a.id === isEditing ? { ...formData, id: isEditing } : a));
    } else {
      // Lógica para crear
      setActivities([...activities, { ...formData, id: Date.now() }]);
    }
    setIsEditing(null);
    setFormData({ name: '', date: '', time: '', capacity: '', instructor: '', court: '' });
  };

  const handleEdit = (activity) => {
    setIsEditing(activity.id);
    setFormData(activity);
  };

  const handleDelete = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  return (
    <div className="management-container">
      <h2>Gestión de Actividades</h2>
      
      {/* Formulario para crear/editar */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{isEditing ? 'Editar Actividad' : 'Crear Nueva Actividad'}</h3>
        
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

        <div className="form-row">
          <div className="form-group">
            <label>Fecha:</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora:</label>
            <input 
              type="time" 
              name="time" 
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-buttons">
          <PrimaryButton lightText={true}
            texto={isEditing ? 'Guardar' : 'Crear'} 
            type="submit" 
          />
          {isEditing && (
            <SecondaryButton lightText={true}
              texto="Cancelar" 
              onClick={() => {
                setIsEditing(null);
                setFormData({ name: '', date: '', time: '', capacity: '', instructor: '', court: '' });
              }} 
            />
          )}
        </div>
      </form>

      {/* Lista de actividades */}
      <div className="items-list">
        <h3>Actividades Programadas</h3>
        {activities.length === 0 ? (
          <p>No hay actividades registradas</p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="item-card">
              <div className="item-info">
                <h4>{activity.name}</h4>
                <p><strong>Fecha:</strong> {activity.date} {activity.time}</p>
                {activity.instructor && <p><strong>Instructor:</strong> {activity.instructor}</p>}
                {activity.court && <p><strong>Pista:</strong> {activity.court}</p>}
                <p><strong>Capacidad:</strong> {activity.capacity}</p>
              </div>
              <div className="item-actions">
                <SecondaryButton lightText={true}
                  texto="Editar" 
                  onClick={() => handleEdit(activity)} 
                />
                <SecondaryButton lightText={true}
                  texto="Eliminar" 
                  onClick={() => handleDelete(activity.id)}  
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivitiesManagement;