export interface Event {
  id: string;
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
  attendeeType: 'Internal' | 'External' | 'Mixed';
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
}