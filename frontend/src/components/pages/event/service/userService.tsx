export interface User {
  _id?: string; // MongoDB ObjectId
  id: string;
  firstName?: string;
  lastName?: string;
  name: string; // Computed field (firstName + lastName)
  email: string;
  role?: string;
  department?: string;
  avatar?: string;
  status?: string;
  phone?: string;
  bio?: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
  };
}

export class UserService {
  private static baseUrl = 'http://localhost:5001/api/users';

  // Helper function to transform database user to frontend user
  private static transformUser(dbUser: any): User {
    return {
      ...dbUser,
      id: dbUser._id || dbUser.id,
      name: `${dbUser.firstName} ${dbUser.lastName}`.trim(),
    };
  }

  static async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      
      // Check if the response has the expected structure
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      // Extract the data array from the response
      const userData = apiResponse.data;
      
      // Ensure we return an array and transform each user
      if (!Array.isArray(userData)) {
        console.warn('API response data is not an array:', userData);
        return [];
      }
      
      return userData.map(this.transformUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users from the server');
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      // For single user, the response might be different, adapt as needed
      const userData = apiResponse.data || apiResponse;
      return this.transformUser(userData);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw new Error(`Failed to fetch user with ID: ${id}`);
    }
  }

  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      
      // Check if the response has the expected structure
      if (!apiResponse.success) {
        throw new Error('Search API request was not successful');
      }

      // Extract the data array from the response
      const userData = apiResponse.data;
      
      // Ensure we return an array and transform each user
      if (!Array.isArray(userData)) {
        console.warn('Search API response data is not an array:', userData);
        return [];
      }
      
      return userData.map(this.transformUser);
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }
}