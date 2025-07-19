import React, { useState } from 'react';
import { Bell, Menu, LogOut, ChevronDown } from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  department?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
}

interface HeaderProps {
  currentPage: string;
  toggleSidebar: () => void;
  onLogout: () => void;
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentPage, toggleSidebar, onLogout, currentUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return 'U';
    const firstInitial = currentUser.firstName?.[0] || '';
    const lastInitial = currentUser.lastName?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!currentUser) return 'User';
    return `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'User';
  };

  // Get role display color
  const getRoleColor = () => {
    if (!currentUser) return 'from-gray-500 to-gray-600';
    
    switch (currentUser.role) {
      case 'Administrator':
        return 'from-red-500 to-red-600';
      case 'Event Manager':
        return 'from-blue-500 to-blue-600';
      case 'Team Lead':
        return 'from-green-500 to-green-600';
      case 'Viewer':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <header className="bg-white shadow-sm px-4 py-2 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 ml-2">
          {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
        </h1>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </button>
        
        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* User Avatar */}
            <div className={`w-8 h-8 bg-gradient-to-br ${getRoleColor()} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getUserInitials()
              )}
            </div>
            
            {/* User Info */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.role || 'User'}
              </p>
            </div>
            
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>
                    
          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 min-w-[18rem] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info in Dropdown */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor()} rounded-full flex items-center justify-center text-white font-medium`}>
                    {currentUser?.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {currentUser?.role}
                      </span>
                      {currentUser?.department && (
                        <>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400 truncate">
                            {currentUser.department}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentUser?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    currentUser?.status === 'Active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentUser?.status || 'Unknown'}
                  </span>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;