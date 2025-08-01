import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Users, 
  Settings, 
  Grid, 
  Clock, 
  Calendar
} from 'lucide-react';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  isSidebarOpen: boolean;
  currentPage: string;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen, 
  currentPage, 
  toggleSidebar, 
  setCurrentPage
}) => {
  // CollabEvent Logo Component (only for expanded state)
  const CollabEventLogo = () => {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="flex space-x-1 mt-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CollabEvent
          </h1>
          <p className="text-xs text-gray-300">Event Management Software</p>
        </div>
      </div>
    );
  };

  // Create a navigation item that uses both the setCurrentPage function and Link component
  const NavigationItem = ({ icon, text, path }) => {
    const isActive = currentPage === path;
    
    return (
      <li>
        <Link to={`/${path}`}>
          <SidebarItem 
            icon={icon}
            text={text}
            isOpen={isSidebarOpen}
            isActive={isActive}
            onClick={() => setCurrentPage(path)}
          />
        </Link>
      </li>
    );
  };

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 ease-in-out h-screen flex flex-col`}>
      {/* Header section - only show when expanded */}
      {isSidebarOpen && (
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <CollabEventLogo />
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-slate-700 transition-colors">
            <ChevronLeft size={20} />
          </button>
        </div>
      )}
      
      {/* Expand button when collapsed */}
      {!isSidebarOpen && (
        <div className="p-4 flex justify-center flex-shrink-0">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
      {/* Navigation */}
      <nav className={`${isSidebarOpen ? 'p-4' : 'p-2'} flex-1`}>
        <ul className="space-y-2">
          <NavigationItem 
            icon={<Grid size={20} />}
            text="Dashboard"
            path="dashboard"
          />
          <NavigationItem 
            icon={<Calendar size={20} />}
            text="Events"
            path="events"
          />
          <NavigationItem 
            icon={<Clock size={20} />}
            text="Calendar"
            path="calendar"
          />
          <NavigationItem 
            icon={<Bell size={20} />}
            text="Notifications"
            path="notifications"
          />
          <NavigationItem 
            icon={<Users size={20} />}
            text="Team Activity"
            path="team"
          />
          <NavigationItem 
            icon={<Settings size={20} />}
            text="Settings"
            path="settings"
          />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;