const User = require('../models/user');

// Simple login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password }); // Debug log
    
    // DEBUG: Check database connection and collections
    console.log('Database name:', User.db.name);
    console.log('Collection name:', User.collection.name);
    
    // DEBUG: Count total documents
    const totalUsers = await User.countDocuments({});
    console.log('Total users in collection:', totalUsers);
    
    // DEBUG: Get all users to see what's actually in the database
    const allUsers = await User.find({});
    console.log('All users in database:', allUsers);

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email); // Debug log
      
      // DEBUG: Try finding with different case
      const userLowerCase = await User.findOne({ email: email.toLowerCase() });
      console.log('User with lowercase search:', userLowerCase);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('User found:', user.email); // Debug log
    console.log('Password check:', { provided: password, stored: user.password }); // Debug log

    // Check if user is active
    if (user.status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Simple password check (plain text comparison)
    if (user.password !== password) {
      console.log('Password mismatch'); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return user data (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Login successful for:', user.email); // Debug log

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get all users (for testing)
exports.getAllUsers = async (req, res) => {
  try {
    console.log('Getting all users...');
    console.log('Database name:', User.db.name);
    console.log('Collection name:', User.collection.name);
    
    const users = await User.find({});
    console.log('Retrieved users:', users);
    console.log('Number of users found:', users.length);
    
    res.json({
      success: true,
      users,
      count: users.length,
      database: User.db.name,
      collection: User.collection.name
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};