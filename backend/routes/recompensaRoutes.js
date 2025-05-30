const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');

// Obtener todas las recompensas disponibles
router.get('/', async (req, res) => {
  try {
    // Mostrar recompensas con stock > 0 o tipo instantaneo
    const { rows } = await pool.query(`
      SELECT * FROM recompensas
      WHERE stock > 0 OR tipo = 'instantaneo'
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recompensas' });
  }
});

// Canjear una recompensa
router.post('/canjear', authMiddleware, async (req, res) => {
  const { id_recompensa, direccion_envio } = req.body;
  const id_usuario = req.user.id;

  try {
    // Obtener recompensa y usuario
    const recompensaResult = await pool.query('SELECT * FROM recompensas WHERE id_recompensa = $1', [id_recompensa]);
    if (recompensaResult.rowCount === 0) {
      return res.status(404).json({ error: 'Recompensa no encontrada' });
    }
    const recompensa = recompensaResult.rows[0];

    const usuarioResult = await pool.query('SELECT puntos FROM usuarios WHERE id_usuario = $1', [id_usuario]);
    if (usuarioResult.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const usuario = usuarioResult.rows[0];

    // Validar puntos
    if (usuario.puntos < recompensa.puntos_requeridos) {
      return res.status(400).json({ error: 'Puntos insuficientes' });
    }

    // Validar stock y tipo
    if (recompensa.tipo === 'envio') {
      if (recompensa.stock <= 0) {
        return res.status(400).json({ error: 'Recompensa agotada' });
      }

      // Validar que direccion_envio es objeto y campos obligatorios no vacíos
      if (
        !direccion_envio ||
        typeof direccion_envio !== 'object' ||
        !direccion_envio.calle?.trim() ||
        !direccion_envio.codigoPostal?.trim() ||
        !direccion_envio.ciudad?.trim() ||
        !direccion_envio.pais?.trim()
      ) {
        return res.status(400).json({ error: 'Debe proporcionar una dirección de envío completa (calle, código postal, ciudad, país).' });
      }
    }
    // Si tipo instantaneo no hace falta validar stock ni direccion

    // Iniciar transacción
    await pool.query('BEGIN');

    // Descontar puntos
    await pool.query(
      'UPDATE usuarios SET puntos = puntos - $1 WHERE id_usuario = $2',
      [recompensa.puntos_requeridos, id_usuario]
    );

    // Reducir stock solo si es envio
    if (recompensa.tipo === 'envio') {
      await pool.query(
        'UPDATE recompensas SET stock = stock - 1 WHERE id_recompensa = $1',
        [id_recompensa]
      );
    }

    // Guardar la direccion_envio como JSON stringify o null
    const direccionEnvioString = recompensa.tipo === 'envio' ? JSON.stringify(direccion_envio) : null;

    // Registrar canje, agregamos direccion de envio si existe
    await pool.query(
      'INSERT INTO canjes (id_usuario, id_recompensa, direccion_envio) VALUES ($1, $2, $3)',
      [id_usuario, id_recompensa, direccionEnvioString]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: 'Recompensa canjeada' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error en /canjear:', error);
    res.status(500).json({ error: 'Error al canjear' });
  }
});

module.exports = router;
