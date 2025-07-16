import React from 'react';
import { Trash2 } from 'lucide-react';

interface Role {
  name: string;
  permissions: string[];
  users: number;
}

interface RoleCardProps {
  role: Role;
  onDelete?: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h5 className="font-medium text-gray-800">{role.name}</h5>
          <span className="text-sm text-gray-500">{role.users} users</span>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Delete role"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div className="space-y-1">
        {role.permissions.map((permission) => (
          <span 
            key={permission} 
            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
          >
            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoleCard;