const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'No autorizado' });

    const { rows } = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.email, u.rol, u.fecha_registro,
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

router.put('/mi-cuenta', authMiddleware, async (req, res) => {
  console.log('Actualizando cuenta de usuario');
  try {
    const id_usuario = req.user.id;
    const { nombre, email, password } = req.body;

    const campos = [];
    const valores = [];
    let idx = 1;

    if (nombre) {
      campos.push(`nombre = $${idx++}`);
      valores.push(nombre);
    }

    if (email) {
      campos.push(`email = $${idx++}`);
      valores.push(email);
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      campos.push(`contraseña = $${idx++}`);
      valores.push(hashedPassword);
    }

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    valores.push(id_usuario);

    const result = await Usuario.updatebyfields(campos,idx,valores);

    res.json({ message: 'Datos actualizados correctamente', usuario: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar datos:', err);
    res.status(500).json({ error: 'Error del servidor al actualizar usuario' });
  }
});

router.delete('/mi-cuenta', authMiddleware, async (req, res) => {
  try {
    const id_usuario = req.user.id;
    await pool.query('DELETE FROM canjes WHERE id_usuario = $1', [id_usuario]);
    await pool.query('DELETE FROM reservas WHERE id_usuario = $1', [id_usuario]);
    await pool.query('DELETE FROM gamificacion WHERE id_usuario = $1', [id_usuario]);
    await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id_usuario]);

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar cuenta:', err);
    res.status(500).json({ error: 'Error del servidor al eliminar cuenta' });
  }
});

router.put('/cambiar-password', authMiddleware, async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const { rows } = await pool.query(
      'SELECT contraseña FROM usuarios WHERE id_usuario = $1',
      [id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].contraseña);

    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query(
      'UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2',
      [hashedPassword, id_usuario]
    );

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ error: 'Error del servidor al cambiar contraseña' });
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
      `SELECT r.id_reserva, a.nombre_actividad, r.fecha_reserva, r.estado
       FROM reservas r
       JOIN actividades a ON r.id_actividad = a.id_actividad
       WHERE r.id_usuario = $1`,
      [req.params.id]
    );

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

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { nombre, email, rol } = req.body;

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

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'No autorizado' });
    if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });

    await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [req.params.id]);

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;