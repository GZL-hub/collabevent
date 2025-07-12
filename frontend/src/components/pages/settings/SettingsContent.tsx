import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Users, 
  Settings as SettingsIcon
} from 'lucide-react';
import ProfileTab from './ProfileTab';
import SecurityTab from './SecurityTab';
import NotificationsTab from './NotficationsTab';
import UserManagementTab from './UserManagementTab';
import SystemTab from './SystemTab';
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

interface SettingsContentProps {
  currentUser: User | null;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'rbac', name: 'User Management', icon: Users },
    { id: 'system', name: 'System', icon: SettingsIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab currentUser={currentUser} />;
      case 'security':
        return <SecurityTab currentUser={currentUser} />;
      case 'notifications':
        return <NotificationsTab currentUser={currentUser} />;
      case 'rbac':
        return <UserManagementTab />;
      case 'system':
        return <SystemTab />;
      default:
        return <ProfileTab currentUser={currentUser} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account and application preferences
            {currentUser && (
              <span className="ml-2 text-sm">
                • Logged in as <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
              </span>
            )}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>

        {/* Save Button - Only show for certain tabs */}
        {(activeTab === 'profile' || activeTab === 'security' || activeTab === 'notifications') && (
          <SaveButton 
            onSave={handleSave} 
            saveStatus={saveStatus} 
          />
        )}
      </div>
    </div>
  );
};

export default SettingsContent;