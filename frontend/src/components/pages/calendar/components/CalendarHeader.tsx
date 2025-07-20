import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Search } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  searchTerm: string;
  filterStatus: string;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: string) => void;
  onCreateEvent: () => void;
  getStatusColor: (status: string) => string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  searchTerm,
  filterStatus,
  onNavigateMonth,
  onGoToToday,
  onSearchChange,
  onFilterChange,
  onCreateEvent,
  getStatusColor
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Event Calendar</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800 min-w-[180px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => onNavigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoToToday}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={onCreateEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="font-medium text-gray-600">Status:</span>
        {[
          { status: 'upcoming', label: 'Upcoming' },
          { status: 'ongoing', label: 'Ongoing' },
          { status: 'completed', label: 'Completed' },
          { status: 'cancelled', label: 'Cancelled' }
        ].map(({ status, label }) => (
          <div key={status} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;