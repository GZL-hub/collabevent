import React, { useState } from 'react';
import { Mail, Smartphone, Bell, Users, AlertCircle, Database } from 'lucide-react';
import ToggleSwitch from './components/ToggleSwitch';
const NotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    teamUpdates: true,
    systemAlerts: true,
    weeklyReports: false
  });

  const notificationItems = [
    { key: 'emailNotifications', icon: Mail, title: 'Email Notifications', desc: 'Receive notifications via email' },
    { key: 'pushNotifications', icon: Smartphone, title: 'Push Notifications', desc: 'Browser and mobile push notifications' },
    { key: 'eventReminders', icon: Bell, title: 'Event Reminders', desc: 'Get reminded about upcoming events' },
    { key: 'teamUpdates', icon: Users, title: 'Team Updates', desc: 'Notifications about team activities' },
    { key: 'systemAlerts', icon: AlertCircle, title: 'System Alerts', desc: 'Important system notifications' },
    { key: 'weeklyReports', icon: Database, title: 'Weekly Reports', desc: 'Weekly activity summaries' }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
        <p className="text-gray-600">Choose what notifications you want to receive</p>
        
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
    </div>
  );
};

export default NotificationsTab;