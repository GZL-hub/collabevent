import React, { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Calendar as CalendarIcon } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const EventCalendar: React.FC = () => {
  // Add custom CSS on component mount
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .rbc-calendar {
        font-family: inherit;
        height: 100%;
      }
      
      .rbc-header {
        padding: 4px 2px;
        font-size: 12px;
        font-weight: 500;
        color: #6B7280;
        border-bottom: 1px solid #E5E7EB;
      }
      
      .rbc-date-cell {
        padding: 2px;
        font-size: 12px;
      }
      
      .rbc-today {
        background-color: #EEF2FF !important;
      }
      
      .rbc-off-range-bg {
        background-color: #F9FAFB;
      }
      
      .rbc-event {
        border-radius: 4px;
        font-size: 10px;
        margin: 1px;
        padding: 1px 3px;
      }
      
      .rbc-month-view {
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        flex: 1;
        min-height: 0;
      }
      
      .rbc-day-bg:hover {
        background-color: #F3F4F6;
      }

      .rbc-month-row {
        overflow: hidden;
        min-height: 0;
      }

      .rbc-toolbar {
        flex-wrap: wrap;
      }

      .rbc-toolbar-label {
        font-size: 14px;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Event data with dates
  const events = [
    {
      id: 1,
      title: 'Product Launch',
      start: new Date(2025, 6, 15, 10, 0), // July 15, 2025, 10:00 AM
      end: new Date(2025, 6, 15, 12, 0),
      resource: { 
        attendees: 150,
        location: 'San Francisco',
        type: 'launch'
      }
    },
    {
      id: 2,
      title: 'Team Building',
      start: new Date(2025, 6, 20, 9, 0), // July 20, 2025, 9:00 AM
      end: new Date(2025, 6, 20, 17, 0),
      resource: { 
        attendees: 45,
        location: 'New York',
        type: 'team'
      }
    },
    {
      id: 3,
      title: 'Conference',
      start: new Date(2025, 6, 25, 14, 0), // July 25, 2025, 2:00 PM
      end: new Date(2025, 6, 25, 18, 0),
      resource: { 
        attendees: 300,
        location: 'Los Angeles',
        type: 'conference'
      }
    },
    {
      id: 4,
      title: 'Workshop',
      start: new Date(2025, 6, 30, 11, 0), // July 30, 2025, 11:00 AM
      end: new Date(2025, 6, 30, 15, 0),
      resource: { 
        attendees: 80,
        location: 'Chicago',
        type: 'workshop'
      }
    }
  ];

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    const eventTypeColors = {
      launch: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
      team: { backgroundColor: '#10B981', borderColor: '#059669' },
      conference: { backgroundColor: '#F59E0B', borderColor: '#D97706' },
      workshop: { backgroundColor: '#8B5CF6', borderColor: '#7C3AED' }
    };

    const colors = eventTypeColors[event.resource?.type as keyof typeof eventTypeColors] || 
                  { backgroundColor: '#6B7280', borderColor: '#4B5563' };

    return {
      style: {
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        fontSize: '11px',
        padding: '1px 3px'
      }
    };
  };

  // Custom date cell styling to highlight today
  const dayPropGetter = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return {
        style: {
          backgroundColor: '#EEF2FF', // Light indigo background for today
          border: '2px solid #4F46E5', // Indigo border for today
          borderRadius: '4px'
        }
      };
    }
    return {};
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Event Calendar</h2>
        <CalendarIcon className="text-indigo-600" size={20} />
      </div>
      
      <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1, minHeight: 0 }}
          views={['month']}
          defaultView="month"
          toolbar={true}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter}
          popup={true}
          popupOffset={30}
          components={{
            toolbar: ({ label, onNavigate }) => (
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('PREV')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ←
                  </button>
                  <h3 className="font-medium text-gray-800 text-sm">{label}</h3>
                  <button
                    onClick={() => onNavigate('NEXT')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    →
                  </button>
                </div>
                <button
                  onClick={() => onNavigate('TODAY')}
                  className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Today
                </button>
              </div>
            )
          }}
        />
      </div>
      
      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs border-t border-gray-100 pt-2">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-indigo-600 rounded"></div>
          <span className="text-gray-600">Product Launch</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Team Building</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Conference</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-gray-600">Workshop</span>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;