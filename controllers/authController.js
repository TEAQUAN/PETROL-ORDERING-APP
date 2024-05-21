// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');



exports.register = async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword,roles  } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      phone,
      password, // Note: Password should be hashed before storing
      roles: roles || ['user']
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);

    res.status(201).json({ success: true, message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if provided password matches the user's password
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

   
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(token);

    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


exports.logout = async (req, res) => {
  // Placeholder for logout logic
  try {
    // Perform logout actions if needed
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.verify = async (req, res) => {
  // Placeholder for verification logic
  try {
    // Implement email or phone verification
    // For example, sending verification code via email or SMS
    res.json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
