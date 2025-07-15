import React from 'react';
import { Event } from '../types/event';
import CreateEventModal from './CreateEventModal';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventId: string, eventData: Partial<Event>) => void;
  event: Event | null;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  event 
}) => {
  if (!event) return null;

  // Convert the existing event to the format expected by CreateEventModal
  const handleSubmit = (eventData: Omit<Event, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
    const eventId = event._id || event.id;
    if (eventId) {
      onSubmit(eventId, eventData);
    }
  };

  // Transform the event data to match CreateEventModal's expected format
  const initialData = {
    title: event.title,
    eventDate: event.startDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD
    startTime: event.startDate.toTimeString().slice(0, 5), // Convert to HH:MM
    endTime: event.endDate.toTimeString().slice(0, 5), // Convert to HH:MM (same date)
    location: event.location,
    attendeeType: event.attendeeType,
    status: event.status,
    assigneeName: event.assignee.name,
    assigneeId: event.assignee.id,
    assigneeInitials: event.assignee.initials,
    assigneeAvatarColor: event.assignee.avatarColor,
  };

  return (
    <CreateEventModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={initialData}
      mode="edit"
    />
  );
};

export default EditEventModal;