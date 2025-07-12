import React from 'react';
import { Event } from '../types/event';

interface AttendeeBadgeProps {
  type: Event['attendeeType'];
}

const AttendeeBadge: React.FC<AttendeeBadgeProps> = ({ type }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (type) {
    case 'Internal':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    case 'External':
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
      break;
    case 'Mixed':
      bgColor = 'bg-teal-100';
      textColor = 'text-teal-800';
      break;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {type}
    </span>
  );
};

export default AttendeeBadge;