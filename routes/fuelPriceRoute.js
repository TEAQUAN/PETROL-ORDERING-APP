// routes/fuelPriceRoutes.js

const express = require('express');
const router = express.Router();
const fuelPriceController = require('../controllers/fuelPriceController');
const isAdmin = require('../middleware/isAdmin');
const authMiddleware = require('../middleware/authMiddleware');

// Route to add a new fuel price
router.post('/fuel-prices', [authMiddleware, isAdmin], fuelPriceController.addFuelPrice);

// Route to update an existing fuel price
//router.put('/fuel-prices/:id', fuelPriceController.updateFuelPrice);

// Other routes for fetching or deleting fuel prices if needed

module.exports = router;
