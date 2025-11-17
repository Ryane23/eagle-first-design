import React, { useState } from 'react';
import { ChevronRight, Menu } from 'lucide-react';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  isActive?: boolean;
  onClick?: (item: MenuItem) => void;
}

interface SidebarProps {
  appName: string;
  menuItems: MenuItem[];
  bottomMenuItems: MenuItem[];
  darkMode?: boolean;
  navCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  appName, 
  menuItems, 
  bottomMenuItems, 
  darkMode = false,
  navCollapsed: externalNavCollapsed,
  onToggleCollapse
}) => {
  // État interne pour navCollapsed si pas fourni en props
  const [internalNavCollapsed, setInternalNavCollapsed] = useState(false);
  
  // Utiliser la prop externe si fournie, sinon l'état interne
  const navCollapsed = externalNavCollapsed !== undefined ? externalNavCollapsed : internalNavCollapsed;
  
  // Fonction pour gérer le toggle
  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalNavCollapsed(!internalNavCollapsed);
    }
  };

  // Gestionnaire de clic pour les items
  const handleItemClick = (item: MenuItem, event: React.MouseEvent) => {
    // Priorité à onClick si présent
    if (item.onClick && typeof item.onClick === 'function') {
      event.preventDefault();
      item.onClick(item);
      return;
    }
    
    // Fallback vers navigation par path (comportement original)
    if (item.path && item.path !== '#') {
      // Pour une vraie navigation, vous pourriez utiliser votre router ici
      // window.location.href = item.path;
      console.log(`Navigation vers: ${item.path}`);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} ${navCollapsed ? 'w-14' : 'w-52'} transition-all duration-300 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-full flex flex-col`}>
      {/* Logo et toggle */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        {!navCollapsed && <span className="font-bold text-lg text-blue-600">{appName}</span>}
        <button 
          onClick={handleToggle}
          className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-md hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition-colors`}
        >
          {navCollapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
        </button>
      </div>
      
      {/* Menu Items */}
      <SidebarSection navCollapsed={navCollapsed} darkMode={darkMode}>
        {menuItems.map((item, index) => (
          <SidebarItemWithClick
            key={index}
            item={item}
            navCollapsed={navCollapsed}
            darkMode={darkMode}
            onClick={handleItemClick}
          />
        ))}
      </SidebarSection>
      
      {/* Bottom menu */}
      <SidebarSection 
        navCollapsed={navCollapsed} 
        darkMode={darkMode} 
        isBottomSection={true}
      >
        {bottomMenuItems.map((item, index) => (
          <SidebarItemWithClick
            key={index}
            item={item}
            navCollapsed={navCollapsed}
            darkMode={darkMode}
            onClick={handleItemClick}
          />
        ))}
      </SidebarSection>
    </div>
  );
};

// Composant wrapper pour SidebarItem avec support onClick
interface SidebarItemWithClickProps {
  item: MenuItem;
  navCollapsed: boolean;
  darkMode: boolean;
  onClick: (item: MenuItem, event: React.MouseEvent) => void;
}

const SidebarItemWithClick: React.FC<SidebarItemWithClickProps> = ({
  item,
  navCollapsed,
  darkMode,
  onClick
}) => {
  // Si onClick est présent, on utilise un bouton
  if (item.onClick) {
    return (
      <button
        onClick={(e) => onClick(item, e)}
        className={`w-full flex items-center ${navCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
          item.isActive 
            ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}` 
            : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
        }`}
        title={navCollapsed ? item.label : undefined}
      >
        <span className={item.isActive ? (darkMode ? 'text-blue-400' : 'text-blue-600') : ''}>
          {item.icon}
        </span>
        {!navCollapsed && (
          <>
            <span className="ml-3 font-medium">{item.label}</span>
            {item.isActive && (
              <div className={`ml-auto w-2 h-2 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`}></div>
            )}
          </>
        )}
      </button>
    );
  }

  // Sinon, on utilise le SidebarItem original
  return (
    <SidebarItem 
      icon={item.icon}
      label={item.label}
      isActive={item.isActive}
      navCollapsed={navCollapsed}
      darkMode={darkMode}
      href={item.path || '#'}
    />
  );
};