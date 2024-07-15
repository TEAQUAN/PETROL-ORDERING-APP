const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const PetrolStation = require('../models/PetrolStation');

// Controller function to handle image upload
exports.addImage = async (req, res) => {
    try {
        const { petrolStationName } = req.body;

        // Use a case-insensitive regular expression to find petrol stations with the given name
        const petrolStations = await PetrolStation.find({ name: { $regex: new RegExp(`^${petrolStationName}`, 'i') } });
        
        if (!petrolStations || petrolStations.length === 0) {
            return res.status(404).json({ error: 'Petrol stations not found' });
        }

        const imagePath = req.file.path;
        const resizedImagePath = path.join(path.dirname(imagePath), 'resized-' + path.basename(imagePath));

        // Resize the image if it exceeds the allowed dimensions
        const image = await Jimp.read(imagePath);
        const resizedImage = image.resize(300, Jimp.AUTO); // Adjust width and maintain aspect ratio

        await resizedImage.writeAsync(resizedImagePath);

        // Update all petrol stations with the given name
        const updatePromises = petrolStations.map(station => {
            station.img = resizedImagePath;
            return station.save();
        });

        await Promise.all(updatePromises);

        // Remove the original file after resizing
        fs.unlinkSync(imagePath);

        res.status(200).json({ message: 'Images uploaded and resized successfully', path: resizedImagePath });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
};
