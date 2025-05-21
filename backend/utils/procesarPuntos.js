const pool = require('../config/db');

async function procesarReservasFinalizadas() {
  try {
    const hoy = new Date().toISOString().split('T')[0];

    const { rows: reservas } = await pool.query(
      `SELECT r.id_reserva, r.id_usuario, r.id_actividad, a.nombre_actividad, a.puntos
       FROM reservas r
       JOIN actividades a ON r.id_actividad = a.id_actividad
       WHERE r.estado = 'pendiente' AND a.fecha < $1`,
      [hoy]
    );

    if (!reservas || reservas.length === 0) {
      console.log('No hay reservas vencidas por procesar.');
      return;
    }

    for (const reserva of reservas) {
      const puntosGanados = reserva.puntos || 0;

      await pool.query(
        `UPDATE reservas SET estado = 'finalizada' WHERE id_reserva = $`,
        [reserva.id_reserva]
      );

      await pool.query(
        `UPDATE usuarios SET puntos = COALESCE(puntos, 0) + $1 WHERE id_usuario = $2`,
        [puntosGanados, reserva.id_usuario]
      );

      await pool.query(
        `INSERT INTO gamificacion (id_usuario, descripcion_logro, puntos, fecha_obtencion)
         VALUES ($1, $2, $3, NOW())`,
        [
          reserva.id_usuario,
          `Completó "${reserva.nombre_actividad}"`,
          puntosGanados,
        ]
      );

      
    }
  } catch (error) {
    console.error('Error al procesar puntos:', error);
  }
}

module.exports = procesarReservasFinalizadas;