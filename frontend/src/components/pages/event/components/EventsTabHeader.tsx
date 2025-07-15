import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface EventsTableHeaderProps {
  totalEvents: number;
  onCreateEvent: () => void;
}

const EventsTableHeader: React.FC<EventsTableHeaderProps> = ({ 
  totalEvents, 
  onCreateEvent 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-600">
            Manage and organize your events ({totalEvents} total)
          </p>
        </div>
      </div>
      
      <button
        onClick={onCreateEvent}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus size={20} className="mr-2" />
        Create Event
      </button>
    </div>
  );
};

export default EventsTableHeader;