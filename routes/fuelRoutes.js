// routes/fuelRoutes.js
const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const  isAdmin = require("../middleware/isAdmin")

// Get all fuel types
router.get('/fuels', isAdmin, fuelController.getAllFuelTypes);

module.exports = router;
