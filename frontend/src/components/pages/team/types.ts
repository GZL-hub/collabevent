export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away';
}

export interface Activity {
  id: string;
  type: 'comment' | 'event_created' | 'event_updated' | 'file_uploaded' | 'mention' | 'task_completed';
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  eventName?: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
  isPinned?: boolean;
  tags?: string[];
  isLiked?: boolean;
  isRead?: boolean;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
}

export type FilterType = 'all' | 'comments' | 'events' | 'mentions';