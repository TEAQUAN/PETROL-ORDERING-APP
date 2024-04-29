const mongoose = require('mongoose');

const petrolStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  formattedAddress: String,
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  address: {
    type: String,
    required: true,
  },
  latestFuelPrice: {
    type: Number,
    default: 0,
  },
  photoReference: String, // New field for photo reference
  streetViewUrl: String, // New field for Street View image URL
});

const PetrolStation = mongoose.model('PetrolStation', petrolStationSchema);

module.exports = PetrolStation;
