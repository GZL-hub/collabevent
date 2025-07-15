import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Event } from '../types/event';

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (eventId: string) => void;
  event: Event | null;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  event 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !event) return null;

  const handleConfirm = async () => {
    const eventId = event._id || event.id;
    if (!eventId) return;

    setIsDeleting(true);
    try {
      await onConfirm(eventId);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Event</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="flex items-center space-x-3 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium">This action cannot be undone.</p>
              <p>The event will be permanently deleted from the system.</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Event Details:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Title:</span> {event.title}
              </div>
              <div>
                <span className="font-medium">Date:</span> {formatDate(event.startDate)}
              </div>
              <div>
                <span className="font-medium">Time:</span> {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </div>
              <div>
                <span className="font-medium">Location:</span> {event.location}
              </div>
              <div>
                <span className="font-medium">Assignee:</span> {event.assignee.name}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                  event.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete "<strong>{event.title}</strong>"? 
            This will permanently remove the event and all associated data.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;