const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const Usuario = require('../models/Usuario');

// Obtener todos los usuarios (solo para administradores)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { rows } = await pool.query(
      `SELECT 
        u.id_usuario, 
        u.nombre, 
        u.email, 
        u.rol, 
        u.fecha_registro,
        COALESCE(SUM(g.puntos), 0) AS puntos
       FROM usuarios u
       LEFT JOIN gamificacion g ON u.id_usuario = g.id_usuario
       GROUP BY u.id_usuario`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar usuario
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Verificar permisos (solo admin o el propio usuario)
    if (parseInt(req.params.id) !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { nombre, email, rol } = req.body;

    // Actualizar usuario en la base de datos
    const { rows } = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, rol = $3 
       WHERE id_usuario = $4
       RETURNING id_usuario, nombre, email, rol, fecha_registro`,
      [nombre, email, rol, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar usuario
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Solo administradores pueden eliminar usuarios
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // No permitir eliminarse a sí mismo
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }

    const { rowCount } = await pool.query(
      'DELETE FROM usuarios WHERE id_usuario = $1',
      [req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (parseInt(req.params.id) !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        const reservas = await pool.query(
            `SELECT 
                r.id_reserva,
                a.nombre_actividad,
                r.fecha_reserva,
                r.estado
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