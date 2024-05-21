const FuelPrice = require('../models/FuelPrice');
const PetrolStation = require('../models/PetrolStation');


// Controller function to add a new fuel price for a specific fuel type at a petrol station
exports.addFuelPrice = async (req, res) => {
  console.log("<< GET Logged In User >>", req.user.roles[0]);

  try {
    const { fuelType, price, petrolStationName: stationId, enteredBy } = req.body;
    console.log(req.body);

    // Check if the fuel type is valid
    const validFuelTypes = ['Petrol', 'Diesel', 'Premium', 'LPG']; // Add more if needed
    if (!validFuelTypes.includes(fuelType)) {
      return res.status(400).json({ error: 'Invalid fuel type' });
    }

    // Check if the petrol station exists by ID
    const petrolStation = await PetrolStation.findById(stationId);
    console.log("Petrol Station Found:", stationId, petrolStation);
    if (!petrolStation) {
      return res.status(404).json({ error: 'Petrol station not found' });
    }

    // Upsert the fuel price
    await FuelPrice.updateOne(
      { fuelType, petrolStation: stationId },
      {
        fuelType,
        price,
        enteredBy
      },
      { new: true, upsert: true }
    );

    // Update the latest price on the petrol station
    if (fuelType === 'Petrol') {
      petrolStation.latestFuelPrice = price;
    } else if (fuelType === 'Diesel') {
      petrolStation.latestDieselPrice = price;
    }
    await petrolStation.save();

    res.status(201).json({ message: 'Fuel price added successfully' });
  } catch (error) {
    console.error('Error adding fuel price:', error);
    res.status(500).json({ error: 'Error adding fuel price' });
  }
};
