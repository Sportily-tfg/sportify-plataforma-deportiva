const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reservationController = require('../controllers/reservationController');

router.post('/', authMiddleware, reservationController.createReservation);
router.get('/', authMiddleware, reservationController.getUserReservations);
router.delete('/:id', authMiddleware, reservationController.deleteReservation);
router.put('/:id/cancel', authMiddleware, reservationController.cancelReservation);

module.exports = router;