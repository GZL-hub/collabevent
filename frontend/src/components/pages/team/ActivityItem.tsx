import React from 'react';
import { Activity } from './types';
import { Pin, Heart, Reply, MoreHorizontal, Calendar, AtSign } from 'lucide-react';
import { getInitials, getActivityIcon, getActivityColor, formatTimestamp } from './utils';
import ReplySection from './ReplySection';

interface ActivityItemProps {
  activity: Activity;
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  currentUserId?: string;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onLike,
  onPin,
  onReply,
  replyingTo,
  onDeleteReply,
  currentUserId,
  setReplyingTo,
  replyContent,
  setReplyContent
}) => {
  // Use _id as the primary identifier, fall back to id for compatibility
  const activityId = activity._id || activity.id || '';
  
  return (
    <div className={`relative ${activity.isPinned ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-4' : ''}`}>
      {activity.isPinned && (
        <div className="flex items-center text-yellow-600 text-xs font-medium mb-2">
          <Pin size={12} className="mr-1" />
          Pinned
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}
          style={{ backgroundColor: `var(--color-${activity.user.avatarColor}-600, #3b82f6)` }}
        >
          {activity.user.initials || getInitials(activity.user.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-800">{activity.user.name}</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
              <div className="flex items-center space-x-1">
                {getActivityIcon(activity.type)}
                <span className="capitalize">{activity.type.replace('_', ' ')}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">{formatTimestamp(activity.createdAt)}</span>
          </div>
          
          <p className="text-gray-800 text-sm mb-2">{activity.message}</p>
          
          {/* Event Reference */}
          {activity.event && (
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium mb-2">
              <Calendar size={12} className="mr-1" />
              {activity.event.title}
            </div>
          )}

          {/* Mentions */}
          {activity.mentions && activity.mentions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {activity.mentions.map((mention, index) => (
                <span 
                  key={`${mention.userId}-${index}`}
                  className="inline-flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                >
                  <AtSign size={10} className="mr-1" />
                  {mention.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {activity.tags.map((tag, index) => (
                <span 
                  key={`${tag}-${index}`}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => onLike(activityId)}
              className={`flex items-center space-x-1 text-xs transition-colors ${
                activity.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart size={14} className={activity.isLiked ? 'fill-current' : ''} />
              <span>{activity.likes}</span>
            </button>
            
            <button
              onClick={() => setReplyingTo(replyingTo === activityId ? null : activityId)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Reply size={14} />
              <span>Reply ({activity.replies?.length || 0})</span>
            </button>
            
            <button
              onClick={() => onPin(activityId)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Pin size={14} />
              <span>{activity.isPinned ? 'Unpin' : 'Pin'}</span>
            </button>
            
            <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
          
          <ReplySection
            activity={activity}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onReply={onReply}
            onDeleteReply={onDeleteReply}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;