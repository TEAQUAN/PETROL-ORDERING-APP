const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');

// Route to fetch and save petrol stations from Google Maps Places API
router.get('/fetch', stationController.fetchAndSaveStations);

router.get("/allStations", stationController.getAllStations)

module.exports = router;
