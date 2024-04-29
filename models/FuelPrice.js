const mongoose = require('mongoose');
const petrolStation = require("./PetrolStation")

const fuelPriceSchema = new mongoose.Schema({
  petrolStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PetrolStation',
    required: true,
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Premium', 'LPG'], // Example fuel types
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  enteredBy: {
    type: String,
    ref: 'User',
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const FuelPrice = mongoose.model('FuelPrice', fuelPriceSchema);

module.exports = FuelPrice;
