import React, { useState } from 'react';
import { AlertCircle, Smartphone, Bell, Key, Eye, EyeOff } from 'lucide-react';
import ToggleSwitch from './components/ToggleSwitch';

const SecurityTab: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-yellow-600" size={20} />
          <h4 className="font-medium text-yellow-800">Password Security</h4>
        </div>
        <p className="text-sm text-yellow-700 mt-2">
          Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={security.currentPassword}
              onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={security.confirmPassword}
            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Security Preferences</h3>
        <div className="space-y-3">
          <ToggleSwitch
            icon={Smartphone}
            iconColor="text-blue-600"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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