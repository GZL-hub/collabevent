import { useState, useEffect, useCallback } from 'react';
import { Activity, CreateActivityRequest } from '../types';
import ActivityService from '../services/activityService';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalActivities: 0,
    hasNext: false,
    hasPrev: false,
  });

// Transform backend activity to frontend format
const transformActivity = useCallback((activity: any): Activity => {
  const activityId = activity._id || activity.id || '';
  
  // ✅ FIX: Calculate isLiked based on current user in likedBy array
  const getCurrentUserId = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId && storedUserId !== 'current-user-id') {
      return storedUserId;
    }
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id || payload.sub;
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
    return '68774c5d303caa8b867ae00c'; // Fallback for testing
  };
  
  const currentUserId = getCurrentUserId();
  const likedByArray = activity.likedBy || [];
  
  // ✅ Calculate isLiked correctly
  const isLiked = likedByArray.some((userId: string) => userId === currentUserId);
  
  console.log('Transform activity debug:', {
    activityId: activityId.slice(-6),
    currentUserId: currentUserId?.slice(-6),
    likedByArray: likedByArray.map((id: string) => id.slice(-6)),
    backendIsLiked: activity.isLiked,
    calculatedIsLiked: isLiked, // ✅ Add this debug
    likes: activity.likes
  });
  
  return {
    _id: activityId,
    id: activityId,
    type: activity.type || 'comment',
    message: activity.message || '',
    user: {
      _id: activity.user?._id || activity.user?.id || '',
      id: activity.user?._id || activity.user?.id || '',
      name: activity.user?.name || 'Unknown User',
      email: activity.user?.email || '',
      avatarColor: activity.user?.avatarColor || 'blue',
      initials: activity.user?.initials || activity.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'
    },
    createdAt: activity.createdAt || activity.timestamp || new Date().toISOString(),
    likes: activity.likes || 0,
    likedBy: likedByArray,
    isLiked: isLiked, // ✅ FIX: Use calculated value instead of activity.isLiked || false
    isPinned: activity.isPinned || false,
    replies: (activity.replies || []).map((reply: any) => {
      const replyId = reply._id || reply.id || `reply-${Date.now()}`;
      return {
        _id: replyId,
        id: replyId,
        userId: reply.userId || reply.user?._id || '',
        userName: reply.userName || reply.user?.name || 'Unknown User',
        message: reply.message || reply.content || '',
        timestamp: reply.timestamp || reply.createdAt || new Date().toISOString()
      };
    }),
    event: activity.event ? {
      _id: activity.event._id || activity.event.id || '',
      id: activity.event._id || activity.event.id || '',
      title: activity.event.title || 'Untitled Event',
      date: activity.event.date || new Date().toISOString()
    } : undefined,
    mentions: activity.mentions || [],
    tags: activity.tags || []
  };
}, []);

  // Fetch activities
  const fetchActivities = useCallback(async (params?: {
    type?: string;
    isPinned?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ActivityService.getActivities(params);
      
      if (response.success) {
        const transformedActivities = response.data.activities.map(transformActivity);
        setActivities(transformedActivities);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [transformActivity]);

  // Create activity
  const createActivity = useCallback(async (activityData: CreateActivityRequest) => {
    try {
      setError(null);
      
      const response = await ActivityService.createActivity(activityData);
      
      if (response.success) {
        const transformedActivity = transformActivity(response.data);
        setActivities(prev => [transformedActivity, ...prev]);
        return transformedActivity;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
      console.error('Error creating activity:', err);
      throw err;
    }
  }, [transformActivity]);

    // Like activity 
    const likeActivity = useCallback(async (activityId: string, userId?: string) => {
    try {
        setError(null);
        
        // Get current user ID - same logic as in your TeamActivity component
        const getUserId = () => {
        // Use passed userId first, then fallback to stored/token
        if (userId && userId !== 'current-user-id') {
            return userId;
        }
        
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId && storedUserId !== 'current-user-id') {
            return storedUserId;
        }
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token) {
            try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.id || payload.sub;
            } catch (err) {
            console.error('Error decoding token:', err);
            }
        }
        return '68774c5d303caa8b867ae00c'; // Fallback for testing
        };
        
        const currentUserId = getUserId();
        console.log('Liking activity with userId:', currentUserId);
        
        if (!currentUserId || currentUserId === 'current-user-id') {
        throw new Error('Valid user ID is required');
        }
        
        const response = await ActivityService.likeActivity(activityId, currentUserId);
        
        if (response.success) {
        const transformedActivity = transformActivity(response.data);
        setActivities(prev =>
            prev.map(a => a._id === activityId ? transformedActivity : a)
        );
        console.log('Activity like status updated:', response.isLiked);
        }
    } catch (err) {
        console.error('Error liking activity:', err);
        setError(err instanceof Error ? err.message : 'Failed to like activity');
        throw err;
    }
    }, [transformActivity]);

  // Pin activity
  const pinActivity = useCallback(async (activityId: string) => {
    try {
      setError(null);
      
      const activity = activities.find(a => a._id === activityId);
      if (!activity) return;

      const newPinnedState = !activity.isPinned;
      
      // Optimistic update
      setActivities(prev =>
        prev.map(a =>
          a._id === activityId ? { ...a, isPinned: newPinnedState } : a
        )
      );

      const response = await ActivityService.pinActivity(activityId, newPinnedState);
      
      if (response.success) {
        const transformedActivity = transformActivity(response.data);
        setActivities(prev =>
          prev.map(a => a._id === activityId ? transformedActivity : a)
        );
      }
    } catch (err) {
      // Revert optimistic update on error
      setActivities(prev =>
        prev.map(a =>
          a._id === activityId ? { ...a, isPinned: !a.isPinned } : a
        )
      );
      
      setError(err instanceof Error ? err.message : 'Failed to pin activity');
      console.error('Error pinning activity:', err);
    }
  }, [activities, transformActivity]);

  // Add reply
  const addReply = useCallback(async (activityId: string, replyData: {
    userId: string;
    message: string;
  }) => {
    try {
      setError(null);
      
      const response = await ActivityService.addReply(activityId, replyData);
      
      if (response.success) {
        const transformedActivity = transformActivity(response.data);
        setActivities(prev =>
          prev.map(a => a._id === activityId ? transformedActivity : a)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reply');
      console.error('Error adding reply:', err);
      throw err;
    }
  }, [transformActivity]);

  // Delete activity
  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      setError(null);
      
      await ActivityService.deleteActivity(activityId);
      setActivities(prev => prev.filter(a => a._id !== activityId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
      console.error('Error deleting activity:', err);
      throw err;
    }
  }, []);

    // Delete reply
    const deleteReply = useCallback(async (activityId: string, replyId: string, userId: string) => {
    try {
        setError(null);
        
        console.log('Deleting reply:', { activityId, replyId, userId });
        
        const response = await ActivityService.deleteReply(activityId, replyId, userId);
        
        if (response.success) {
        const transformedActivity = transformActivity(response.data);
        setActivities(prev =>
            prev.map(a => a._id === activityId ? transformedActivity : a)
        );
        }
    } catch (err) {
        console.error('Error deleting reply:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete reply');
        throw err;
    }
    }, [transformActivity]);

  return {
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
  };
};