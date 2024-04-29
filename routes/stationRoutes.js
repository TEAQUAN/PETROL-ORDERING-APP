// routes/stationRoutes.js
const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');

// Get all stations
router.get('/stations', stationController.getAllStations);

// Get station by ID
router.get('/stations/:id', stationController.getStationById);

// Route to get nearby petrol stations
router.get('/stations', stationController.getNearbyStations);

module.exports = router;
