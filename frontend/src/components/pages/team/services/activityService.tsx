import { 
  Activity, 
  ActivityUser, 
  ActivityEvent, 
  ActivityMention, 
  ActivityReply, 
  TeamMember, 
  FilterType,
  ApiResponse,
  ActivitiesResponse,
  LikeActivityResponse
} from '../types';

export interface CreateActivityRequest {
  type: 'comment' | 'event' | 'mention';
  message: string;
  userId: string;
  eventId?: string;
  mentions?: string[];
  tags?: string[];
}

const API_BASE_URL = 'http://localhost:5001';

class ActivityService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Helper method to get current user ID
  private getCurrentUserId(): string | null {
    // First, try the direct userId storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId && storedUserId !== 'current-user-id' && storedUserId !== 'null') {
      return storedUserId;
    }

    // Then try parsing the user object
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'null') {
      try {
        const user = JSON.parse(storedUser);
        const userId = user._id || user.id;
        if (userId && userId !== 'null') {
          return userId;
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }

    // Finally, try the token
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token && token !== 'null') {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId || payload.id || payload.sub;
        if (userId && userId !== 'null') {
          return userId;
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
    
    return null;
  }

  // Get all activities with filtering and pagination
  async getActivities(params?: {
    type?: string;
    isPinned?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      activities: Activity[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalActivities: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append('type', params.type);
    if (params?.isPinned !== undefined) queryParams.append('isPinned', params.isPinned.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `/api/activities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.fetchWithAuth(url);
  }

  // Get single activity by ID
  async getActivityById(id: string): Promise<{
    success: boolean;
    data: Activity;
  }> {
    return this.fetchWithAuth(`/api/activities/${id}`);
  }

  // Create new activity
  async createActivity(activityData: CreateActivityRequest): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    return this.fetchWithAuth('/api/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  // Update activity
    // async updateActivity(id: string, updates: {
    //   message?: string;
    //   tags?: string[];
    //   isPinned?: boolean;
    // }): Promise<{
    //   success: boolean;
    //   message: string;
    //   data: Activity;
    // }> {
    //   return this.fetchWithAuth(`/api/activities/${id}`, {
    //     method: 'PUT',
    //     body: JSON.stringify(updates),
    //   });
    // }

  // Delete activity - ✅ UPDATED: Now includes userId for authorization
  async deleteActivity(id: string, userId?: string): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    // Get user ID - use provided one or get current user
    const currentUserId = userId || this.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User not authenticated. Please log in again.');
    }

    console.log('ActivityService.deleteActivity called with:', { id, userId: currentUserId });
    
    return this.fetchWithAuth(`/api/activities/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId: currentUserId }), // ✅ Send userId in body for authorization
    });
  }

  // Like/Unlike activity
  async likeActivity(activityId: string, userId: string): Promise<{
    success: boolean;
    message: string;
    data: Activity;
    isLiked: boolean;
  }> {
    console.log('ActivityService.likeActivity called with:', { activityId, userId });
    
    return this.fetchWithAuth(`/api/activities/${activityId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }), // Send userId in request body
    });
  }

  // Pin/Unpin activity - ✅ UPDATED: Add userId for authorization
  async pinActivity(id: string, isPinned: boolean, userId?: string): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    const currentUserId = userId || this.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User not authenticated. Please log in again.');
    }

    return this.fetchWithAuth(`/api/activities/${id}/pin`, {
      method: 'PUT',
      body: JSON.stringify({ 
        isPinned,
        userId: currentUserId // Add userId for authorization
      }),
    });
  }

  // Add reply to activity
  async addReply(id: string, replyData: {
    userId: string;
    message: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    return this.fetchWithAuth(`/api/activities/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  }

  // Delete reply from activity
  async deleteReply(activityId: string, replyId: string, userId: string): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    console.log('ActivityService.deleteReply called with:', { activityId, replyId, userId });
    
    return this.fetchWithAuth(`/api/activities/${activityId}/reply/${replyId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }), // Send userId in body for authorization
    });
  }

  // Update activity - ✅ UPDATED: Add userId for authorization
  async updateActivity(id: string, updates: {
    message?: string;
    tags?: string[];
    isPinned?: boolean;
  }, userId?: string): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    const currentUserId = userId || this.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User not authenticated. Please log in again.');
    }

    return this.fetchWithAuth(`/api/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        userId: currentUserId // Add userId for authorization
      }),
    });
  }

  // // Get activity statistics
  // async getActivityStats(): Promise<{
  //   success: boolean;
  //   data: ActivityStats;
  // }> {
  //   return this.fetchWithAuth('/api/activities/stats');
  // }
}

export default new ActivityService();