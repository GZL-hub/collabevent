import React from 'react';

const SystemTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-4">Application Info</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">July 11, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-4">System Health</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Server Status:</span>
              <span className="font-medium text-green-600">Healthy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Users:</span>
              <span className="font-medium">247</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="font-semibold text-red-800 mb-4">Danger Zone</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-medium text-red-800">Export Data</h5>
              <p className="text-sm text-red-600">Download all your organization's data</p>
            </div>
            <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
              Export
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-medium text-red-800">Reset Settings</h5>
              <p className="text-sm text-red-600">Reset all settings to default values</p>
            </div>
            <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemTab;