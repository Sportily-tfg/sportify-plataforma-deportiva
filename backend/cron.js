const cron = require('node-cron');
const Reserva = require('./models/Reserva');

// Se ejecuta cada minuto
cron.schedule('* * * * *', async () => {
  console.log("⏱ [CRON] Ejecutando revisión de reservas vencidas...");

  try {
    const actualizadas = await Reserva.finalizarReservasVencidas();
    if (actualizadas.length > 0) {
      console.log(`✅ [CRON] ${actualizadas.length} reservas actualizadas a 'finalizado'.`);
    } else {
      console.log("ℹ️ [CRON] No hay reservas para actualizar.");
    }
  } catch (error) {
    console.error('❌ [CRON] Error al actualizar reservas vencidas:', error.message);
  }
});
