import React, { useState } from 'react';
import { Mail, Smartphone, Bell, Users, AlertCircle, Database, User } from 'lucide-react';
import ToggleSwitch from './components/ToggleSwitch';

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

interface NotificationsTabProps {
  currentUser: User | null;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ currentUser }) => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    teamUpdates: true,
    systemAlerts: true,
    weeklyReports: false
  });

  const notificationItems = [
    { 
      key: 'emailNotifications', 
      icon: Mail, 
      title: 'Email Notifications', 
      desc: `Send notifications to ${currentUser?.email || 'your email'}` 
    },
    { 
      key: 'pushNotifications', 
      icon: Smartphone, 
      title: 'Push Notifications', 
      desc: 'Browser and mobile push notifications' 
    },
    { 
      key: 'eventReminders', 
      icon: Bell, 
      title: 'Event Reminders', 
      desc: 'Get reminded about upcoming events you\'re involved in' 
    },
    { 
      key: 'teamUpdates', 
      icon: Users, 
      title: 'Team Updates', 
      desc: `Notifications about ${currentUser?.department || 'your team'} activities` 
    },
    { 
      key: 'systemAlerts', 
      icon: AlertCircle, 
      title: 'System Alerts', 
      desc: 'Important system notifications and maintenance updates' 
    },
    { 
      key: 'weeklyReports', 
      icon: Database, 
      title: 'Weekly Reports', 
      desc: 'Weekly activity summaries and analytics' 
    }
  ];

  const handleSaveNotifications = () => {
    // TODO: Implement API call to save notification preferences
    console.log('Saving notifications for user:', currentUser?.email);
    console.log('Notification preferences:', notifications);
    alert('Notification preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Current User Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <User className="text-blue-600" size={20} />
          <div>
            <h4 className="font-medium text-blue-800">Notification Settings For</h4>
            <p className="text-sm text-blue-700">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName} (${currentUser.email})` : 'No user logged in'}
            </p>
            {currentUser?.role && (
              <p className="text-xs text-blue-600 mt-1">
                Role: {currentUser.role} | Department: {currentUser.department || 'N/A'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
            <p className="text-gray-600">Choose what notifications you want to receive</p>
          </div>
          <button
            onClick={handleSaveNotifications}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Save Preferences
          </button>
        </div>
        
        <div className="space-y-3">
          {notificationItems.map((item) => (
            <ToggleSwitch
              key={item.key}
              icon={item.icon}
              iconColor="text-blue-600"
              title={item.title}
              description={item.desc}
              checked={notifications[item.key as keyof typeof notifications]}
              onChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
            />
          ))}
        </div>
      </div>

      {/* Email Preview */}
      {notifications.emailNotifications && currentUser?.email && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Email Notifications Enabled</h4>
          <p className="text-sm text-green-700">
            Notifications will be sent to: <span className="font-medium">{currentUser.email}</span>
          </p>
          <p className="text-xs text-green-600 mt-1">
            You can update your email address in the Profile tab.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;