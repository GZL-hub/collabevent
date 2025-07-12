const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
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
    console.log(`🔗 Connection State: Connected`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running and connected to MongoDB!',
    status: 'success'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access server at: http://localhost:${PORT}`);
});