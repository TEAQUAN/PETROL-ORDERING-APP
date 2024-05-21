const mongoose = require('mongoose');
const petrolStation = require("./PetrolStation")

const DieselPriceSchema = new mongoose.Schema({
  petrolStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PetrolStations',
    required: true,
  },
  fuelType: {
    type: String,
    enum: [ 'Diesel'],
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

const DieselPrice = mongoose.model('DieselPrice',DieselPriceSchema );

module.exports = DieselPrice;
