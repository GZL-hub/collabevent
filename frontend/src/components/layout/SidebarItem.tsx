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
    <li>
      <button
        onClick={onClick}
        className={`
          flex items-center w-full p-3 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-slate-700 hover:text-white'
          }
          ${!isOpen ? 'justify-center' : 'justify-start'}
        `}
      >
        <span className={`${isActive ? 'text-white' : ''}`}>
          {icon}
        </span>
        {isOpen && (
          <span className="ml-3 font-medium">
            {text}
          </span>
        )}
      </button>
    </li>
  );
};

export default SidebarItem;