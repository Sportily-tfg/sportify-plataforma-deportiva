const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const Usuario = require('../models/Usuario');

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (parseInt(req.params.id) !== req.user.id) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Obtener reservas
        const reservas = await pool.query(
            `SELECT a.nombre_actividad, r.fecha_reserva, r.estado
             FROM reservas r
             JOIN actividades a ON r.id_actividad = a.id_actividad
             WHERE r.id_usuario = $1`,
            [req.params.id]
        );

        // Obtener recompensas
        const recompensas = await pool.query(
            `SELECT r.nombre_recompensa, c.fecha_canje
             FROM canjes c
             JOIN recompensas r ON c.id_recompensa = r.id_recompensa
             WHERE c.id_usuario = $1`,
            [req.params.id]
        );

        res.json({
            usuario,
            reservas: reservas.rows,
            recompensas: recompensas.rows
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;