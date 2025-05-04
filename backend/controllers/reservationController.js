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
    }
};

module.exports = reservationController;