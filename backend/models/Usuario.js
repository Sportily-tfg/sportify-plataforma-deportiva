const pool = require('../config/db');

/**
 * Modelo de usuario para interactuar con PostgreSQL
 * Contiene métodos para buscar por email y crear usuarios
 */
class Usuario {
    static async findByEmail(email) {
        const { rows } = await pool.query(
            'SELECT id_usuario, nombre, email, contraseña, rol, fecha_registro FROM usuarios WHERE email = $1',
            [email]
        );
        return rows[0] || null;
    }

    static async findById(id) {
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
             WHERE u.id_usuario = $1
             GROUP BY u.id_usuario`,
            [id]
        );
        return rows[0] || null;
    }

    static async create({ nombre, email, contraseña }) {
        const { rows } = await pool.query(
            `INSERT INTO usuarios (nombre, email, contraseña, fecha_registro) 
             VALUES ($1, $2, $3, CURRENT_DATE)
             RETURNING id_usuario, nombre, email, rol, fecha_registro`,
            [nombre, email, contraseña]
        );
        return rows[0];
    }
}

module.exports = Usuario;