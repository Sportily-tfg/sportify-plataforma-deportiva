import React from "react";
import '../styles/UserPanel.css';

const UserPanel = () => {
    return (
        <div className="user-panel">
            {/*Sección 1: informacion del usuario*/}
            <section className="profile-section">
                <h2>Mi perfil</h2>
                <div className="avatar-placeholder"></div>

                <div className="user-info">
                    <p><strong>Nombre:</strong> -nombre del usuario- </p>
                    <p><strong>Email:</strong> -email del usuario- </p>
                    <p><strong>Miembro desde:</strong> -fecha- </p>
                    <p><strong>Puntos:</strong> -puntos- </p>
                </div>
            </section>

            {/*Sección 2: reservas*/}
            <section className="reservations-section">
                <h3>Mis reservas</h3>

                <div className="reservation-card">
                    <p><strong>Actividad:</strong> actividad </p>
                    <p><strong>Fecha:</strong> fecha </p>
                    <p><strong>Estado:</strong> confirmada</p>
                </div>
                {/* mas reservas */}
            </section>

            {/* Sección 3: Recompensas */}
            <section className="rewards-section">
                <h3>Recompensas Disponibles</h3>
                <div className="reward-card">
                <p><strong>Descuento 10%</strong> (300 puntos)</p>
                <button className="redeem-btn">Canjear</button>
                </div>
                {/* Más recompensas... */}
            </section>
        </div>
    );
};

export default UserPanel;
