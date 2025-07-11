import React from 'react';

const NotificationsContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
    <div className="space-y-4">
      <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
        <p className="font-medium">Event Update</p>
        <p className="text-sm text-gray-600">The "Product Launch" event has been updated</p>
        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
      </div>
      <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
        <p className="font-medium">New Comment</p>
        <p className="text-sm text-gray-600">Sarah commented on "Quarterly Meeting"</p>
        <p className="text-xs text-gray-500 mt-1">Yesterday</p>
      </div>
    </div>
  </div>
);

export default NotificationsContent;