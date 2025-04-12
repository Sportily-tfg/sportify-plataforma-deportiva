const pool = require('../config/db');

class Usuario {
  static async findByEmail(email) {
    // Cambia esto:
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',  // $1 en lugar de ?
      [email]  // Array de parámetros
    );
    return rows[0];  // PostgreSQL devuelve { rows }
  }

  static async create({ nombre, email, contraseña }) {
    // Cambia esto:
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, email, contraseña) 
       VALUES ($1, $2, $3) RETURNING id_usuario`,  // $1, $2, $3
      [nombre, email, contraseña]
    );
    return rows[0].id_usuario;
  }
}

module.exports = Usuario;