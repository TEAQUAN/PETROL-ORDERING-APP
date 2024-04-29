// controllers/authController.js
const User = require('../models/User');

// exports.register = async (req, res) => {
//   try {
//     const { firstname,lastname,username, email, password, phone,} = req.body;
    
//     // Check if user with email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User with this email already exists' });
//     }

//     // Create new user
//     const newUser = new User({
//       firstname,
//       lastname,
//       username,
//       email,
//       password, // You would need to hash the password before saving
//       phone,
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };
exports.register = async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      phone,
      password, // Note: Password is not hashed here
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if provided password matches the user's password
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If password is valid, proceed with login
    res.json({ message: 'Login successful', user: user.toObject() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
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
