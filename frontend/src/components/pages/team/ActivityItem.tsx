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
  
  // Ownership check - useMemo to avoid unnecessary recalculations
  const isOwner = useMemo(() => {
    // Quick check for empty values
    if (!currentUserId || !activity.user) {
      console.log('❌ Ownership check failed: Missing currentUserId or activity.user', {
        currentUserId,
        activityUser: activity.user
      });
      return false;
    }
    
    // Get the activity owner ID from the user object - handle both string and object cases
    let activityOwnerId: string = '';
    
    // Try different ways to extract the user ID
    if (typeof activity.user.id === 'string' && activity.user.id) {
      activityOwnerId = activity.user.id;
    } else if (typeof activity.user._id === 'string' && activity.user._id) {
      activityOwnerId = activity.user._id;
    } else {
      // Handle cases where id or _id might be objects with nested _id
      const userIdField = activity.user.id as any;
      const user_idField = activity.user._id as any;
      
      if (userIdField && typeof userIdField === 'object' && userIdField._id) {
        activityOwnerId = userIdField._id;
      } else if (user_idField && typeof user_idField === 'object' && user_idField._id) {
        activityOwnerId = user_idField._id;
      } else {
        console.error('❌ Could not extract activity owner ID', { 
          userObject: activity.user,
          userIdField: activity.user.id,
          user_idField: activity.user._id
        });
        return false;
      }
    }
    
    if (!activityOwnerId) {
      console.error('❌ Activity owner ID is empty', { userObject: activity.user });
      return false;
    }
    
    console.log('🔍 Ownership check details (FIXED):', {
      currentUserId,
      activityOwnerId,
      activityOwnerIdType: typeof activityOwnerId,
      activityUserObject: activity.user,
      activityId: activityId.slice(-6),
      isMatch: activityOwnerId === currentUserId
    });
    
    // ✅ Direct comparison
    return activityOwnerId === currentUserId;
  }, [activity.user, currentUserId, activityId]);

  // ✅ DEBUGGING: Add this for better debugging (remove the other debug log)
  useEffect(() => {
    console.log('🔬 RAW ACTIVITY DATA:', {
      activityId: activityId.slice(-6),
      userField: activity.user,
      userIdField: activity.user?.id,
      userIdFieldType: typeof activity.user?.id,
      user_idField: activity.user?._id,
      user_idFieldType: typeof activity.user?._id,
      currentUserId,
      isOwnerResult: isOwner
    });
  }, [activity.user, activityId, currentUserId, isOwner]);
    
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
                <span className="capitalize">{activity.type}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">{formatTimestamp(activity.createdAt)}</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-2">{activity.message}</p>
          
          {/* Event information */}
          {activity.event && (
            <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center text-blue-700 text-xs">
                <Calendar size={12} className="mr-1" />
                <span className="font-medium">{activity.event.title}</span>
                <span className="ml-2 text-blue-600">
                  {new Date(activity.event.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          
          {/* Mentions */}
          {activity.mentions && activity.mentions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {activity.mentions.map((mention, index) => (
                <span 
                  key={`${mention._id || mention.id || mention.userId || mention.name}-${index}`}
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
          
          {/* ✅ FIXED: Only show delete menu if user owns the activity AND onDelete is provided */}
          {onDelete && isOwner && (
            <div className="relative" ref={menuRef}>
              <button 
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors p-1"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal size={14} />
              </button>
              
              {showMenu && (
                <div className="absolute bottom-full right-0 mb-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
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
                </div>
              )}
            </div>
          )}
          
          {/* ✅ DEBUGGING: Show why delete button is hidden (remove in production) */}
          {process.env.NODE_ENV === 'development' && onDelete && !isOwner && (
            <div className="text-xs text-gray-400" title={`Not owner: current=${currentUserId}, activity=${activity.user?.id || activity.user?._id}`}>
              🔒
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