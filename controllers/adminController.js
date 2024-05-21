const PetrolStation = require('../models/PetrolStation');

// Controller function to handle image upload
exports.addImage = async (req, res) => {
  try {
    const { petrolStationName: stationId } = req.body;

    // Check if the petrol station exists by ID
    const petrolStation = await PetrolStation.findById(stationId);
    if (!petrolStation) {
      return res.status(404).json({ error: 'Petrol station not found' });
    }

    // Update the petrol station with the image path
    petrolStation.img = req.file.path;
    await petrolStation.save();

    res.status(200).json({ message: 'Image uploaded successfully', path: req.file.path });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
};
