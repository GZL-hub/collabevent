const express = require('express');
const router = express.Router();
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  getRoleStats
} = require('../controllers/roleController');

// @route   GET /api/roles
// @desc    Get all roles with filtering
// @query   ?isActive=true&isCustom=false
router.get('/', getAllRoles);

// @route   GET /api/roles/permissions
// @desc    Get available permissions list
router.get('/permissions', getRolePermissions);

// @route   GET /api/roles/stats
// @desc    Get role statistics
router.get('/stats', getRoleStats);

// @route   GET /api/roles/:id
// @desc    Get single role by ID
router.get('/:id', getRoleById);

// @route   POST /api/roles
// @desc    Create new role
router.post('/', createRole);

// @route   PUT /api/roles/:id
// @desc    Update role
router.put('/:id', updateRole);

// @route   DELETE /api/roles/:id
// @desc    Delete role (custom roles only)
router.delete('/:id', deleteRole);

module.exports = router;