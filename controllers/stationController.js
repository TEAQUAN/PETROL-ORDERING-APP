// controllers/stationController.js
const PetrolStation = require('../models/PetrolStation');
const axios = require('axios');
const dotenv = require('dotenv');
require('dotenv').config();

exports.getAllStations = async (req, res) => {
  try {
    const { userLat, userLng } = req.query;

    // Example: Fetch all petrol stations from MongoDB
    const stations = await PetrolStation.find();

    // Calculate distance and travel time (dummy values for illustration)
    stations.forEach(station => {
      // Replace with your actual distance and travel time calculation
      station.distance = calculateDistance(userLat, userLng, station.latitude, station.longitude);
      station.duration = calculateTravelTime(station.distance); // Assuming you have a function to calculate travel time
    });

    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Dummy calculation for illustration, replace with actual calculation
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calculateTravelTime(distance) {
  // Dummy calculation for illustration, replace with actual calculation
  return (distance / 80) * 60; // Assuming 80 km/h average speed
}

exports.getStationById = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await PetrolStation.findById(id);
    
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.json(station);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getNearbyStations = async (req, res) => {
  try {
    const { longitude, latitude, radius } = req.query;

    // Validate longitude, latitude, and radius
    if (!longitude || !latitude || !radius) {
      return res.status(400).json({ error: 'Longitude, latitude, and radius are required.' });
    }

    // Check if longitude, latitude, and radius are valid numbers
    if (isNaN(parseFloat(longitude)) || isNaN(parseFloat(latitude)) || isNaN(parseInt(radius))) {
      return res.status(400).json({ error: 'Longitude, latitude, and radius must be valid numbers.' });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];

    // Query nearby stations using geospatial query
    const stations = await PetrolStation.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates,
          },
          $maxDistance: parseInt(radius) * 1000, // Convert radius to meters
        },
      },
    });

    res.json({ stations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;  // Convert degrees to radians
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

exports.fetchAndSaveStations = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate latitude and longitude
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    // Check if latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
    }

    const radius = 3000 ; // Default radius (in meters)
    const apiKey = process.env.API_KEY;


    // Make request to Google Maps Places API to fetch gas stations
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=gas_station&key=${apiKey}`
    );

    // Check if API request was successful
    if (response.status !== 200 || response.data.status !== 'OK') {
      console.error('Google Places API error:', response.data.error_message || response.statusText);
      throw new Error('Error fetching data from Google Places API.');
    }

    // Process API response and update or insert into the database
    const petrolStations = await Promise.all(
      response.data.results.map(async result => {
        // Fetch place details to get the photo reference
        const detailsResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&fields=name,formatted_address,rating,photos&key=${apiKey}`
        );

        // Check if details request was successful
        if (detailsResponse.status !== 200 || detailsResponse.data.status !== 'OK') {
          console.error('Google Places Details API error:', detailsResponse.data.error_message || detailsResponse.statusText);
          return null; // Skip this station if details request failed
        }

        const placeDetails = detailsResponse.data.result;
        const photoReference = placeDetails.photos && placeDetails.photos[0] ? placeDetails.photos[0].photo_reference : null;

        // Fetch Street View image URL
        const streetViewResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${result.geometry.location.lat},${result.geometry.location.lng}&key=${apiKey}`
        );

        const streetViewUrl = streetViewResponse.request.res.responseUrl; // Get the Street View image URL

        const img = '';

        return {
          name: placeDetails.name,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          formattedAddress: placeDetails.formatted_address,
          ratings: placeDetails.rating || 0,
          address: placeDetails.formatted_address,
          latestFuelPrice: 0,
          latestDieselPrice: 0, 
          photoReference: photoReference, // Store the photo reference
          streetViewUrl: streetViewUrl, // Store the Street View image URL
          img: img, // Store the img field
        };
      })
    );

    // Sort petrolStations by distance from user's location (closest first)
    petrolStations.sort((a, b) => {
      const distanceA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
      const distanceB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
      return distanceA - distanceB;
    });

    // Mark the closest petrol station as number 1
    if (petrolStations.length > 0) {
      petrolStations[0].closestToUser = true;
    }

    // Update or Insert petrol stations to MongoDB
    const bulkOps = petrolStations
      .filter(station => station !== null) // Remove any stations that were skipped
      .map(station => ({
        updateOne: {
          filter: { name: station.name },
          update: { $set: station },
          upsert: true // If station doesn't exist, insert it
        }
      }));

    // Perform bulk write operation for efficient updates/inserts
    const bulkResult = await PetrolStation.bulkWrite(bulkOps);

    res.json({ message: 'Stations fetched, sorted, and updated.', result: bulkResult });
  } catch (error) {
    console.error('Error fetching, sorting, and saving stations:', error);
    res.status(500).json({ error: 'Error fetching, sorting, and saving stations.' });
  }
};

// exports.fetchAndSaveStations = async (req, res) => {
//   try {
//     const { latitude, longitude } = req.query;

//     // Validate latitude and longitude
//     if (!latitude || !longitude) {
//       return res.status(400).json({ error: 'Latitude and longitude are required.' });
//     }

//     // Check if latitude and longitude are valid numbers
//     if (isNaN(latitude) || isNaN(longitude)) {
//       return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
//     }

//     const radius = 5000; // Default radius (in meters)
//     const apiKey = ''; // Replace with your Google Places API key

//     // Make request to Google Maps Places API
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=gas_station&key=${apiKey}`
//     );

//     // Check if API request was successful
//     if (response.status !== 200 || response.data.status !== 'OK') {
//       console.error('Google Places API error:', response.data.error_message || response.statusText);
//       throw new Error('Error fetching data from Google Places API.');
//     }

//     // Process API response and update or insert into the database
//     const petrolStations = response.data.results.map(result => {
//       return {
//         name: result.name,
//         latitude: result.geometry.location.lat,
//         longitude: result.geometry.location.lng,
//         formattedAddress: result.vicinity, // Address of the petrol station
//         ratings: result.rating || 0,
//         address: result.vicinity, // Address can be updated based on the API response
//         latestFuelPrice: 0, // You can set this to a default value or fetch from another source
//       };
//     });

//     // Update or Insert petrol stations to MongoDB
//     const bulkOps = petrolStations.map(station => ({
//       updateOne: {
//         filter: { name: station.name },
//         update: { $set: station },
//         upsert: true // If station doesn't exist, insert it
//       }
//     }));

//     // Perform bulk write operation for efficient updates/inserts
//     const bulkResult = await PetrolStation.bulkWrite(bulkOps);

//     res.json({ message: 'Stations fetched and updated.', result: bulkResult });
//   } catch (error) {
//     console.error('Error fetching and saving stations:', error);
//     res.status(500).json({ error: 'Error fetching and saving stations.' });
//   }
// };latest one



