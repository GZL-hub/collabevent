import React from 'react';

const TeamActivityContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Activity Log</h2>
    <div className="space-y-6">
      <div className="border-b pb-4">
        <p className="text-sm text-gray-500">July 8, 2025</p>
        <div className="mt-2 space-y-3">
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">JD</div>
            <div>
              <p className="text-gray-800">Jane updated "Product Launch" event details</p>
              <p className="text-xs text-gray-500">10:30 AM</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium mr-3">TS</div>
            <div>
              <p className="text-gray-800">Tom added a comment to "Customer Webinar"</p>
              <p className="text-xs text-gray-500">9:15 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b pb-4">
        <p className="text-sm text-gray-500">July 7, 2025</p>
        <div className="mt-2 space-y-3">
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium mr-3">MS</div>
            <div>
              <p className="text-gray-800">Mark created "Team Building" event</p>
              <p className="text-xs text-gray-500">2:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TeamActivityContent;