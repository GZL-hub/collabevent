import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, AlertCircle, Copy, Check } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: { name: string; email: string; role: string; status: string }) => Promise<any>;
  availableRoles: string[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddUser, 
  availableRoles 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active',
    generatePassword: true,
    customPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Initialize role when available roles change
  useEffect(() => {
    if (availableRoles.length > 0 && !formData.role) {
      setFormData(prev => ({
        ...prev,
        role: availableRoles[0]
      }));
    }
  }, [availableRoles, formData.role]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        role: availableRoles[0] || '',
        status: 'Active',
        generatePassword: true,
        customPassword: ''
      });
      setErrors({});
      setIsSubmitting(false);
      setCreatedUser(null);
      setPasswordCopied(false);
    }
  }, [isOpen, availableRoles]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    // Custom password validation
    if (!formData.generatePassword && !formData.customPassword.trim()) {
      newErrors.customPassword = 'Please enter a password or use auto-generate';
    } else if (!formData.generatePassword && formData.customPassword.length < 6) {
      newErrors.customPassword = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        status: formData.status,
        ...(formData.customPassword && !formData.generatePassword && { password: formData.customPassword })
      };

      const result = await onAddUser(userData);
      
      if (result.data && result.data.tempPassword) {
        setCreatedUser(result.data);
        // Don't close modal immediately - show password first
      } else {
        // If no temp password returned, close modal normally
        handleClose();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const copyPassword = () => {
    if (createdUser?.tempPassword) {
      navigator.clipboard.writeText(createdUser.tempPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        role: availableRoles[0] || '',
        status: 'Active',
        generatePassword: true,
        customPassword: ''
      });
      setErrors({});
      setCreatedUser(null);
      setPasswordCopied(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Show password confirmation screen after user creation
  if (createdUser) {
    return (
      <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">User Created Successfully!</h3>
            <p className="text-sm text-gray-600 mt-2">Please share the temporary password with the user</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">User Details:</h4>
              <p className="text-sm text-gray-600">Name: {createdUser.name}</p>
              <p className="text-sm text-gray-600">Email: {createdUser.email}</p>
              <p className="text-sm text-gray-600">Role: {createdUser.role}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Temporary Password:</h4>
              <div className="flex items-center justify-between bg-white border rounded px-3 py-2">
                <code className="text-lg font-mono text-gray-800">{createdUser.tempPassword}</code>
                <button
                  onClick={copyPassword}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  {passwordCopied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{passwordCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                The user should change this password on their first login.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Add New User</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
                disabled={isSubmitting}
              />
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
                disabled={isSubmitting}
              />
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select a role</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <Shield size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {errors.role}
              </p>
            )}
          </div>

          {/* Password Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Setup
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="generatePassword"
                  checked={formData.generatePassword}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700">Auto-generate temporary password (Recommended)</span>
              </label>
              
              {!formData.generatePassword && (
                <div>
                  <input
                    type="password"
                    name="customPassword"
                    value={formData.customPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.customPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter custom password"
                    disabled={isSubmitting}
                  />
                  {errors.customPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.customPassword}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.role}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;