// controllers/orderController.js
const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  const { user, items, paymentReference } = req.body;

  try {
      // Prepare order items
      const orderItems = items.map(item => ({
          user: user,
          station: item.station,
          fuelType: item.fuelType,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          paymentReference: paymentReference
      }));

      // Save all order items to the database
      await Order.insertMany(orderItems);

      // Respond with success message
      res.json({ success: true, message: 'Order saved successfully' });
  } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ success: false, message: 'Failed to save order' });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  console.log(userId)

  try {
      // Fetch orders for userId from your database or data source
      const orders = await Order.find({ user: userId });

      res.json(orders); // Respond with orders in JSON format
  } catch (error) {
      console.error('Error fetching orders:', error.message);
      res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated order
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
