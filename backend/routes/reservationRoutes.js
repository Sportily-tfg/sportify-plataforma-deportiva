const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reservationController = require('../controllers/reservationController');

router.post('/', authMiddleware, reservationController.createReservation);
router.get('/', authMiddleware, reservationController.getUserReservations);

module.exports = router;