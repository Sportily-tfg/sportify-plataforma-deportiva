import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ActivitiesManagement from './ActivitiesManagement';
import UsersManagement from './UsersManagement';
import StoreManagement from './StoreManagement';  // Importar nuevo componente
import '../../styles/AdminPanel.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('activities');
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && (!user || user.rol !== 'admin')) {
            navigate('/', { 
                state: { 
                    from: location,
                    message: 'Acceso restringido a administradores' 
                } 
            });
        }
    }, [user, loading, navigate, location]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="admin-panel">
            
            <div className="admin-sidebar">
                <h2>Panel de administración</h2>
                <nav>
                    <button 
                        className={`admin-nav-btn ${activeTab === 'activities' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('activities')}
                    >
                        Gestión de actividades
                    </button>
                    <button 
                        className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('users')}
                    >
                        Gestión de usuarios
                    </button>
                    <button 
                        className={`admin-nav-btn ${activeTab === 'store' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('store')}
                    >
                        Tienda
                    </button>
                </nav>
            </div>

            <div className="admin-content">
                {activeTab === 'activities' && <ActivitiesManagement />}
                {activeTab === 'users' && <UsersManagement />}
                {activeTab === 'store' && <StoreManagement />}
            </div>
        </div>
    );
};

export default AdminPanel;
