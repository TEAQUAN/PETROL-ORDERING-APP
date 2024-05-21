const express = require('express');
const router = express.Router();
const fuelTypeController = require('../controllers/fuelTypeController');
const  isAdmin = require("../middleware/isAdmin")

// POST route to create a new fuel type
router.post('/',isAdmin, fuelTypeController.createFuelType);

module.exports = router;
