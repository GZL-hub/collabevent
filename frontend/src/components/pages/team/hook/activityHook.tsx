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

    // ✅ FIX: Find the user ID from multiple possible fields on the raw activity object.
    // This makes the ID resolution more robust.
    const activityOwnerId = activity.user?._id || activity.user?.id || activity.userId || '';

    const getCurrentUserId = () => {
      // First, try the direct userId storage
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId && storedUserId !== 'current-user-id' && storedUserId !== 'null') {
        console.log('✅ getCurrentUserId: Found in userId storage:', storedUserId);
        return storedUserId;
      }

      // Then try parsing the user object
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'null') {
        try {
          const user = JSON.parse(storedUser);
          const userId = user._id || user.id;
          if (userId && userId !== 'null') {
            console.log('✅ getCurrentUserId: Found in user object:', userId);
            // Store it for next time
            localStorage.setItem('userId', userId);
            return userId;
          }
        } catch (err) {
          console.error('❌ getCurrentUserId: Error parsing stored user:', err);
        }
      }

      // Finally, try the token
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token && token !== 'null') {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId || payload.id || payload.sub;
          if (userId && userId !== 'null') {
            console.log('✅ getCurrentUserId: Found in token:', userId);
            // Store it for next time
            localStorage.setItem('userId', userId);
            return userId;
          }
        } catch (err) {
          console.error('❌ getCurrentUserId: Error decoding token:', err);
        }
      }
      
      console.error('❌ getCurrentUserId: No valid user ID found anywhere');
      return null;
    };

    const currentUserId = getCurrentUserId();
    const likedByArray = activity.likedBy || [];
    const isLiked = currentUserId ? likedByArray.some((userId: string) => userId === currentUserId) : false;

    // Helpful debug log to see what the transformation is producing
    console.log('Transforming Activity:', {
        activityId: activityId.slice(-6),
        resolvedOwnerId: activityOwnerId,
        rawActivityUser: activity.user,
        rawActivityUserId: activity.userId,
    });

    return {
      _id: activityId,
      id: activityId,
      type: activity.type || 'comment',
      message: activity.message || '',
      user: {
        // ✅ FIX: Use the resolved owner ID here. This ensures the ActivityItem
        // gets the correct ID for the ownership check.
        _id: activityOwnerId,
        id: activityOwnerId,
        name: activity.user?.name || 'Unknown User',
        email: activity.user?.email || '',
        avatarColor: activity.user?.avatarColor || 'blue',
        initials: activity.user?.initials || activity.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'
      },
      createdAt: activity.createdAt || activity.timestamp || new Date().toISOString(),
      likes: activity.likes || 0,
      likedBy: likedByArray,
      isLiked: isLiked,
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
      
      const getUserId = () => {
        if (userId && userId !== 'current-user-id') {
          return userId;
        }
        
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId && storedUserId !== 'current-user-id') {
          return storedUserId;
        }

        // Check stored user object
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

        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.id || payload.sub;
          } catch (err) {
            console.error('Error decoding token:', err);
          }
        }
        
        return null; // Return null instead of hardcoded fallback
      };
      
      const currentUserId = getUserId();
      
      if (!currentUserId) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const response = await ActivityService.likeActivity(activityId, currentUserId);
      
      if (response.success) {
        const transformedActivity = transformActivity(response.data);
        setActivities(prev =>
          prev.map(a => a._id === activityId ? transformedActivity : a)
        );
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
      setLoading(true);
      setError(null);
      
      const response = await ActivityService.deleteActivity(activityId);
      
      if (response.success) {
        setActivities(prev => prev.filter(activity => 
          (activity._id !== activityId && activity.id !== activityId)
        ));
        console.log('Activity deleted successfully');
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
      console.error('Error deleting activity:', err);
      throw err;
    }
  }, []);

    // Delete reply
    const deleteReply = useCallback(async (activityId: string, replyId: string, userId: string) => {
    try {
        setError(null);
        
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
