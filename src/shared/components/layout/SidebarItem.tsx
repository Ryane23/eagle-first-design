import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  navCollapsed: boolean;
  darkMode: boolean;
  href: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  navCollapsed,
  darkMode,
  href
}) => {
  const activeClass = isActive 
    ? darkMode 
      ? 'bg-blue-900 text-blue-100' 
      : 'bg-blue-50 text-blue-800'
    : '';
  
  const hoverClass = darkMode 
    ? 'hover:bg-gray-700' 
    : 'hover:bg-gray-100';

  return (
    <li>
      <a 
        href={href} 
        className={`flex items-center ${hoverClass} p-2 rounded-md ${!navCollapsed ? 'justify-start' : 'justify-center'} ${activeClass}`}
      >
        <span className={`${isActive ? 'text-blue-600' : darkMode ? 'text-gray-300' : 'text-gray-500'} flex-shrink-0`}>
          {icon}
        </span>
        {!navCollapsed && <span className="ml-2 text-sm">{label}</span>}
      </a>
    </li>
  );
};