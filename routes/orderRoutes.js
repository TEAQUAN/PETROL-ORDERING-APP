// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

// Protected routes - Require authentication
router.post('/orders', authMiddleware, orderController.placeOrder);
router.get('/orders/:id', authMiddleware, orderController.getOrderById);
router.patch('/orders/:id/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
