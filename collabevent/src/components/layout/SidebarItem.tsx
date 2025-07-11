import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isOpen, isActive, onClick }) => {
  return (
    <li 
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors 
      ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span>{icon}</span>
        {isOpen && <span className="ml-3">{text}</span>}
      </div>
    </li>
  );
};

export default SidebarItem;