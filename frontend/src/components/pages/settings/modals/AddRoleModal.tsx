import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (role: { name: string; description: string; permissions: string[] }) => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ isOpen, onClose, onAddRole }) => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Array<{ id: string; label: string; category: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available permissions from backend
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/roles/permissions');
        const data = await response.json();
        
        if (data.success) {
          setAvailablePermissions(data.data);
        } else {
          throw new Error('Failed to fetch permissions');
        }
      } catch (err) {
        console.error('Error fetching permissions:', err);
        // Fallback to static permissions
        setAvailablePermissions([
          { id: 'user_create', label: 'Create Users', category: 'User Management' },
          { id: 'user_edit', label: 'Edit Users', category: 'User Management' },
          { id: 'user_delete', label: 'Delete Users', category: 'User Management' },
          { id: 'user_view', label: 'View Users', category: 'User Management' },
          { id: 'event_create', label: 'Create Events', category: 'Event Management' },
          { id: 'event_edit', label: 'Edit Events', category: 'Event Management' },
          { id: 'event_delete', label: 'Delete Events', category: 'Event Management' },
          { id: 'event_view', label: 'View Events', category: 'Event Management' },
          { id: 'team_create', label: 'Create Teams', category: 'Team Management' },
          { id: 'team_edit', label: 'Edit Teams', category: 'Team Management' },
          { id: 'team_delete', label: 'Delete Teams', category: 'Team Management' },
          { id: 'team_view', label: 'View Teams', category: 'Team Management' },
          { id: 'analytics_view', label: 'View Analytics', category: 'Analytics & Reports' },
          { id: 'reports_generate', label: 'Generate Reports', category: 'Analytics & Reports' },
          { id: 'reports_export', label: 'Export Reports', category: 'Analytics & Reports' },
          { id: 'settings_view', label: 'View Settings', category: 'System Settings' },
          { id: 'settings_edit', label: 'Edit Settings', category: 'System Settings' },
          { id: 'role_management', label: 'Manage Roles', category: 'System Settings' }
        ]);
      }
    };

    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen]);

  const permissionCategories = [...new Set(availablePermissions.map(p => p.category))];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roleName.trim() || !description.trim() || selectedPermissions.length === 0) {
      setError('Please fill in all fields and select at least one permission');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAddRole({
        name: roleName.trim(),
        description: description.trim(),
        permissions: selectedPermissions
      });
      
      // Reset form
      setRoleName('');
      setDescription('');
      setSelectedPermissions([]);
      onClose();
    } catch (err) {
      setError('Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const selectAllInCategory = (category: string) => {
    const categoryPermissions = availablePermissions
      .filter(p => p.category === category)
      .map(p => p.id);
    
    const allSelected = categoryPermissions.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissions.includes(id)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Add Custom Role</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name *
              </label>
              <input
                type="text"
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role name"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role description"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions * ({selectedPermissions.length} selected)
            </label>
            
            <div className="space-y-4">
              {permissionCategories.map(category => {
                const categoryPermissions = availablePermissions.filter(p => p.category === category);
                const selectedInCategory = categoryPermissions.filter(p => selectedPermissions.includes(p.id)).length;
                const allSelectedInCategory = selectedInCategory === categoryPermissions.length;
                
                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{category}</h4>
                      <button
                        type="button"
                        onClick={() => selectAllInCategory(category)}
                        className={`text-sm px-3 py-1 rounded ${
                          allSelectedInCategory 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {allSelectedInCategory ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categoryPermissions.map(permission => (
                        <label
                          key={permission.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{permission.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !roleName.trim() || !description.trim() || selectedPermissions.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                'Create Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;