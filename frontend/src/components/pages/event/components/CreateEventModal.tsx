import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Clock, User } from 'lucide-react';
import { Event } from '../types/event';
import TimePickerInput from './TimePickerInput';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<Event, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: {
    title: string;
    eventDate: string; // Changed from startDate/endDate to single eventDate
    startTime: string;
    endTime: string;
    location: string;
    attendeeType: Event['attendeeType'];
    status: Event['status'];
    assigneeName: string;
    assigneeId: string;
    assigneeInitials?: string;
    assigneeAvatarColor?: string;
  };
  mode?: 'create' | 'edit';
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    eventDate: '', // Single date field
    startTime: '',
    endTime: '',
    location: '',
    attendeeType: 'RSVP' as Event['attendeeType'],
    status: 'Upcoming' as Event['status'],
    assigneeName: '',
    assigneeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode - populate with existing data
        setFormData({
          title: initialData.title,
          eventDate: initialData.eventDate,
          startTime: initialData.startTime,
          endTime: initialData.endTime,
          location: initialData.location,
          attendeeType: initialData.attendeeType,
          status: initialData.status,
          assigneeName: initialData.assigneeName,
          assigneeId: initialData.assigneeId,
        });
      } else {
        // Create mode - reset to default values
        setFormData({
          title: '',
          eventDate: '',
          startTime: '',
          endTime: '',
          location: '',
          attendeeType: 'RSVP',
          status: 'Upcoming',
          assigneeName: '',
          assigneeId: '',
        });
      }
      // Clear any existing errors when modal opens
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.assigneeName.trim()) newErrors.assigneeName = 'Assignee is required';

    // Validate that end time is after start time (same date)
    if (formData.startTime && formData.endTime) {
      const startTime = formData.startTime;
      const endTime = formData.endTime;
      
      if (endTime <= startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // For edit mode, preserve existing initials and avatar color if available
      let initials = '';
      let avatarColor = '';

      if (mode === 'edit' && initialData?.assigneeInitials && initialData?.assigneeAvatarColor) {
        initials = initialData.assigneeInitials;
        avatarColor = initialData.assigneeAvatarColor;
      } else {
        // Generate initials from name
        const nameParts = formData.assigneeName.trim().split(' ');
        initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
        
        // Generate random avatar color
        const colors = ['indigo', 'blue', 'purple', 'green', 'pink', 'yellow', 'red'];
        avatarColor = colors[Math.floor(Math.random() * colors.length)];
      }

      const eventData: Omit<Event, '_id' | 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title.trim(),
        startDate: new Date(`${formData.eventDate}T${formData.startTime}`),
        endDate: new Date(`${formData.eventDate}T${formData.endTime}`), // Same date, different time
        location: formData.location.trim(),
        attendeeType: formData.attendeeType,
        status: formData.status,
        assignee: {
          id: formData.assigneeId || Date.now().toString(),
          name: formData.assigneeName.trim(),
          initials,
          avatarColor,
        }
      };

      await onSubmit(eventData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      location: '',
      attendeeType: 'RSVP',
      status: 'Upcoming',
      assigneeName: '',
      assigneeId: '',
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter event title"
              disabled={isSubmitting}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Date and Time Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Event Date & Time
            </h3>
            
            {/* Event Date */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Date *</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.eventDate ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Time */}
              <div>
                <TimePickerInput
                  value={formData.startTime}
                  onChange={(time) => setFormData({ ...formData, startTime: time })}
                  label="Start Time"
                  error={errors.startTime}
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <TimePickerInput
                  value={formData.endTime}
                  onChange={(time) => setFormData({ ...formData, endTime: time })}
                  label="End Time"
                  error={errors.endTime}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter event location"
              disabled={isSubmitting}
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Assignee *
            </label>
            <input
              type="text"
              value={formData.assigneeName}
              onChange={(e) => setFormData({ ...formData, assigneeName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.assigneeName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter assignee name"
              disabled={isSubmitting}
            />
            {errors.assigneeName && <p className="mt-1 text-sm text-red-600">{errors.assigneeName}</p>}
          </div>

          {/* Options Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Registration Type
              </label>
              <select
                value={formData.attendeeType}
                onChange={(e) => setFormData({ ...formData, attendeeType: e.target.value as Event['attendeeType'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="RSVP">RSVP Required</option>
                <option value="Ticket">Ticketed Event</option>
                <option value="Open">Open (No Registration)</option>
                <option value="Invitation">Invitation Only</option>
                <option value="Waitlist">Waitlist Available</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  {mode === 'edit' ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;