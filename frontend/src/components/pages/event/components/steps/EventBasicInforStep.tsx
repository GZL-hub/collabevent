import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../../types/event';
import TimePickerInput from '../TimePickerInput';
import { FormData } from '../CreateEventModal';

interface EventBasicInfoStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const EventBasicInfoStep: React.FC<EventBasicInfoStepProps> = ({
  formData,
  setFormData,
  errors,
  isSubmitting
}) => {
  return (
    <div className="space-y-4">
      {/* Event Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter a title"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
            errors.location ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Where will this event take place?"
          disabled={isSubmitting}
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      {/* Date and Time Section */}
      <div className="space-y-6">        
        {/* Event Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Date *</label>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
              errors.eventDate ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <TimePickerInput
              value={formData.startTime}
              onChange={(time) => setFormData({ ...formData, startTime: time })}
              label="Start Time"
              error={errors.startTime}
              required
            />
          </div>
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

      {/* Registration Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          How will people register?
        </label>
        <select
          value={formData.attendeeType}
          onChange={(e) => setFormData({ ...formData, attendeeType: e.target.value as Event['attendeeType'] })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
          Event Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          disabled={isSubmitting}
        >
          <option value="Upcoming">Upcoming</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default EventBasicInfoStep;