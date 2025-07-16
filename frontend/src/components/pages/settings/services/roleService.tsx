import { ApiResponse, Role, CreateRoleData } from './api';

const API_BASE_URL = 'http://localhost:5001/api';

export const roleService = {
  // Get all roles
  getAllRoles: async (): Promise<ApiResponse<Role[]>> => {
    const response = await fetch(`${API_BASE_URL}/roles`);
    return response.json();
  },

  // Get role by ID
  getRoleById: async (id: string): Promise<ApiResponse<Role>> => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`);
    return response.json();
  },

  // Create new role
  createRole: async (roleData: CreateRoleData): Promise<ApiResponse<Role>> => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });
    return response.json();
  },

  // Update role
  updateRole: async (id: string, roleData: Partial<CreateRoleData>): Promise<ApiResponse<Role>> => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });
    return response.json();
  },

  // Delete role
  deleteRole: async (id: string): Promise<ApiResponse<Role>> => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Get available permissions
  getPermissions: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE_URL}/roles/permissions`);
    return response.json();
  },

  // Get role statistics
  getRoleStats: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/roles/stats`);
    return response.json();
  }
};