require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// 1. Configuración de CORS (dominios permitidos)
const allowedOrigins = [
  'https://sportify-plataforma-deportiva-xi.vercel.app', // URL de Vercel
  'http://localhost:3000',          // Para desarrollo local
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// 2. Middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api', contactRoutes);

// 4. Rutas de prueba (para verificar que el backend funciona)
app.get('/', (req, res) => {
  res.send('¡Backend de Sportify funcionando!');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Conexión exitosa con el backend',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 5. Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

console.log("Rutas registradas en producción:");
if (app._router && app._router.stack) {
  app._router.stack.forEach((r) => {
    if (r.route?.path) console.log(r.route.path);
  });
}

// 6. Ejecutar sistema de puntos al iniciar
const procesarReservasFinalizadas = require('./utils/procesarPuntos');
procesarReservasFinalizadas();

setInterval(procesarReservasFinalizadas, 1000 * 60 * 60 * 6); // Cada 6 horas

// 6.1. Cron que actualiza reservas vencidas
require('./cron');

// 7. Iniciar servidor (usando el puerto de Railway)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`URL del backend: https://sportify-plataforma-deportiva-production-7eec.up.railway.app`);
});