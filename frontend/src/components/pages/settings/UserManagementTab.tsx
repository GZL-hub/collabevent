import React, { useState } from 'react';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import RoleCard from './components/RoleCard';
import UserTable from './components/UserTable';

const UserManagementTab: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@collabevent.com', role: 'Event Manager', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@collabevent.com', role: 'Team Lead', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@collabevent.com', role: 'Viewer', status: 'Inactive' }
  ]);

  const roles = [
    { 
      name: 'Administrator', 
      permissions: ['Full Access', 'User Management', 'System Settings', 'Analytics', 'Event Management'],
      users: 1
    },
    { 
      name: 'Event Manager', 
      permissions: ['Event Management', 'Team Management', 'Analytics', 'Reports'],
      users: 3
    },
    { 
      name: 'Team Lead', 
      permissions: ['Team Management', 'Event Viewing', 'Basic Reports'],
      users: 2
    },
    { 
      name: 'Viewer', 
      permissions: ['Event Viewing', 'Profile Management'],
      users: 5
    }
  ];

  const handleEditUser = (userId: number) => {
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus size={16} />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Roles & Permissions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4">All Users</h4>
        <UserTable 
          users={users} 
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default UserManagementTab;