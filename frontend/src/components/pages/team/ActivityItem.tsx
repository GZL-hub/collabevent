import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Activity } from './types';
import { Pin, Heart, Reply, MoreHorizontal, Calendar, AtSign, Trash2 } from 'lucide-react';
import { getInitials, getActivityIcon, getActivityColor, formatTimestamp } from './utils';
import ReplySection from './ReplySection';

interface ActivityItemProps {
  activity: Activity;
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  onDelete?: (activityId: string) => void;
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
  onDelete,
  replyingTo,
  onDeleteReply,
  currentUserId,
  setReplyingTo,
  replyContent,
  setReplyContent
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Use _id as the primary identifier, fall back to id for compatibility
  const activityId = activity._id || activity.id || '';
  
  // Force enable delete for demo/development mode - remove in production
  const forceEnableDelete = true; // Set to false in production
  
  // Enhanced ownership check with useMemo for better performance
  const isOwner = useMemo(() => {
    // Quick check for empty values
    if (!currentUserId || !activity.user) return false;
    
    // Force ownership for admin user during development
    if (currentUserId === '68774c5d303caa8b867ae00c' && forceEnableDelete) {
      return true;
    }
    
    // Direct comparison if user is a string ID
    if (typeof activity.user === 'string') {
      return activity.user === currentUserId;
    }
    
    // Compare with _id if user is an object with _id
    if (typeof activity.user === 'object' && activity.user?._id) {
      return activity.user._id === currentUserId;
    }
    
    // Compare with id if user is an object with id
    if (typeof activity.user === 'object' && activity.user?.id) {
      return activity.user.id === currentUserId;
    }
    
    return false;
  }, [activity.user, currentUserId, forceEnableDelete]);
  
  // Debug the user ID matching
  useEffect(() => {
    console.log('ActivityItem ownership check:', {
      currentUserId, 
      activityUserId: activity.user,
      isOwner,
      activityId,
      forceDeleteEnabled: forceEnableDelete
    });
  }, [currentUserId, activity.user, isOwner, activityId, forceEnableDelete]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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
          
        {/* Action buttons */}
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
          
          {/* Triple dots menu - Only render if onDelete is provided */}
          {onDelete && (
            <div className="relative" ref={menuRef}>
              <button 
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors p-1"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal size={14} />
              </button>
              
              {showMenu && (
                <div className="absolute bottom-full right-0 mb-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {/* Show delete option if user is owner or force enabled for development */}
                  {(isOwner || forceEnableDelete) && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this post?')) {
                          onDelete(activityId);
                          setShowMenu(false);
                        }
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </button>
                  )}
                  
                  {/* Show a message if no actions are available */}
                  {(!isOwner && !forceEnableDelete) && (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      No actions available
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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