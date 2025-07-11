import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

interface EventLocation {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  description: string;
}

const LatestEvents: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const eventLocations: EventLocation[] = [
    { 
      id: 1, 
      name: 'Product Launch', 
      location: 'San Francisco', 
      date: 'July 15, 2025',
      time: '10:00 AM',
      attendees: 150,
      description: 'Launching our new product line with live demonstrations'
    },
    { 
      id: 2, 
      name: 'Team Building', 
      location: 'New York', 
      date: 'July 20, 2025',
      time: '9:00 AM',
      attendees: 45,
      description: 'Annual team building activities and workshops'
    },
    { 
      id: 3, 
      name: 'Conference', 
      location: 'Los Angeles', 
      date: 'July 25, 2025',
      time: '2:00 PM',
      attendees: 300,
      description: 'Tech conference with industry leaders and keynote speakers'
    },
    { 
      id: 4, 
      name: 'Workshop', 
      location: 'Chicago', 
      date: 'July 30, 2025',
      time: '11:00 AM',
      attendees: 80,
      description: 'Hands-on workshop for skill development'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Events</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events List */}
        <div className="space-y-3">
          {eventLocations.map((event, index) => (
            <div 
              key={event.id} 
              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedEvent === event.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    selectedEvent === event.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{event.name}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={12} />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium ml-2">
                  Details
                </button>
              </div>
              
              {/* Expanded event details */}
              {selectedEvent === event.id && (
                <div className="mt-3 pt-3 border-t border-indigo-200">
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
                      Edit Event
                    </button>
                    <button className="px-3 py-1 border border-indigo-600 text-indigo-600 text-xs rounded hover:bg-indigo-50">
                      View Full Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

       {/* Map Section */}
        <div className="space-y-4">
          <div className="relative">
            <img 
              src="/images/fakemap.png"
              alt="Event Locations Map"
              className="w-full h-64 object-cover rounded-lg border"
            />
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow text-xs font-medium">
              Event Locations
            </div>
            
            {/* Fake map pins overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Pin A - San Francisco */}
              <div className="absolute top-4 left-8">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  selectedEvent === 1 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  A
                </div>
              </div>
              
              {/* Pin B - New York */}
              <div className="absolute top-8 right-12">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  selectedEvent === 2 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  B
                </div>
              </div>
              
              {/* Pin C - Los Angeles */}
              <div className="absolute bottom-12 left-12">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  selectedEvent === 3 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  C
                </div>
              </div>
              
              {/* Pin D - Chicago */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  selectedEvent === 4 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  D
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Legend */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Event Locations</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {eventLocations.map((event, index) => (
                <div 
                  key={event.id} 
                  className={`flex items-center space-x-2 p-1 rounded cursor-pointer transition-colors ${
                    selectedEvent === event.id ? 'bg-indigo-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold ${
                    selectedEvent === event.id 
                      ? 'bg-red-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-600 truncate">{event.name} - {event.location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Instructions */}
          <div className="text-xs text-gray-500 text-center bg-gray-50 p-2 rounded">
            <p>Click on events to highlight them on the map</p>
            <p className="mt-1">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              Normal event
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-3 mr-1"></span>
              Selected event
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestEvents;