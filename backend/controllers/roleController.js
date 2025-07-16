const Role = require('../models/role');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const { isActive, isCustom } = req.query;
    
    // Build filter object
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isCustom !== undefined) filter.isCustom = isCustom === 'true';
    
    const roles = await Role.find(filter).sort({ name: 1 });
    
    res.json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roles'
    });
  }
};

// Get single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    
    const role = await Role.findById(roleId);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching role'
    });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    
    // Validate required fields
    if (!name || !description || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and permissions array are required'
      });
    }
    
    if (permissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one permission is required'
      });
    }
    
    // Check if role name already exists
    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }
    
    // Create new role
    const newRole = new Role({
      name: name.trim(),
      description: description.trim(),
      permissions,
      isCustom: true,
      isActive: true
    });
    
    const savedRole = await newRole.save();
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: savedRole
    });
  } catch (error) {
    console.error('Error creating role:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Role name must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating role'
    });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { name, description, permissions, isActive } = req.body;
    
    // Find the role first
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Prevent updating system roles (non-custom roles)
    if (!role.isCustom) {
      return res.status(403).json({
        success: false,
        message: 'System roles cannot be modified'
      });
    }
    
    // Build update object
    const updateData = {};
    if (name) {
      // Check if new name conflicts with existing role
      const existingRole = await Role.findOne({ 
        name: name.trim(), 
        _id: { $ne: roleId } 
      });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
      updateData.name = name.trim();
    }
    if (description) updateData.description = description.trim();
    if (permissions && Array.isArray(permissions)) {
      if (permissions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one permission is required'
        });
      }
      updateData.permissions = permissions;
    }
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole
    });
  } catch (error) {
    console.error('Error updating role:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format'
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Role name must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating role'
    });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    
    // Find the role first
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Prevent deleting system roles
    if (!role.isCustom) {
      return res.status(403).json({
        success: false,
        message: 'System roles cannot be deleted'
      });
    }
    
    // Check if role is assigned to any users
    const User = require('../models/user');
    const usersWithRole = await User.countDocuments({ role: role.name });
    
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role`
      });
    }
    
    await Role.findByIdAndDelete(roleId);
    
    res.json({
      success: true,
      message: 'Role deleted successfully',
      data: role
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting role'
    });
  }
};

// Get role permissions
exports.getRolePermissions = async (req, res) => {
  try {
    const availablePermissions = [
      { id: 'user_create', label: 'Create Users', category: 'User Management' },
      { id: 'user_edit', label: 'Edit Users', category: 'User Management' },
      { id: 'user_delete', label: 'Delete Users', category: 'User Management' },
      { id: 'user_view', label: 'View Users', category: 'User Management' },
      { id: 'event_create', label: 'Create Events', category: 'Event Management' },
      { id: 'event_edit', label: 'Edit Events', category: 'Event Management' },
      { id: 'event_delete', label: 'Delete Events', category: 'Event Management' },
      { id: 'event_view', label: 'View Events', category: 'Event Management' },
      { id: 'team_create', label: 'Create Teams', category: 'Team Management' },
      { id: 'team_edit', label: 'Edit Teams', category: 'Team Management' },
      { id: 'team_delete', label: 'Delete Teams', category: 'Team Management' },
      { id: 'team_view', label: 'View Teams', category: 'Team Management' },
      { id: 'analytics_view', label: 'View Analytics', category: 'Analytics & Reports' },
      { id: 'reports_generate', label: 'Generate Reports', category: 'Analytics & Reports' },
      { id: 'reports_export', label: 'Export Reports', category: 'Analytics & Reports' },
      { id: 'settings_view', label: 'View Settings', category: 'System Settings' },
      { id: 'settings_edit', label: 'Edit Settings', category: 'System Settings' },
      { id: 'role_management', label: 'Manage Roles', category: 'System Settings' }
    ];
    
    res.json({
      success: true,
      data: availablePermissions
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching permissions'
    });
  }
};

// Get role statistics
exports.getRoleStats = async (req, res) => {
  try {
    const User = require('../models/user');
    
    const totalRoles = await Role.countDocuments();
    const activeRoles = await Role.countDocuments({ isActive: true });
    const customRoles = await Role.countDocuments({ isCustom: true });
    
    // Get role usage statistics
    const roleUsage = await User.aggregate([
      {
        $group: {
          _id: '$role',
          userCount: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalRoles,
        activeRoles,
        customRoles,
        systemRoles: totalRoles - customRoles,
        roleUsage
      }
    });
  } catch (error) {
    console.error('Error fetching role statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};