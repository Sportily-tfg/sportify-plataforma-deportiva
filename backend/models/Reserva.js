const pool = require('../config/db');

class Reserva {
    static async create({ id_usuario, id_actividad, fecha_reserva, estado='pendiente' }) {
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
            `SELECT r.*, a.nombre_actividad
            FROM reservas r
            JOIN actividades a ON r.id_actividad = a.id_actividad
            WHERE r.id_usuario = $1`,
            [id_usuario]
        );
        return rows;
    }

    static async getByActividad(id_actividad) {
        const  { rows } = await pool.query(
            `SELECT * FROM reservas WHERE id_actividad = $1`
            [id_actividad]
        )
        return rows;   
    }

    static async delete(id_reserva, id_usuario){
        const { rowCount } = await pool.query(
            `DELETE FROM reservas
            WHERE id_reserva = $1 AND id_usuario = $2`,
            [id_reserva, id_usuario]
        );
        return rowCount > 0;
    }

    static async cancel(id_reserva, id_usuario) {
        const { rows } = await pool.query(
            `UPDATE reservas
            SET estado = 'cancelada'
            WHERE id_reserva = $1 AND id_usuario = $2
            RETURNING *`,
            [id_reserva, id_usuario]
        );
        return rows[0];
    }

}

module.exports = Reserva;