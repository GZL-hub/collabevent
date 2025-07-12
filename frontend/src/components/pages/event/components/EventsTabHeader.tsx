import React from 'react';
import { Calendar } from 'lucide-react';

interface EventsTableHeaderProps {
  totalEvents: number;
}

const EventsTableHeader: React.FC<EventsTableHeaderProps> = ({ totalEvents }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">All Events ({totalEvents})</h2>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
        <Calendar className="mr-2" size={18} />
        Create New Event
      </button>
    </div>
  );
};

export default EventsTableHeader;