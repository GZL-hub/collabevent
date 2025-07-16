import { MessageCircle, Calendar, FileText, Bell, Clock, Edit } from 'lucide-react';
import { Activity } from './types';

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'comment': return <MessageCircle size={16} className="text-blue-600" />;
    case 'event': return <Calendar size={16} className="text-green-600" />; // ✅ SIMPLIFIED
    case 'mention': return <Bell size={16} className="text-red-600" />;
    // Remove these old types that don't exist in your simplified schema:
    // case 'event_created': return <Calendar size={16} className="text-green-600" />;
    // case 'event_updated': return <Edit size={16} className="text-orange-600" />;
    // case 'file_uploaded': return <FileText size={16} className="text-purple-600" />;
    // case 'task_completed': return <Clock size={16} className="text-indigo-600" />;
    default: return <MessageCircle size={16} className="text-gray-600" />;
  }
};

export const getActivityColor = (type: Activity['type']): string => {
  switch (type) {
    case 'comment': return 'bg-blue-100 text-blue-800';
    case 'event': return 'bg-green-100 text-green-800'; // ✅ SIMPLIFIED
    case 'mention': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};