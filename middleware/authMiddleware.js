const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

const authMiddleware = async (req, res, next) => {
    try {
        // Check if Authorization header is present and in the correct format
        const authHeader = req.headers.authorization;
        //
        if (!(authHeader && authHeader.startsWith('Bearer '))) {
            return res.status(401).json({ message: 'Authorization header is missing or not in the correct format' });
        }
        const token = authHeader.split(' ')[1];
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Check if user exists in the database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next(); // Call the next middleware or route handler
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired' });
        }
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authMiddleware;
