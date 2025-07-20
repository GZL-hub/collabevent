import React, { useState, useCallback, useEffect } from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { Activity, TeamMember, FilterType } from './types';
import { useActivities } from './hook/activityHook';
import Notification, {NotificationType} from './components/Notifications';

// Import modular components
import AllActivitySection from './components/AllActivitySection';
import CommentSection from './components/CommentSection';
import EventSection from './components/EventSection';
import MentionSection from './components/MentionSection';
import NewActivityModal from './components/NewActivityModal';

const TeamActivityContent: React.FC = () => {
  const {
    activities,
    loading,
    error,
    pagination,
    fetchActivities,
    createActivity,
    likeActivity,
    pinActivity,
    addReply,
    deleteActivity,
    deleteReply
  } = useActivities();

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    title: string;
    message?: string;
    isVisible: boolean;
  }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  });

  // Initialize data on component mount
  useEffect(() => {
    // Get current user ID from authentication
    const getUserId = () => {
      // Option 1: From localStorage (if stored during login)
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId && storedUserId !== 'current-user-id') {
        return storedUserId;
      }

      // Option 2: From stored user object
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const userId = user._id || user.id;
          if (userId) {
            return userId;
          }
        } catch (err) {
          console.error('Error parsing stored user:', err);
        }
      }

      // Option 3: From auth token
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token) {
        try {
          // Decode JWT token to get user ID
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId || payload.id || payload.sub;
          if (userId) {
            return userId;
          }
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }

      console.error('No valid user ID found in any storage location');
      return null;
    };

    const userId = getUserId();
    
    if (!userId) {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }
    
    setCurrentUserId(userId);
    setAuthError(null);
    
    // Fetch initial activities
    fetchActivities();
  }, [fetchActivities]);

  // Fetch activities when filter changes
  useEffect(() => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      return; // Don't fetch if user is not authenticated
    }

    const params: any = {};
    
    if (filter !== 'all') {
      if (filter === 'comments') params.type = 'comment';
      if (filter === 'events') params.type = 'event';
      if (filter === 'mentions') params.type = 'mention';
    }
    
    if (searchTerm) {
      params.search = searchTerm;
    }

    fetchActivities(params);
  }, [filter, searchTerm, fetchActivities, currentUserId]);

  // Function to show notifications
  const showNotification = useCallback((type: NotificationType, title: string, message?: string) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true
    });
  }, []);

  // Function to hide notifications
  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Delete handler with notifications
  const handleDeleteActivity = useCallback(async (activityId: string) => {
    try {
      await deleteActivity(activityId);
      showNotification('success', 'Post Deleted', 'The post has been successfully deleted.');
    } catch (err) {
      console.error('Error deleting activity:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete activity';
      showNotification('error', 'Delete Failed', errorMessage);
    }
  }, [deleteActivity, showNotification]);

  // Event handlers
  const handleAddComment = async (content: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await createActivity({
        type: 'comment',
        message: content,
        userId: currentUserId,
        tags: []
      });
      showNotification('success', 'Comment Added', 'Your comment has been posted successfully.');
    } catch (err) {
      console.error('Error creating comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment. Please try again.';
      showNotification('error', 'Comment Failed', errorMessage);
    }
  };

  const handleNewActivity = async (activityData: {
    type: 'comment' | 'event';
    message: string;
    eventId?: string;
    mentions?: string[];
    tags?: string[];
  }) => {
    if (!currentUserId) {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await createActivity({
        ...activityData,
        userId: currentUserId,
      });
      
      const activityTypeLabel = activityData.type === 'event' ? 'Event' : 'Post';
      showNotification('success', `${activityTypeLabel} Created`, `Your ${activityTypeLabel.toLowerCase()} has been successfully posted.`);
      
      setIsNewActivityModalOpen(false);
    } catch (err) {
      console.error('Error creating new activity:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create activity. Please try again.';
      showNotification('error', 'Create Failed', errorMessage);
    }
  };

  const handleReply = async (activityId: string, content: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await addReply(activityId, {
        userId: currentUserId,
        message: content
      });
      showNotification('success', 'Reply Added', 'Your reply has been posted successfully.');
    } catch (err) {
      console.error('Error adding reply:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reply. Please try again.';
      showNotification('error', 'Reply Failed', errorMessage);
    }
  };

  const handleLike = async (activityId: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await likeActivity(activityId, currentUserId);
      // No notification for likes to avoid spam
    } catch (err) {
      console.error('Error liking activity:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to like activity. Please try again.';
      showNotification('error', 'Like Failed', errorMessage);
    }
  };

  const handlePin = async (activityId: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await pinActivity(activityId);
      showNotification('success', 'Activity Pinned', 'Activity has been pinned successfully.');
    } catch (err) {
      console.error('Error pinning activity:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to pin activity. Please try again.';
      showNotification('error', 'Pin Failed', errorMessage);
    }
  };

  const handleRefresh = () => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }
    fetchActivities();
  };

  const handleDeleteReply = async (activityId: string, replyId: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await deleteReply(activityId, replyId, currentUserId);
      showNotification('success', 'Reply Deleted', 'Reply has been successfully deleted.');
    } catch (err) {
      console.error('Error deleting reply:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete reply. Please try again.';
      showNotification('error', 'Delete Failed', errorMessage);
    }
  };

  // Filter activities based on search term (client-side for instant feedback)
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.event?.title && activity.event.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Render appropriate section based on filter
  const renderActivitySection = () => {
    const commonProps = {
      activities: filteredActivities,
      onLike: handleLike,
      onPin: handlePin,
      onReply: handleReply,
      onDeleteReply: handleDeleteReply,
      onDelete: handleDeleteActivity,
      currentUserId: currentUserId
    };

    switch (filter) {
      case 'comments':
        return <CommentSection {...commonProps} onAddComment={handleAddComment} />;
      case 'events':
        return <EventSection {...commonProps} />;
      case 'mentions':
        return <MentionSection {...commonProps} />;
      default:
        return <AllActivitySection {...commonProps} />;
    }
  };

  // Show authentication error if user is not properly authenticated
  if (authError) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-8">
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 font-medium">Authentication Required</div>
              <div className="text-sm text-red-600 mt-1">{authError}</div>
            </div>
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-gray-800 font-bold">Stay connected with your team's latest updates</h2>
            {pagination.totalActivities > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {pagination.totalActivities} total activities
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => setIsNewActivityModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New Update</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {(error || authError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600">{error || authError}</div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Activity' },
              { key: 'comments', label: 'Comments' },
              { key: 'events', label: 'Events' },
              { key: 'mentions', label: 'Mentions' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading activities...</span>
          </div>
        )}
      </div>

      {/* Activity Content - Full Width */}
      {!loading && currentUserId && (
        <div>
          {renderActivitySection()}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchActivities({ page: pagination.currentPage - 1 })}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchActivities({ page: pagination.currentPage + 1 })}
                disabled={!pagination.hasNext}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Activity Modal */}
      {currentUserId && (
        <NewActivityModal
          isOpen={isNewActivityModalOpen}
          onClose={() => setIsNewActivityModalOpen(false)}
          onSubmit={handleNewActivity}
          currentUserId={currentUserId}
          loading={loading}
          error={error}
        />
      )}

      {/* Notification Component */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default TeamActivityContent;