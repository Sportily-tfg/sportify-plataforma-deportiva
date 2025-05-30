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

      // Validar datos de dirección obligatorios si es envío
      if (!direccion_envio ||
        !direccion_envio.calle ||
        !direccion_envio.codigoPostal ||
        !direccion_envio.ciudad ||
        !direccion_envio.pais
      ) {
        return res.status(400).json({ error: 'Faltan datos obligatorios de la dirección de envío' });
      }
    }

    // Actualizar puntos del usuario
    await pool.query(
      'UPDATE usuarios SET puntos = puntos - $1 WHERE id_usuario = $2',
      [recompensa.puntos_requeridos, id_usuario]
    );

    // Reducir stock si aplica
    if (recompensa.tipo === 'envio') {
      await pool.query(
        'UPDATE recompensas SET stock = stock - 1 WHERE id_recompensa = $1',
        [id_recompensa]
      );
    }

    // Estado del canje según tipo
    const estadoCanje = recompensa.tipo === 'instantaneo' ? 'completado' : 'pendiente';

    // Preparar direccion en texto para guardar
    let direccionEnvioString = null;
    if (direccion_envio) {
      direccionEnvioString = `${direccion_envio.calle}${direccion_envio.numero ? ', Nº ' + direccion_envio.numero : ''}, CP ${direccion_envio.codigoPostal}, ${direccion_envio.ciudad}, ${direccion_envio.provincia || ''}, ${direccion_envio.pais}`;
    }

    // Insertar canje
    await pool.query(
      'INSERT INTO canjes (id_usuario, id_recompensa, direccion_envio, estado) VALUES ($1, $2, $3, $4)',
      [id_usuario, id_recompensa, direccionEnvioString, estadoCanje]
    );

    res.json({ message: 'Canje realizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el canje' });
  }
});

module.exports = router;
