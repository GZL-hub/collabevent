export interface Event {
  _id?: string; // MongoDB ID (optional for new events)
  id?: string;  // Keep for backward compatibility
  title: string;
  startDate: Date;
  endDate: Date;
  assignee: {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
  };
  location: string;
  attendeeType: 'RSVP' | 'Ticket' | 'Open' | 'Invitation' | 'Waitlist';
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}