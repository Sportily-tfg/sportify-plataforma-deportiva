const pool = require('../config/db');

/**
 * Modelo para interactuar con la tabla de actividades en PostgreSQL
 */
class Actividad {
    // Crear una nueva actividad
    static async create({ nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio }) {
        const { rows } = await pool.query(
            `INSERT INTO actividades 
             (nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio]
        );
        return rows[0];
    }

    // Obtener todas las actividades
    static async getAll() {
        const { rows } = await pool.query('SELECT * FROM actividades ORDER BY id_actividad');
        return rows;
    }

    // Obtener actividad por ID
    static async getById(id) {
        const { rows } = await pool.query('SELECT * FROM actividades WHERE id_actividad = $1', [id]);
        return rows[0];
    }

    // Actualizar actividad
    static async update(id, { nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio }) {
        const { rows } = await pool.query(
            `UPDATE actividades 
             SET nombre_actividad = $1, 
                 descripcion = $2, 
                 descripcion_larga = $3, 
                 nivel_dificultad = $4, 
                 max_participantes = $5, 
                 precio = $6
             WHERE id_actividad = $7
             RETURNING *`,
            [nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio, id]
        );
        return rows[0];
    }

    // Eliminar actividad
    static async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM actividades WHERE id_actividad = $1', [id]);
        return rowCount > 0;
    }
}

module.exports = Actividad;