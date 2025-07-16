export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id?: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
}

export interface CreateUserData {
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface Permission {
  id: string;
  label: string;
  category: string;
}