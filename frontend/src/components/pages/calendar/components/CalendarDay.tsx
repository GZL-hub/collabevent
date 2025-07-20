import React from 'react';

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

interface CalendarDayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

interface CalendarDayProps {
  day: CalendarDayData;
  searchTerm: string;
  filterStatus: string;
  onEventClick: (event: Event) => void;
  getStatusColor: (status: string) => string;
  formatTime: (timeString: string) => string;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  searchTerm,
  filterStatus,
  onEventClick,
  getStatusColor,
  formatTime
}) => {
  const filteredEvents = day.events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className={`min-h-[120px] p-2 border-r border-b last:border-r-0 relative ${
        day.isToday 
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-gray-200' // ✅ Use box-shadow instead of border
          : !day.isCurrentMonth 
            ? 'bg-gray-50 border-gray-200' 
            : 'bg-white border-gray-200'
      }`}
      style={{
        ...(day.isToday && {
          boxShadow: 'inset 0 0 0 2px #3b82f6' // ✅ Consistent 2px blue border on all sides
        })
      }}
    >
      {/* Date with enhanced today styling */}
      <div className={`text-sm font-medium mb-1 relative z-10 ${
        day.isToday 
          ? 'text-white font-bold bg-blue-600 rounded-full w-7 h-7 flex items-center justify-center shadow-md'
          : day.isCurrentMonth 
            ? 'text-gray-900' 
            : 'text-gray-400'
      }`}>
        {day.date.getDate()}
      </div>

      {/* Events */}
      <div className="space-y-1 relative z-10">
        {filteredEvents
          .slice(0, 3)
          .map(event => (
            <div
              key={event._id}
              onClick={() => onEventClick(event)}
              className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(event.status)} text-white truncate`}
              title={event.title}
            >
              {event.startTime && (
                <span className="font-medium mr-1">
                  {formatTime(event.startTime)}
                </span>
              )}
              {event.title}
            </div>
          ))}
        
        {filteredEvents.length > 3 && (
          <div className="text-xs text-gray-500 pl-1">
            +{filteredEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;