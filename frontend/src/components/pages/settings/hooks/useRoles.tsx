import { useState, useEffect } from 'react';
import { Role } from '../services/api';
import { roleService } from '../services/roleService';
export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roleService.getAllRoles();
      
      if (response.success && response.data) {
        setRoles(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch roles');
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData: { name: string; description: string; permissions: string[] }) => {
    try {
      const response = await roleService.createRole(roleData);
      
      if (response.success) {
        await fetchRoles(); // Refresh roles list
        return { success: true, message: 'Role created successfully!' };
      } else {
        throw new Error(response.message || 'Failed to create role');
      }
    } catch (err) {
      console.error('Error creating role:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create role');
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      const response = await roleService.deleteRole(roleId);
      
      if (response.success) {
        await fetchRoles(); // Refresh roles list
        return { success: true, message: 'Role deleted successfully!' };
      } else {
        throw new Error(response.message || 'Failed to delete role');
      }
    } catch (err) {
      console.error('Error deleting role:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to delete role');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    deleteRole
  };
};