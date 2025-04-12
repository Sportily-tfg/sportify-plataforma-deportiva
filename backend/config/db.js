const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true, // Neon requiere SSL
  },
  max: 20, // Número máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificación de conexión (opcional pero útil)
pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión a la DB:', err);
});

module.exports = pool;