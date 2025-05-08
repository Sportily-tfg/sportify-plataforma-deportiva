const pool = require('../config/db');

/**
 * Modelo para interactuar con la tabla de actividades en PostgreSQL
 */
class Actividad {
    // Crear una nueva actividad
    static async create({ nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio, fecha, horario, categoria = 'General' }) {
        const { rows } = await pool.query(
            `INSERT INTO actividades 
             (nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio, fecha, horario, categoria)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio, fecha, horario, categoria]
        );
        return rows[0];
    }

    // Obtener todas las actividades
    static async getAll(categoria = null) {
        let query = 'SELECT * FROM actividades'
        const params = [];

        if (categoria) {
            query += ' WHERE categoria = $1';
            params.push(categoria);
        }

        query += ' ORDER BY id_actividad';

        const { rows } = await pool.query(query, params);
        return rows;
    }

    // Obtener actividad por ID
    static async getById(id) {
        const { rows } = await pool.query('SELECT * FROM actividades WHERE id_actividad = $1', [id]);
        return rows[0];
    }

    // Actualizar actividad
    static async update(id, { nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio, fecha, horario, categoria = 'General' }) {
        const { rows } = await pool.query(
            `UPDATE actividades 
             SET nombre_actividad = $1, 
                 descripcion = $2, 
                 descripcion_larga = $3, 
                 nivel_dificultad = $4, 
                 max_participantes = $5, 
                 precio = $6,
                 fecha = $7,
                 horario = $8,
                 categoria = $9
             WHERE id_actividad = $10
             RETURNING *`,
            [nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio, fecha, horario, categoria, id]
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