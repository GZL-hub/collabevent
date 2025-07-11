import React from 'react';

const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Total Events</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Upcoming Events</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Team Members</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Today, 10:30 AM</p>
            <p className="text-gray-800">Jane updated "Product Launch" event details</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Yesterday, 2:15 PM</p>
            <p className="text-gray-800">New event "Team Building" created by Mark</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Yesterday, 11:00 AM</p>
            <p className="text-gray-800">Sarah commented on "Quarterly Meeting"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;