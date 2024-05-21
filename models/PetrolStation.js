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
  latestDieselPrice: { // Corrected field name
    type: Number,
    default: 0,
  },
  photoReference: String, // New field for photo reference
  streetViewUrl: String, // New field for Street View image URL
  img: String, // Field for image filename
});

// Create a virtual field for 'location'
petrolStationSchema.virtual('location').get(function() {
  return {
    type: "Point",
    coordinates: [this.longitude, this.latitude]
  };
});

// Ensure 'location' is part of the JSON output
petrolStationSchema.set('toJSON', { virtuals: true });
petrolStationSchema.set('toObject', { virtuals: true });

// Ensure index on the virtual 'location' field
petrolStationSchema.index({ location: '2dsphere' });

const PetrolStation = mongoose.model('PetrolStation', petrolStationSchema);

module.exports = PetrolStation;
