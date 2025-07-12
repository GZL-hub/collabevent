import React from 'react';
import { Event } from '../types/event';

interface StatusBadgeProps {
  status: Event['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'Upcoming':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'In Progress':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'Completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;