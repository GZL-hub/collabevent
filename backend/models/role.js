const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  permissions: [{
    type: String,
    required: true,
    enum: [
      'user_create',
      'user_edit',
      'user_delete',
      'user_view',
      'event_create',
      'event_edit',
      'event_delete',
      'event_view',
      'team_create',
      'team_edit',
      'team_delete',
      'team_view',
      'analytics_view',
      'reports_generate',
      'reports_export',
      'settings_view',
      'settings_edit',
      'role_management'
    ]
  }],
  isCustom: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });
roleSchema.index({ isCustom: 1 });

// Prevent deletion of system roles
roleSchema.pre('findOneAndDelete', function() {
  this.where({ isCustom: true });
});

roleSchema.pre('deleteOne', function() {
  this.where({ isCustom: true });
});

// Specify the exact collection name to match your MongoDB
module.exports = mongoose.model('Role', roleSchema, 'roles');