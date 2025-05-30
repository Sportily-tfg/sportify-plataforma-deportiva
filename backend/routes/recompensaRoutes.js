const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');

// Obtener todas las recompensas disponibles
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM recompensas WHERE stock > 0');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recompensas' });
  }
});

// Canjear una recompensa
router.post('/canjear', authMiddleware, async (req, res) => {
  const { id_recompensa } = req.body;
  const id_usuario = req.user.id;

  try {
    // Verificar puntos y stock
    const [recompensa, usuario] = await Promise.all([
      pool.query('SELECT * FROM recompensas WHERE id_recompensa = $1', [id_recompensa]),
      pool.query('SELECT puntos FROM usuarios WHERE id_usuario = $1', [id_usuario])
    ]);

    if (recompensa.rows[0].stock <= 0) {
      return res.status(400).json({ error: 'Recompensa agotada' });
    }

    if (usuario.rows[0].puntos < recompensa.rows[0].puntos_requeridos) {
      return res.status(400).json({ error: 'Puntos insuficientes' });
    }

    // Iniciar transacción
    await pool.query('BEGIN');

    // 1. Descontar puntos
    await pool.query(
      'UPDATE usuarios SET puntos = puntos - $1 WHERE id_usuario = $2',
      [recompensa.rows[0].puntos_requeridos, id_usuario]
    );

    // 2. Reducir stock
    await pool.query(
      'UPDATE recompensas SET stock = stock - 1 WHERE id_recompensa = $1',
      [id_recompensa]
    );

    // 3. Registrar canje
    await pool.query(
      'INSERT INTO canjes (id_usuario, id_recompensa) VALUES ($1, $2)',
      [id_usuario, id_recompensa]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: 'Recompensa canjeada' });

  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Error al canjear' });
  }
});

module.exports = router;