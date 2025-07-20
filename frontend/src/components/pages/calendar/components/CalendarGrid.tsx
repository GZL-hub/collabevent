import React from 'react';
import CalendarDay from './CalendarDay';

interface Event {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category?: string;
  attendees?: any[];
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

// ✅ Renamed interface to avoid conflict with component import
interface CalendarDayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

interface CalendarGridProps {
  calendarDays: CalendarDayData[];
  searchTerm: string;
  filterStatus: string;
  onEventClick: (event: Event) => void;
  getStatusColor: (status: string) => string;
  formatTime: (timeString: string) => string;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  searchTerm,
  filterStatus,
  onEventClick,
  getStatusColor,
  formatTime
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onEventClick={onEventClick}
            getStatusColor={getStatusColor}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;