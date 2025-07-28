import React from 'react';
import { Calendar, Clock, MapPin, Users, Edit, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface EventDetailsModalProps {
  event: Event | null;
  onClose: () => void;
  getStatusTextColor: (status: string) => string;
  formatTime: (timeString: string) => string;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  getStatusTextColor,
  formatTime
}) => {
  const navigate = useNavigate();
  
  if (!event) return null;

  const handleEditEvent = () => {
    // Navigate to the events page with edit=eventId parameter
    navigate(`/events?edit=${event._id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Event Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusTextColor(event.status)} bg-opacity-10`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          {event.description && (
            <div>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
            </div>

            {event.startTime && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{event.attendees.length} attendees</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleEditEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;