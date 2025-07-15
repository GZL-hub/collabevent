import { Event, EventsResponse } from '../types/event';
const API_BASE_URL = 'http://localhost:5001/api';

export class EventService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all events with optional filters and pagination
  static async getAllEvents(params?: {
    status?: string;
    attendeeType?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/events${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ success: boolean; data: EventsResponse }>(endpoint);
  }

  // Get single event by ID
  static async getEventById(id: string) {
    return this.request<{ success: boolean; data: Event }>(`/events/${id}`);
  }

  // Create new event
  static async createEvent(eventData: Omit<Event, '_id' | 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<{ success: boolean; data: Event; message: string }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Update event
  static async updateEvent(id: string, eventData: Partial<Event>) {
    return this.request<{ success: boolean; data: Event; message: string }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  // Delete event
  static async deleteEvent(id: string) {
    return this.request<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Get upcoming events
  static async getUpcomingEvents(limit?: number) {
    const endpoint = `/events/upcoming${limit ? `?limit=${limit}` : ''}`;
    return this.request<{ success: boolean; data: Event[] }>(endpoint);
  }

  // Get events by assignee
  static async getEventsByAssignee(assigneeId: string) {
    return this.request<{ success: boolean; data: Event[] }>(`/events/assignee/${assigneeId}`);
  }

  // Get event statistics
  static async getEventStats() {
    return this.request<{ 
      success: boolean; 
      data: {
        totalEvents: number;
        upcomingEvents: number;
        statusBreakdown: { _id: string; count: number }[];
        attendeeTypeBreakdown: { _id: string; count: number }[];
      };
    }>('/events/stats');
  }
}