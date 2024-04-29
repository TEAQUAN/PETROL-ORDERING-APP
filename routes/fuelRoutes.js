// routes/fuelRoutes.js
const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');

// Get all fuel types
router.get('/fuels', fuelController.getAllFuelTypes);

module.exports = router;
