import React, { useState } from 'react';
import { useCalendar } from './hooks/useCalendar';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import EventDetailsModal from './components/EventDetailsModal';
import CreateEventModal from './components/CreateEventModal';
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

const CalendarContent: React.FC = () => {
  const {
    currentDate,
    events,
    loading,
    error,
    getCalendarDays,
    navigateMonth,
    goToToday,
    getStatusColor,
    getStatusTextColor,
    formatTime
  } = useCalendar();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);

  const calendarDays = getCalendarDays();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onNavigateMonth={navigateMonth}
        onGoToToday={goToToday}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilterStatus}
        onCreateEvent={() => setShowEventModal(true)}
        getStatusColor={getStatusColor}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600">{error}</div>
        </div>
      )}

      {/* Calendar Grid */}
      <CalendarGrid
        calendarDays={calendarDays}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onEventClick={setSelectedEvent}
        getStatusColor={getStatusColor}
        formatTime={formatTime}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        getStatusTextColor={getStatusTextColor}
        formatTime={formatTime}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
};

export default CalendarContent;