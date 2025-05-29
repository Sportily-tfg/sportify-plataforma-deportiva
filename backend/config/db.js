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
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Establece la zona horaria a 'Europe/Madrid' en cada nueva conexión
pool.on('connect', (client) => {
  console.log('✅ Conectado a la base de datos Neon PostgreSQL');
  client.query("SET TIME ZONE 'Europe/Madrid';")
    .then(() => console.log("🕒 Zona horaria configurada: Europe/Madrid"))
    .catch(err => console.error("❌ Error al establecer zona horaria:", err));
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión a la DB:', err);
});

module.exports = pool;
