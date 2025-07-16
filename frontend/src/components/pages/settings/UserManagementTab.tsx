import React, { useState } from 'react';
import { UserPlus, Shield, AlertCircle } from 'lucide-react';
import RoleCard from './components/RoleCard';
import UserTable from './components/UserTable';
import AddUserModal from './modals/AddUserModal';
import AddRoleModal from './modals/AddRoleModal';
import { useRoles } from './hooks/useRoles';
import { useUsers } from './hooks/useUsers';

const UserManagementTab: React.FC = () => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Use custom hooks for data management
  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
    createRole,
    deleteRole
  } = useRoles();

  const {
    users,
    loading: usersLoading,
    error: usersError,
    createUser,
    deleteUser
  } = useUsers();

  // Handle adding a new role
  const handleAddRole = async (roleData: { name: string; description: string; permissions: string[] }) => {
    try {
      setActionError(null);
      const result = await createRole(roleData);
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create role');
      setTimeout(() => setActionError(null), 5000);
    }
  };

  // Handle adding a new user
  const handleAddUser = async (userData: { name: string; email: string; role: string; status: string }) => {
    try {
      setActionError(null);
      const result = await createUser(userData);
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create user');
      setTimeout(() => setActionError(null), 5000);
    }
  };

  // Handle editing a user
  const handleEditUser = (userId: number) => {
    console.log('Edit user:', userId);
    // TODO: Implement edit user modal and API call
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: number) => {
    try {
      setActionError(null);
      const user = users.find(u => u.id === userId);
      if (user && user._id) {
        const result = await deleteUser(user._id);
        setSuccessMessage(result.message);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete user');
      setTimeout(() => setActionError(null), 5000);
    }
  };

  // Handle deleting a role
  const handleDeleteRole = async (roleId: string) => {
    try {
      setActionError(null);
      const result = await deleteRole(roleId);
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete role');
      setTimeout(() => setActionError(null), 5000);
    }
  };

  // Transform roles for RoleCard component
  const transformedRoles = roles.map(role => ({
    name: role.name,
    permissions: role.permissions,
    users: users.filter(user => user.role === role.name).length
  }));

  // Combined loading state
  const loading = rolesLoading || usersLoading;

  // Combined error state
  const fetchError = rolesError || usersError;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading user management...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {successMessage}
        </div>
      )}
      
      {(actionError || fetchError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {actionError || fetchError}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
          <p className="text-sm text-gray-600">Manage users and roles for your organization</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsAddRoleModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Shield size={16} />
            <span>Add Role</span>
          </button>
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Roles Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-800">Roles & Permissions</h4>
          <span className="text-sm text-gray-600">{roles.length} roles total</span>
        </div>
        
        {transformedRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transformedRoles.map((role) => (
              <RoleCard 
                key={role.name} 
                role={role}
                onDelete={roles.find(r => r.name === role.name)?.isCustom ? 
                  () => handleDeleteRole(roles.find(r => r.name === role.name)?._id || '') : 
                  undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No roles found</p>
            <button 
              onClick={() => setIsAddRoleModalOpen(true)}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Create your first role
            </button>
          </div>
        )}
      </div>

      {/* Users Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-800">All Users</h4>
          <span className="text-sm text-gray-600">{users.length} users total</span>
        </div>
        
        <UserTable 
          users={users} 
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
        availableRoles={roles.map(role => role.name)}
      />

      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onAddRole={handleAddRole}
      />
    </div>
  );
};

export default UserManagementTab;