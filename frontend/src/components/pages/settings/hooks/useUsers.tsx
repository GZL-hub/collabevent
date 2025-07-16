import { useState, useEffect } from 'react';
import { User } from '../services/api';
import { userService } from '../services/userService';
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: { name: string; email: string; role: string; status: string }) => {
    try {
      const response = await userService.createUser(userData);
      
      if (response.success) {
        await fetchUsers(); // Refresh users list
        return { success: true, message: 'User created successfully!' };
      } else {
        throw new Error(response.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await userService.deleteUser(userId);
      
      if (response.success) {
        await fetchUsers(); // Refresh users list
        return { success: true, message: 'User deleted successfully!' };
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser
  };
};