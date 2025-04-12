const pool = require('../config/db');

/**
 * Modelo de usuario para interactuar con PostgreSQL
 * Contiene métodos para buscar por email y crear usuarios
 */
class Usuario {
    /**
     * Busca un usuario por email
     * @param {string} email - Email del usuario a buscar
     * @returns {Promise<Object|null>} Usuario encontrado o null
     */
    static async findByEmail(email) {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM usuarios WHERE email = $1',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error buscando usuario por email:", error);
            throw error;
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos
     * @param {Object} userData - Datos del usuario
     * @param {string} userData.nombre
     * @param {string} userData.email
     * @param {string} userData.contraseña
     * @returns {Promise<number>} ID del usuario creado
     */
    static async create({ nombre, email, contraseña }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO usuarios (nombre, email, contraseña) 
                 VALUES ($1, $2, $3) 
                 RETURNING id_usuario`,
                [nombre, email, contraseña]
            );
            return rows[0].id_usuario;
        } catch (error) {
            console.error("Error creando usuario:", error);
            throw error;
        }
    }
}

module.exports = Usuario;