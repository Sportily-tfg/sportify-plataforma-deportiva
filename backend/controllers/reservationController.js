const Reserva = require('../models/Reserva');

const reservationController = {
    createReservation: async (req, res) => {
        try {
            const { id_actividad } = req.body;
            const id_usuario = req.user.id;

            //Validar que no tenga ya una reserva para esta actividad
            const existingReservation = await Reserva.getByUser(id_usuario);
            if (existingReservation.some(r => r.id_actividad == id_actividad)) {
                return res.status(400).json({ error: 'Ya tienes una reserva para esta actividad'});
            }

            const reserva = await Reserva.create({
                id_usuario,
                id_actividad,
                fecha_reserva: new Date()
            });
            
            res.status(201).json(reserva);
        } catch(error) {
            console.error('Error al crear la reserva:', error);
            res.status(500).json({ error: 'Error del servidor' });
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

    deleteReservation: async (req, res) => {
        try {
            const { id } = req.params;
            const id_usuario = req.user.id;
    
            // Validar que el ID sea un número válido
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID de reserva no válido' });
            }
    
            const deleted = await Reserva.delete(parseInt(id), id_usuario);
    
            if (!deleted) {
                return res.status(404).json({ error: 'Reserva no encontrada o no pertenece al usuario' });
            }
    
            res.json({ message: 'Reserva eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            res.status(500).json({ error: 'Error del servidor al eliminar reserva' });
        }
    }
};

module.exports = reservationController;