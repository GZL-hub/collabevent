const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/userController');

// @route   GET /api/users/:id
// @desc    Get user profile by ID
router.get('/:id', getUserProfile);

// @route   PATCH /api/users/:id
// @desc    Update user profile
router.patch('/:id', updateProfile);

module.exports = router;