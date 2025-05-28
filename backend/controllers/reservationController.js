const Reserva = require('../models/Reserva');

const reservationController = {

    createReservation: async (req, res) => {
        try {
            const { id_actividad } = req.body;
            const id_usuario = req.user.id;

            // Verifica si ya existe una reserva del usuario para esta actividad
            const reservasExistentes = await Reserva.getByUser(id_usuario);
            if (reservasExistentes.some(r => r.id_actividad == id_actividad)) {
                return res.status(400).json({ error: 'Ya tienes una reserva para esta actividad' });
            }

            const nuevaReserva = await Reserva.create({
                id_usuario,
                id_actividad,
                fecha_reserva: new Date()
            });

            res.status(201).json(nuevaReserva);
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            res.status(500).json({ error: 'Error del servidor al crear la reserva' });
        }
    },

    getUserReservations: async (req, res) => {
        try {
            const reservas = await Reserva.getByUser(req.user.id);
            res.json(reservas);
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    },

cancelReservation: async (req, res) => {
    try {
        const { id_reserva } = req.params;
        const id_usuario = req.user.id;

        console.log(`Intentando cancelar reserva ${id_reserva} para usuario ${id_usuario}`); // Log para depuración

        const reserva = await Reserva.findById(id_reserva);
        if (!reserva) {
            console.log('Reserva no encontrada');
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        if (reserva.id_usuario !== id_usuario) {
            console.log('Usuario no autorizado');
            return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva' });
        }

        const reservaCancelada = await Reserva.cancel(id_reserva);
        if (!reservaCancelada) {
            console.log('No se pudo actualizar la reserva');
            return res.status(500).json({ error: 'No se pudo cancelar la reserva' });
        }

        console.log('Reserva cancelada exitosamente:', reservaCancelada);
        res.json({
            success: true,
            mensaje: 'Reserva cancelada correctamente',
            reserva: reservaCancelada
        });

    } catch (error) {
        console.error('Error en cancelReservation:', error);
        res.status(500).json({ 
            error: 'Error del servidor',
            detalle: error.message 
        });
    }
}
      ,

    deleteReservationByAdmin: async (req, res) => {
        try {
            const { id_reserva } = req.params;

            const eliminada = await Reserva.deleteByAdmin(id_reserva);
            if (!eliminada) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }

            res.json({ mensaje: 'Reserva eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            res.status(500).json({ error: 'Error del servidor al eliminar la reserva' });
        }
    }
};

module.exports = reservationController;