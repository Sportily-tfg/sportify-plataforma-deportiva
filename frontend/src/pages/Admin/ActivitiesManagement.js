import React, { useState, useEffect } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import '../../styles/AdminComponents.css';


const ActivitiesManagement = () => {
    const [activities, setActivities] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({
        nombre_actividad: '',
        descripcion: '',
        descripcion_larga: '',
        nivel_dificultad: 'Intermedio',
        max_participantes: '',
        precio: '',
        fecha: '',
        horario: '',
        categoria: 'General'
    });
    

    // Cargar actividades al montar el componente
    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async (categoria = null) => {
        try {
            const url = categoria 
            ? `https://sportify-plataforma-deportiva-production-7eec.up.railway.app//api/activities?categoria=${encodeURIComponent(categoria)}`
            : 'https://sportify-plataforma-deportiva-production-7eec.up.railway.app//api/activities';
            
            const response = await fetch(url);
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error al cargar actividades:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const url = isEditing ? `https://sportify-plataforma-deportiva-production-7eec.up.railway.app//api/activities/${isEditing}` : 'https://sportify-plataforma-deportiva-production-7eec.up.railway.app//api/activities';
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

            fetchActivities(); // Recargar la lista
            setIsEditing(null);
            setFormData({
                nombre_actividad: '',
                descripcion: '',
                descripcion_larga: '',
                nivel_dificultad: 'Intermedio',
                max_participantes: '',
                precio: '',
                fecha: '',
                horario: '',
                categoria: 'General'
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la actividad');
        }
    };

    const handleEdit = (activity) => {
        setIsEditing(activity.id_actividad);
        setFormData({
            nombre_actividad: activity.nombre_actividad,
            descripcion: activity.descripcion,
            descripcion_larga: activity.descripcion_larga || '',
            nivel_dificultad: activity.nivel_dificultad,
            max_participantes: activity.max_participantes,
            precio: activity.precio,
            fecha: activity.fecha ? activity.fecha.split('T')[0] : '',
            horario: activity.horario ? formatTimeForInput(activity.horario) : ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta actividad?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://sportify-plataforma-deportiva-production-7eec.up.railway.app//api/activities/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la actividad');
            }

            fetchActivities(); // Recargar la lista
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar la actividad');
        }
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

                <div className="form-buttons">
                    <PrimaryButton lightText={true}
                        texto={isEditing ? 'Guardar cambios' : 'Crear actividad'} 
                        type="submit" 
                    />
                    {isEditing && (
                        <SecondaryButton lightText={true}
                            texto="Cancelar" 
                            onClick={() => {
                                setIsEditing(null);
                                setFormData({
                                    nombre_actividad: '',
                                    descripcion: '',
                                    descripcion_larga: '',
                                    nivel_dificultad: 'Intermedio',
                                    max_participantes: '',
                                    precio: '',
                                    fecha: '',
                                    horario: ''
                                });
                            }} 
                        />
                    )}
                </div>
            </form>

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
                    activities.map(activity => (
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
                                <SecondaryButton lightText={true}
                                    texto="Editar" 
                                    onClick={() => handleEdit(activity)} 
                                />
                                <SecondaryButton lightText={true}
                                    texto="Eliminar" 
                                    onClick={() => handleDelete(activity.id_actividad)}  
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const formatTimeForInput = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
};

export default ActivitiesManagement;