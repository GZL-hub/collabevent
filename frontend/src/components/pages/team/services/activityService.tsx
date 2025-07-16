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
  async updateActivity(id: string, updates: {
    message?: string;
    tags?: string[];
    isPinned?: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    return this.fetchWithAuth(`/api/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Delete activity
  async deleteActivity(id: string): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    return this.fetchWithAuth(`/api/activities/${id}`, {
      method: 'DELETE',
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

  // Pin/Unpin activity
  async pinActivity(id: string, isPinned: boolean): Promise<{
    success: boolean;
    message: string;
    data: Activity;
  }> {
    return this.fetchWithAuth(`/api/activities/${id}/pin`, {
      method: 'PUT',
      body: JSON.stringify({ isPinned }),
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

  // // Get activity statistics
  // async getActivityStats(): Promise<{
  //   success: boolean;
  //   data: ActivityStats;
  // }> {
  //   return this.fetchWithAuth('/api/activities/stats');
  // }
}

export default new ActivityService();