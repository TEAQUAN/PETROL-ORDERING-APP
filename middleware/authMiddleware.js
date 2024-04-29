// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware function to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    // const token = req.header('Authorization');

    if (!req.header('Authorization')) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Verify token
   req.user = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    // const user = await User.findById(decoded.userId);

    // if (!user) {
    //   return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    // }

    // Attach user object to request for further processing
   // req.user = decoded;

    next(); // Call next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;
