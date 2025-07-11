import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Users, 
  Settings, 
  Grid, 
  Clock, 
  LogOut,
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
  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4 border-b border-indigo-700">
        {isSidebarOpen ? (
          <h1 className="text-xl font-semibold">Event Manager</h1>
        ) : (
          <h1 className="text-xl font-semibold">EM</h1>
        )}
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-indigo-700">
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <SidebarItem 
            icon={<Grid size={20} />} 
            text="Dashboard" 
            isOpen={isSidebarOpen} 
            isActive={currentPage === 'dashboard'}
            onClick={() => setCurrentPage('dashboard')} 
          />
          <SidebarItem 
            icon={<Calendar size={20} />} 
            text="Events" 
            isOpen={isSidebarOpen} 
            isActive={currentPage === 'events'}
            onClick={() => setCurrentPage('events')} 
          />
          <SidebarItem 
            icon={<Clock size={20} />} 
            text="Calendar" 
            isOpen={isSidebarOpen} 
            isActive={currentPage === 'calendar'}
            onClick={() => setCurrentPage('calendar')} 
          />
          <SidebarItem 
            icon={<Bell size={20} />} 
            text="Notifications" 
            isOpen={isSidebarOpen} 
            isActive={currentPage === 'notifications'}
            onClick={() => setCurrentPage('notifications')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            text="Team Activity" 
            isOpen={isSidebarOpen} 
            isActive={currentPage === 'team'}
            onClick={() => setCurrentPage('team')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            text="Settings" 
            isOpen={isSidebarOpen} 
            isActive={currentPage === 'settings'}
            onClick={() => setCurrentPage('settings')} 
          />
        </ul>
        
        <div className="absolute bottom-4 w-full left-0 px-4">
          <SidebarItem 
            icon={<LogOut size={20} />} 
            text="Logout" 
            isOpen={isSidebarOpen} 
            isActive={false}
            onClick={() => console.log('Logout clicked')} 
          />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;