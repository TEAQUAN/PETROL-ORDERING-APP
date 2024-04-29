const FuelType = require('../models/FuelType');
const schema = require('../models/FuelType');

exports.createFuelType = async (req, res) => {
  try {
      const { name, description, price } = req.body;
      
     const validation = schema.validate({name, description, price})
     console.log(validation)

    // Create a new fuel type
    const newFuelType = new FuelType({
      name: name,
      price: price,
      description: description
    });

    // Save the fuel type to the database
    const savedFuelType = await newFuelType.save();

    res.status(201).json(savedFuelType);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
