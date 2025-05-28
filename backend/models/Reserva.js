const pool = require('../config/db');

class Reserva {

    static async create({ id_usuario, id_actividad, fecha_reserva, estado = 'pendiente' }) {
        const { rows } = await pool.query(
            `INSERT INTO reservas (id_usuario, id_actividad, fecha_reserva, estado)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id_usuario, id_actividad, fecha_reserva, estado]
        );
        return rows[0];
    }

static async getByUser(id_usuario) {
    const { rows } = await pool.query(
      `SELECT 
          r.id_reserva,
          r.fecha_reserva,
          r.estado as estado_reserva,
          r.id_actividad,
          a.nombre_actividad,
          a.estado as estado_actividad
       FROM reservas r
       JOIN actividades a ON r.id_actividad = a.id_actividad
       WHERE r.id_usuario = $1`,
      [id_usuario]
    );
    return rows;
}   

    static async getByActividad(id_actividad) {
        const { rows } = await pool.query(
            `SELECT * FROM reservas WHERE id_actividad = $1`,
            [id_actividad]
        );
        return rows;
    }

    static async findById(id_reserva) {
        const { rows } = await pool.query(
            `SELECT * FROM reservas WHERE id_reserva = $1`,
            [id_reserva]
        );
        return rows[0];
    }

static async cancel(id_reserva) {
    const { rows } = await pool.query(
        `UPDATE reservas 
         SET estado = 'cancelada' 
         WHERE id_reserva = $1
         RETURNING *`,
        [id_reserva]
    );
    return rows[0] || null; // Asegura que devuelva null si no encuentra la reserva
}

static async finalizarReservasVencidas() {
  const { rows } = await pool.query(`
    UPDATE reservas r
    SET estado = 'finalizado'
    FROM actividades a
    WHERE r.id_actividad = a.id_actividad
      AND r.estado = 'pendiente'
      AND (a.fecha + a.horario) <= NOW()
    RETURNING r.*;
  `);
  return rows;
}

}

module.exports = Reserva;
