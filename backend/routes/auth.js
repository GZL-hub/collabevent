const express = require('express');
const router = express.Router();
const { login, getAllUsers } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

// @route   GET /api/auth/users
// @desc    Get all users (for testing)
router.get('/users', getAllUsers);

module.exports = router;