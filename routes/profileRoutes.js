// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// Protected routes - Require authentication
router.get('/profile', authMiddleware, profileController.getUserProfile);
router.get('/profile/orders', authMiddleware, profileController.getUserOrders);

module.exports = router;
