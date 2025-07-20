import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { Activity, TeamMember, FilterType } from './types';
import { useActivities } from './hook/activityHook';

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

  // Initialize data on component mount
  useEffect(() => {
    // Get current user ID from authentication
    const getUserId = () => {
      // Option 1: From localStorage (if stored during login)
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId && storedUserId !== 'current-user-id') {
        console.log('Found userId in localStorage:', storedUserId);
        return storedUserId;
      }

      // Option 2: From stored user object
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const userId = user._id || user.id;
          if (userId) {
            console.log('Found userId in stored user object:', userId);
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
            console.log('Found userId in token:', userId);
            return userId;
          }
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }

      console.error('No valid user ID found in any storage location');
      return null; // Return null instead of hardcoded ID
    };

    const userId = getUserId();
    console.log('Current user ID:', userId);
    
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
    } catch (err) {
      console.error('Error creating comment:', err);
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
      // The parent component adds the userId and calls the hook
      await createActivity({
        ...activityData, // Spread the data from the modal
        userId: currentUserId,
      });
      // Close the modal on successful submission
      setIsNewActivityModalOpen(false);
    } catch (err) {
      console.error('Error creating new activity:', err);
      // The error state is already managed by the `useActivities` hook
    }
  };

  const handleReply = async (activityId: string, content: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      console.log('Replying with userId:', currentUserId); // Debug log
      await addReply(activityId, {
        userId: currentUserId,
        message: content
      });
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const handleLike = async (activityId: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      console.log('Liking activity with userId:', currentUserId); // Add debug log
      await likeActivity(activityId, currentUserId); // Pass currentUserId here
    } catch (err) {
      console.error('Error liking activity:', err);
    }
  };

  const handlePin = async (activityId: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      await pinActivity(activityId);
    } catch (err) {
      console.error('Error pinning activity:', err);
    }
  };

  const handleRefresh = () => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }
    fetchActivities();
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
    onDelete: handleDeleteActivity, // Add this line to include the delete handler
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

  // Add handler for delete reply
    const handleDeleteReply = async (activityId: string, replyId: string) => {
    if (!currentUserId || currentUserId === 'current-user-id') {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    try {
      console.log('Deleting reply with userId:', currentUserId);
      await deleteReply(activityId, replyId, currentUserId);
    } catch (err) {
      console.error('Error deleting reply:', err);
    }
  };

  // Add a handler for delete
  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteActivity(activityId);
      // Optional: Show a success message
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error in component when deleting activity:', error);
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

        {/* User Info Display for Debugging */}
        {currentUserId && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-600">
              Current User ID: <code>{currentUserId}</code>
            </div>
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

      {/* Pass loading and error props to the modal */}
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
    </div>
  );
};

export default TeamActivityContent;