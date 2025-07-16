const express = require('express');
const router = express.Router();
const { 
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile, 
  updateProfile, 
  updatePassword 
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users with filtering and pagination
// @query   ?status=Active&role=Administrator&page=1&limit=10
router.get('/', getAllUsers);

// @route   POST /api/users
// @desc    Create new user
router.post('/', createUser);

// @route   GET /api/users/:id
// @desc    Get user profile by ID
router.get('/:id', getUserProfile);

// @route   PUT /api/users/:id
// @desc    Update user (admin function)
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
router.delete('/:id', deleteUser);

// @route   PATCH /api/users/:id
// @desc    Update user profile (self-service)
router.patch('/:id', updateProfile);

// @route   PUT /api/users/:id/password
// @desc    Update user password
router.put('/:id/password', updatePassword);

module.exports = router;