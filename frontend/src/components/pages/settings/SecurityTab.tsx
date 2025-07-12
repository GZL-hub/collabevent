import React, { useState } from 'react';
import { AlertCircle, Smartphone, Bell, Key, Eye, EyeOff, User } from 'lucide-react';
import ToggleSwitch from './components/ToggleSwitch';
import SaveButton from './SaveButton';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  department?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
}

interface SecurityTabProps {
  currentUser: User | null;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ currentUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: '30'
  });
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validatePassword = () => {
    // Clear previous error messages
    setError(null);
    
    // Check if passwords are empty
    if (!security.currentPassword) {
      setError('Current password is required');
      return false;
    }
    
    if (!security.newPassword) {
      setError('New password is required');
      return false;
    }
    
    // Check if new passwords match
    if (security.newPassword !== security.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    
    // Check password complexity
    if (security.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    // More complex validation (optional)
    const hasUppercase = /[A-Z]/.test(security.newPassword);
    const hasLowercase = /[a-z]/.test(security.newPassword);
    const hasNumber = /\d/.test(security.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(security.newPassword);
    
    if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
      setError('Password must include uppercase, lowercase, number, and special character');
      return false;
    }
    
    return true;
  };

  const handleChangePassword = async () => {
    if (!currentUser?._id) {
      setError('User ID not found. Please log in again.');
      return;
    }
    
    // Validate password
    if (!validatePassword()) {
      setSaveStatus('error');
      return;
    }
    
    // Set loading state
    setSaveStatus('saving');
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(`http://localhost:5001/api/users/${currentUser._id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }
      
      // Success
      setSuccessMessage('Password updated successfully');
      setSaveStatus('saved');
      
      // Clear password fields
      setSecurity({
        ...security,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating password');
      setSaveStatus('error');
      console.error('Error changing password:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    
      {/* Current User Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <User className="text-indigo-600" size={20} />
          <div>
            <h4 className="font-medium text-indigo-800">Current User</h4>
            <p className="text-sm text-indigo-700">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName} (${currentUser.email})` : 'No user logged in'}
            </p>
          </div>
        </div>
      </div>

      {/* Password Security Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-yellow-600" size={20} />
          <h4 className="font-medium text-yellow-800">Password Security</h4>
        </div>
        <p className="text-sm text-yellow-700 mt-2">
          Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
        </p>
      </div>

      {/* Change Password Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={security.currentPassword}
              onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={security.newPassword}
            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter new password"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={security.confirmPassword}
            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Confirm new password"
          />
        </div>

        {/* Replace button with SaveButton component */}
        <SaveButton 
          onSave={handleChangePassword}
          saveStatus={saveStatus}
        />
      </div>

      {/* Security Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Security Preferences</h3>
        <div className="space-y-3">
          <ToggleSwitch
            icon={Smartphone}
            iconColor="text-indigo-600"
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={security.twoFactorEnabled}
            onChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
          />

          <ToggleSwitch
            icon={Bell}
            iconColor="text-green-600"
            title="Login Notifications"
            description="Get notified when someone logs into your account"
            checked={security.loginNotifications}
            onChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
          />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="text-purple-600" size={20} />
              <div>
                <h4 className="font-medium text-gray-800">Session Timeout</h4>
                <p className="text-sm text-gray-600">Auto-logout after period of inactivity</p>
              </div>
            </div>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;