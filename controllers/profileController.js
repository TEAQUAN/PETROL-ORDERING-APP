// controllers/profileController.js
const User = require('../models/User');
const Order = require('../models/Order');

const getUserProfile = async (req, res) => {
  try {
    // Assuming you have user ID from authentication middleware
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    // Assuming you have user ID from authentication middleware
    const userId = req.user.id;

    const orders = await Order.find({ user: userId });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUserProfile,
  getUserOrders
}