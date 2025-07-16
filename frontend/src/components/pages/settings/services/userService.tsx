import { ApiResponse, User, CreateUserData } from './api';

const API_BASE_URL = 'http://localhost:5001/api';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Update user
  updateUser: async (id: string, userData: Partial<CreateUserData>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};