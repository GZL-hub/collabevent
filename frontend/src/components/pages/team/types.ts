export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface ActivityUser {
  _id: string;
  id: string; // ✅ REQUIRED
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
}

export interface ActivityEvent {
  _id: string;
  id: string; // ✅ REQUIRED
  title: string;
  date: string;
}

export interface ActivityMention {
  userId: string;
  name: string;
}

export interface ActivityReply {
  _id: string;
  id: string; // ✅ REQUIRED
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  content?: string; // For backward compatibility
}

export interface Activity {
  _id: string;
  id: string; // ✅ REQUIRED - not optional
  type: 'comment' | 'event' | 'mention';
  message: string;
  user: ActivityUser;
  event?: ActivityEvent | null;
  mentions?: ActivityMention[];
  tags?: string[];
  likes: number;
  likedBy?: string[];
  replies: ActivityReply[];
  isPinned: boolean;
  isLiked: boolean; // ✅ REQUIRED - computed client-side
  createdAt: string;
  updatedAt?: string;
  
  // For backward compatibility
  content?: string;
  userName?: string;
  timestamp?: string;
  eventName?: string;
}

// Component prop interfaces
export interface ActivitySectionProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  currentUserId?: string;
}

export interface CreateActivityRequest {
  type: 'comment' | 'event' | 'mention';
  message: string;
  userId: string;
  eventId?: string;
  mentions?: string[];
  tags?: string[];
}

export interface AllActivitySectionProps extends ActivitySectionProps {}

export interface CommentSectionProps extends ActivitySectionProps {
  onAddComment: (content: string) => void;
}

export interface EventSectionProps extends ActivitySectionProps {}

export interface MentionSectionProps extends ActivitySectionProps {}

export type FilterType = 'all' | 'comments' | 'events' | 'mentions';

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LikeActivityResponse extends ApiResponse<Activity> {
  isLiked: boolean;
}

export interface ActivitiesResponse {
  activities: Activity[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}