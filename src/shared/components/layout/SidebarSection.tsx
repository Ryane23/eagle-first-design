import React from 'react';

interface SidebarSectionProps {
  children: React.ReactNode;
  navCollapsed: boolean;
  darkMode: boolean;
  isBottomSection?: boolean;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  children,
  navCollapsed,
  darkMode,
  isBottomSection = false
}) => {
  return (
    <div className={`${isBottomSection ? `px-2 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : 'flex-1 overflow-y-auto py-2'}`}>
      <ul className="space-y-1 px-2">
        {children}
      </ul>
    </div>
  );
};