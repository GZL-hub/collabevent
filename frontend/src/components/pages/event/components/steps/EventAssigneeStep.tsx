import React, { useState, useEffect } from 'react';
import { User, Search, ChevronDown, AlertCircle, X, UserCheck, Users } from 'lucide-react';
import { User as UserType } from '../../service/userService';
import { FormData } from '../CreateEventModal';

interface EventAssigneeStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
  users: UserType[];
  selectedUser: UserType | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  loadingUsers: boolean;
  userFetchError: string | null;
  fetchUsers: () => Promise<void>;
  isSubmitting: boolean;
  onDropdownToggle?: (isOpen: boolean) => void; // New prop for dropdown state
}

const EventAssigneeStep: React.FC<EventAssigneeStepProps> = ({
  formData,
  setFormData,
  errors,
  users,
  selectedUser,
  setSelectedUser,
  loadingUsers,
  userFetchError,
  fetchUsers,
  isSubmitting,
  onDropdownToggle
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');

  // Notify parent when dropdown state changes
  useEffect(() => {
    if (onDropdownToggle) {
      onDropdownToggle(showUserDropdown);
    }
  }, [showUserDropdown, onDropdownToggle]);

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const searchLower = userSearchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      (user.role && user.role.toLowerCase().includes(searchLower)) ||
      (user.department && user.department.toLowerCase().includes(searchLower))
    );
  }) : [];

  const handleUserSelect = (user: UserType) => {
    if (selectionMode === 'single') {
      setSelectedUser(user);
      setFormData({
        ...formData,
        assigneeName: user.name,
        assigneeId: user.id,
      });
      setShowUserDropdown(false);
      setUserSearchTerm('');
    } else {
      // Multiple selection mode
      const isAlreadySelected = selectedUsers.some(u => u.id === user.id);
      if (isAlreadySelected) {
        const updatedUsers = selectedUsers.filter(u => u.id !== user.id);
        setSelectedUsers(updatedUsers);
        
        // Update form data with concatenated names and IDs
        if (updatedUsers.length > 0) {
          setFormData({
            ...formData,
            assigneeName: updatedUsers.map(u => u.name).join(', '),
            assigneeId: updatedUsers.map(u => u.id).join(','),
          });
        } else {
          setFormData({
            ...formData,
            assigneeName: '',
            assigneeId: '',
          });
        }
      } else {
        const updatedUsers = [...selectedUsers, user];
        setSelectedUsers(updatedUsers);
        setFormData({
          ...formData,
          assigneeName: updatedUsers.map(u => u.name).join(', '),
          assigneeId: updatedUsers.map(u => u.id).join(','),
        });
      }
    }
  };

  const removeSelectedUser = (userId: string) => {
    if (selectionMode === 'single') {
      setSelectedUser(null);
      setFormData({ ...formData, assigneeName: '', assigneeId: '' });
    } else {
      const updatedUsers = selectedUsers.filter(u => u.id !== userId);
      setSelectedUsers(updatedUsers);
      
      if (updatedUsers.length > 0) {
        setFormData({
          ...formData,
          assigneeName: updatedUsers.map(u => u.name).join(', '),
          assigneeId: updatedUsers.map(u => u.id).join(','),
        });
      } else {
        setFormData({
          ...formData,
          assigneeName: '',
          assigneeId: '',
        });
      }
    }
  };

  const handleDropdownToggle = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleCloseDropdown = () => {
    setShowUserDropdown(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['indigo', 'blue', 'purple', 'green', 'pink', 'yellow', 'red', 'orange', 'teal'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const isUserSelected = (user: UserType) => {
    if (selectionMode === 'single') {
      return selectedUser?.id === user.id;
    } else {
      return selectedUsers.some(u => u.id === user.id);
    }
  };

  const displayUsers = selectionMode === 'single' ? (selectedUser ? [selectedUser] : []) : selectedUsers;

  return (
    <div className="space-y-4">
      {/* Selection Mode Toggle */}
      <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Assignment Type:</span>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              setSelectionMode('single');
              setSelectedUsers([]);
              if (selectedUser) {
                setFormData({
                  ...formData,
                  assigneeName: selectedUser.name,
                  assigneeId: selectedUser.id,
                });
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectionMode === 'single'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <User className="w-3 h-3 inline mr-1" />
            Single Manager
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectionMode('multiple');
              setSelectedUser(null);
              setFormData({
                ...formData,
                assigneeName: selectedUsers.map(u => u.name).join(', '),
                assigneeId: selectedUsers.map(u => u.id).join(','),
              });
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectionMode === 'multiple'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Users className="w-3 h-3 inline mr-1" />
            Multiple Managers
          </button>
        </div>
      </div>

      {/* User Fetch Error */}
      {userFetchError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-red-600" />
            <div className="flex-1">
              <div className="text-xs font-medium text-red-800">Error Loading Users</div>
              <div className="text-xs text-red-600">{userFetchError}</div>
            </div>
            <button
              type="button"
              onClick={fetchUsers}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              disabled={loadingUsers}
            >
              {loadingUsers ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      {/* Selected Users Display */}
      {displayUsers.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <UserCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Selected {selectionMode === 'single' ? 'Manager' : 'Managers'} ({displayUsers.length})
            </span>
          </div>
          <div className="space-y-2">
            {displayUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-white p-2 rounded border">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${getAvatarColor(user.name)}-600 rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="font-medium text-green-900 text-sm">{user.name}</div>
                    <div className="text-xs text-green-700">{user.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSelectedUser(user.id)}
                  className="text-green-600 hover:text-green-800 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          {selectionMode === 'single' ? (
            <User className="w-4 h-4 mr-2" />
          ) : (
            <Users className="w-4 h-4 mr-2" />
          )}
          Select Event {selectionMode === 'single' ? 'Manager' : 'Managers'} *
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={handleDropdownToggle}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left flex items-center justify-between transition-all ${
              errors.assigneeName ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting || userFetchError !== null}
          >
            <span className={displayUsers.length > 0 ? 'text-gray-800' : 'text-gray-500'}>
              {userFetchError 
                ? 'Unable to load users' 
                : displayUsers.length > 0
                ? `${displayUsers.length} ${selectionMode === 'single' ? 'manager' : 'managers'} selected`
                : `Select ${selectionMode === 'single' ? 'a manager' : 'managers'}...`
              }
            </span>
            <ChevronDown size={20} className="text-gray-400" />
          </button>

          {showUserDropdown && !userFetchError && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-2xl z-10 max-h-96 overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or role..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    autoFocus
                  />
                </div>
                {selectionMode === 'multiple' && (
                  <div className="mt-2 text-xs text-gray-600">
                    💡 Click users to select/deselect multiple managers
                  </div>
                )}
              </div>

              {/* User List */}
              <div className="max-h-80 overflow-y-auto">
                {loadingUsers ? (
                  <div className="p-8 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading users...</span>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="p-2">
                    {filteredUsers.map(user => {
                      const isSelected = isUserSelected(user);
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleUserSelect(user)}
                          className={`w-full px-4 py-4 text-left rounded-lg flex items-center space-x-4 group transition-colors ${
                            isSelected 
                              ? 'bg-indigo-100 border border-indigo-300' 
                              : 'hover:bg-indigo-50'
                          }`}
                        >
                          <div className={`w-12 h-12 bg-${getAvatarColor(user.name)}-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                            isSelected ? 'ring-2 ring-indigo-500' : ''
                          }`}>
                            {getInitials(user.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium truncate ${
                              isSelected 
                                ? 'text-indigo-800' 
                                : 'text-gray-800 group-hover:text-indigo-600'
                            }`}>
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">{user.email}</div>
                            {user.role && (
                              <div className="text-xs text-gray-400 mt-1">
                                {user.role} {user.department && `• ${user.department}`}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="text-indigo-600">
                              <UserCheck size={20} />
                            </div>
                          )}
                          {!isSelected && (
                            <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronDown size={16} className="rotate-[-90deg]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <User size={32} className="mx-auto mb-3 text-gray-300" />
                    <div className="text-sm">
                      {userSearchTerm ? 'No users found matching your search' : 'No users available'}
                    </div>
                    {userSearchTerm && (
                      <div className="text-xs text-gray-400 mt-1">
                        Try searching with different keywords
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Close button for multiple selection */}
              {selectionMode === 'multiple' && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={handleCloseDropdown}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Done Selecting ({selectedUsers.length} selected)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {errors.assigneeName && <p className="mt-2 text-sm text-red-600">{errors.assigneeName}</p>}
      </div>

      {/* Compact Summary Section */}
      {displayUsers.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Event Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Title:</span>
              <span className="font-medium truncate ml-2">{formData.title || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formData.eventDate || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {formData.startTime && formData.endTime 
                  ? `${formData.startTime} - ${formData.endTime}` 
                  : 'Not set'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium truncate ml-2">{formData.location || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">{selectionMode === 'single' ? 'Manager:' : 'Managers:'}</span>
              <div className="font-medium text-right ml-2">
                {displayUsers.map((user, index) => (
                  <div key={user.id} className="truncate">
                    {user.name}{index < displayUsers.length - 1 ? ',' : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAssigneeStep;