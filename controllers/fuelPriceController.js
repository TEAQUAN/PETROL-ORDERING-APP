const FuelPrice = require('../models/FuelPrice');
const PetrolStation = require('../models/PetrolStation');

// Controller function to add a new fuel price for a specific fuel type at a petrol station
exports.addFuelPrice = async (req, res) => {
  try {
    const { fuelType, price, petrolStationName, enteredBy } = req.body;

    // Check if the fuel type is valid
    const validFuelTypes = ['Petrol', 'Diesel', 'Premium', 'LPG']; // Add more if needed
    if (!validFuelTypes.includes(fuelType)) {
      return res.status(400).json({ error: 'Invalid fuel type' });
    }

    // Check if the petrol station exists by name
    const petrolStation = await PetrolStation.findOne({ name: petrolStationName });
    if (!petrolStation) {
      return res.status(404).json({ error: 'Petrol station not found' });
    }

    // Check if a fuel price already exists for this station and type
    let existingFuelPrice = await FuelPrice.findOne({ fuelType, petrolStation: petrolStation._id });

    // If price exists, update it
    if (existingFuelPrice) {
      existingFuelPrice.price = price;
      existingFuelPrice.enteredBy = enteredBy; // Update enteredBy
      existingFuelPrice.updatedAt = Date.now(); // Update updatedAt
      await existingFuelPrice.save();
    } else {
      // Create a new FuelPrice document if it doesn't exist
      const newFuelPrice = new FuelPrice({
        fuelType,
        price,
        petrolStation: petrolStation._id,
        enteredBy,
      });

      // Save the new fuel price to the database
      await newFuelPrice.save();
    }

    // Update PetrolStation with latest fuel price
    const latestFuelPrice = await FuelPrice.findOne({ petrolStation: petrolStation._id })
      .sort({ updatedAt: -1 }) // Get the latest
      .limit(1);

    // Update PetrolStation's latestFuelPrice
    if (latestFuelPrice) {
      petrolStation.latestFuelPrice = latestFuelPrice.price;
      await petrolStation.save();
    }

    res.status(201).json({ message: 'Fuel price added successfully' });
  } catch (error) {
    console.error('Error adding fuel price:', error);
    res.status(500).json({ error: 'Error adding fuel price' });
  }
};


