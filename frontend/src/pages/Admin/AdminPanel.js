import React, { useState } from "react";
import ActivitiesManagement from './ActivitiesManagement';
import UsersManagement from './UsersManagement';
import '../../styles/AdminPanel.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('activities');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.rol !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="admin-panel">
            <div className="admin-sidebar">
                <h2>Panel de administración</h2>

                <nav>
                    <button className={`admin-nav-btn ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
                        Gestión de actividades</button>
                    <button className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        Gestión de usuarios</button>
                </nav>
            </div>

            <div className="admin-content">
                {activeTab === 'activities' ? <ActivitiesManagement /> : <UsersManagement />}
            </div>
        </div>
    )
}

export default AdminPanel;