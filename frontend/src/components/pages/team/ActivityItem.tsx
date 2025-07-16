import React from 'react';
import { Activity } from './types';
import { Pin, Heart, Reply, MoreHorizontal } from 'lucide-react';
import { getInitials, getActivityIcon, getActivityColor, formatTimestamp } from './utils';
import ReplySection from './ReplySection';

interface ActivityItemProps {
  activity: Activity;
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
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
  setReplyingTo,
  replyContent,
  setReplyContent
}) => {
  return (
    <div className={`relative ${activity.isPinned ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-4' : ''}`}>
      {activity.isPinned && (
        <div className="flex items-center text-yellow-600 text-xs font-medium mb-2">
          <Pin size={12} className="mr-1" />
          Pinned
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {getInitials(activity.userName)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-800">{activity.userName}</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
              <div className="flex items-center space-x-1">
                {getActivityIcon(activity.type)}
                <span className="capitalize">{activity.type.replace('_', ' ')}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
          </div>
          
          <p className="text-gray-800 text-sm mb-2">{activity.content}</p>
          
          {activity.eventName && (
            <div className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium mb-2">
              📅 {activity.eventName}
            </div>
          )}
          
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {activity.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => onLike(activity.id)}
              className={`flex items-center space-x-1 text-xs ${
                activity.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart size={14} className={activity.isLiked ? 'fill-current' : ''} />
              <span>{activity.likes}</span>
            </button>
            
            <button
              onClick={() => setReplyingTo(activity.id)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <Reply size={14} />
              <span>Reply</span>
            </button>
            
            <button
              onClick={() => onPin(activity.id)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <Pin size={14} />
              <span>{activity.isPinned ? 'Unpin' : 'Pin'}</span>
            </button>
            
            <button className="text-xs text-gray-500 hover:text-gray-700">
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
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;