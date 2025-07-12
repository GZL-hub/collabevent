import React from 'react';
import { Filter } from 'lucide-react';

interface EventsSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

const EventsSearch: React.FC<EventsSearchProps> = ({ value, onChange, resultCount }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search events..."
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <Filter size={18} />
        </div>
      </div>
      
      <div className="flex items-center">
        <span className="text-sm text-gray-600 mr-2">
          {resultCount} Events
        </span>
      </div>
    </div>
  );
};

export default EventsSearch;