const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authMiddleware, reservationController.createReservation);
router.get('/', authMiddleware, reservationController.getUserReservations);
router.delete('/cancelar/:id_reserva', authMiddleware, reservationController.cancelReservation);
router.delete('/admin/eliminar/:id_reserva', authMiddleware, isAdmin, reservationController.deleteReservationByAdmin);



module.exports = router;