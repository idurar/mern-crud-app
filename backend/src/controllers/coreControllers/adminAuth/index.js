const createAuthMiddleware = require('@/controllers/middlewaresControllers/createAuthMiddleware');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Fetch user model
    const User = mongoose.model('User'); // Update 'User' with your actual user model name

    // Find user by email
    const user = await User.findOne({ email, removed: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account with this email found.',
      });
    }

    // Check if the user is enabled
    if (!user.enabled) {
      return res.status(403).json({
        success: false,
        message: 'Your account is disabled. Contact the administrator.',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '1h' }
    );

    // Respond with token and user details
    res.status(200).json({
      success: true,
      result: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role, // Include other fields if needed
        },
      },
      message: 'Login successful!',
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

module.exports = login,createAuthMiddleware('Admin');
