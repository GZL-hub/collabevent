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
    <div className="space-y-6 px-2 sm:px-0">
      {/* Stats Grid - Fixed height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="h-[120px]"> {/* Fixed height container */}
            <StatsCard
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          </div>
        ))}
      </div>

      {/* Charts Grid - Fixed height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="h-[450px]"> {/* Fixed height container */}
          <div className="h-full overflow-hidden">
            <RevenueChart />
          </div>
        </div>
        <div className="h-[450px]"> {/* Fixed height container */}
          <div className="h-full overflow-hidden">
            <LatestEvents />
          </div>
        </div>
      </div>

      {/* Bottom Grid - Fixed height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="h-[450px]"> {/* Fixed height container */}
          <div className="h-full overflow-hidden">
            <EventCalendar />
          </div>
        </div>
        <div className="h-[450px]"> {/* Fixed height container */}
          <div className="h-full overflow-hidden">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;