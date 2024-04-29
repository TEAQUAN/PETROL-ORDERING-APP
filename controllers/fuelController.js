// controllers/fuelController.js
const FuelType = require('../models/FuelType');

exports.getAllFuelTypes = async (req, res) => {
  try {
    const fuelTypes = await FuelType.find();
    res.json(fuelTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
