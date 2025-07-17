const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); 
const eventRoutes = require('./routes/event');
const roleRoutes = require('./routes/role');
const activityRoutes = require('./routes/activities');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database Host: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/activities', activityRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CollabEvent API Server is running!',
    status: 'success',
    availableRoutes: [
      'GET /api/auth/login',
      'GET /api/auth/users',
      'GET /api/events',
      'POST /api/events',
      'GET /api/events/:id',
      'PUT /api/events/:id',
      'DELETE /api/events/:id',
      'GET /api/roles',
      'POST /api/roles',
      'GET /api/roles/:id',
      'PUT /api/roles/:id',
      'DELETE /api/roles/:id',
      'GET /api/roles/permissions',
      'GET /api/roles/stats',
      'GET /api/activities',
      'POST /api/activities',
      'GET /api/activities/:id',
      'PUT /api/activities/:id',
      'DELETE /api/activities/:id',
      'POST /api/activities/:id/like',
      'PUT /api/activities/:id/pin',
      'POST /api/activities/:id/reply',
      'GET /api/activities/stats'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access server at: http://localhost:${PORT}`);
});