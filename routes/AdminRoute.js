// routes/fuelPriceRoutes.js

const express = require('express');
const router = express.Router();
const fuelPriceController = require('../controllers/fuelPriceController');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const { addImage } = require('../controllers/adminController');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Route for uploading image
  router.post('/addImg', upload.single('image'), addImage);
  

// Route to add a new fuel price
router.post('/help', authMiddleware, fuelPriceController.addFuelPrice);

// Route to update an existing fuel price
//router.put('/fuel-prices/:id', fuelPriceController.updateFuelPrice);

// Other routes for fetching or deleting fuel prices if needed

module.exports = router;
