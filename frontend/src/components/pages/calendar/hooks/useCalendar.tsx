import { useState, useEffect } from 'react';
import { EventService } from '../../event/service/eventService';

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

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get calendar days for the current month
  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === current.toDateString();
      });
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await EventService.getAllEvents();
      const eventsData = response?.data?.events || response?.data || response || [];
      
      const formattedEvents: Event[] = eventsData.map((event: any) => ({
        _id: event._id,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        status: event.status?.toLowerCase() || 'upcoming',
        category: event.category,
        attendees: event.attendees || [],
        createdBy: event.createdBy
      }));
      
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600';
      case 'ongoing': return 'text-green-600';
      case 'completed': return 'text-gray-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  return {
    currentDate,
    events,
    loading,
    error,
    getCalendarDays,
    navigateMonth,
    goToToday,
    getStatusColor,
    getStatusTextColor,
    formatTime,
    fetchEvents
  };
};