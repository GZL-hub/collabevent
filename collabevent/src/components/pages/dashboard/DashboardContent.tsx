import React from 'react';

import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import LatestEvents from './LatestEvents';
import EventCalendar from './EventCalendar';
import RecentActivity from './RecentActivity';

const DashboardContent: React.FC = () => {
  const statsData = [
    { title: "Total Events", value: 24, color: "text-indigo-600" },
    { title: "Upcoming Events", value: 8, color: "text-green-600" },
    { title: "Team Members", value: 12, color: "text-blue-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Revenue Chart and Latest Events - Equal Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <RevenueChart />
        </div>
        <div className="h-full">
          <LatestEvents />
        </div>
      </div>

      {/* Calendar and Recent Activity - Equal Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <EventCalendar />
        </div>
        <div className="h-full">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;