const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, updatePassword } = require('../controllers/userController');

// @route   GET /api/users/:id
// @desc    Get user profile by ID
router.get('/:id', getUserProfile);

// @route   PATCH /api/users/:id
// @desc    Update user profile
router.patch('/:id', updateProfile);

// @route   PUT /api/users/:id/password
// @desc    Update user password
router.put('/:id/password', updatePassword);

module.exports = router;