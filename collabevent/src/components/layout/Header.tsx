import React from 'react';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <button className="md:hidden p-2" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-semibold text-gray-800">
        {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
      </h1>
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </button>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;