const express = require('express');
const router = express.Router();
const fuelTypeController = require('../controllers/fuelTypeController');

// POST route to create a new fuel type
router.post('/', fuelTypeController.createFuelType);

module.exports = router;
