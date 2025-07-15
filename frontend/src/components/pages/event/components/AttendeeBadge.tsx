import React from 'react';
import { Event } from '../types/event';

interface AttendeeBadgeProps {
  type: Event['attendeeType'];
}

const AttendeeBadge: React.FC<AttendeeBadgeProps> = ({ type }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (type) {
    case 'RSVP':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'Ticket':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Open':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    case 'Invitation':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    case 'Waitlist':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    // Backward compatibility
    case 'Internal' as any:
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    case 'External' as any:
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
      break;
    case 'Mixed' as any:
      bgColor = 'bg-teal-100';
      textColor = 'text-teal-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {type}
    </span>
  );
};

export default AttendeeBadge;