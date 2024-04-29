// models/Order.js
const mongoose = require('mongoose');
const User = require('./User'); // Importing the User model
const PetrolStation = require('./PetrolStation'); // Importing the PetrolStation model
const FuelType = require('./FuelType'); // Importing the FuelType model

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'PetrolStation', required: true },
  fuelType: { type: mongoose.Schema.Types.ObjectId, ref: 'FuelType', required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

// Notes:
// Importing Models: Each model (User, PetrolStation, FuelType) is imported at the top of Order.js using require.
// Referring to Models: use mongoose.Schema.Types.ObjectId to indicate that these fields will store the _id of documents from the referenced models (User, PetrolStation, FuelType).
// 'ref' Property: The ref property in each field specifies the name of the model that these fields refer to. This is crucial for Mongoose to understand the relationship.
// Automatic Population: Now, when you query for an Order and use Mongoose's .populate(), it will automatically fetch and populate the user, station, and fuelType fields with the full documents from the referenced models.