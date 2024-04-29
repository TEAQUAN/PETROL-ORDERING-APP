

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Protected route - Logout
router.post('/logout', authController.logout);


// Verify email or phone number
router.post('/verify', authController.verify);

module.exports = router;





