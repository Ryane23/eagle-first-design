import React, { useState } from 'react';
import { Shield, ChevronDown, Plus, Edit, Trash2, Download, Eye, Send, Clock, Menu as MenuIcon, X } from 'lucide-react';

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  roles: string[];
  disabled?: boolean;
  disabledReason?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
}

interface RoleBasedActionMenuProps {
  actions: Action[];
  userRoles: string[];
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  maxVisibleActions?: number;
  className?: string;
}

const RoleBasedActionMenu: React.FC<RoleBasedActionMenuProps> = ({
  actions,
  userRoles,
  title,
  size = 'md',
  layout = 'horizontal',
  maxVisibleActions = 3,
  className = ''
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltipAction, setTooltipAction] = useState<Action | null>(null);
  
  // Filtrer les actions que l'utilisateur peut voir
  const allowedActions = actions.filter(action => 
    action.roles.some(role => userRoles.includes(role))
  );
  
  // Déterminer les actions visibles et celles à mettre dans "Plus"
  const visibleActions = layout === 'dropdown' 
    ? [] 
    : allowedActions.slice(0, maxVisibleActions);
  
  const overflowActions = layout === 'dropdown' 
    ? allowedActions 
    : allowedActions.length > maxVisibleActions 
      ? allowedActions.slice(maxVisibleActions) 
      : [];
  
  // Obtenir les classes de taille pour les boutons
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs p-1.5 space-x-1';
      case 'lg': return 'text-sm p-3 space-x-3';
      default: return 'text-sm p-2 space-x-2';
    }
  };
  
  // Obtenir les classes de variante pour les boutons
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary': return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary': return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      case 'danger': return 'bg-red-600 text-white hover:bg-red-700';
      case 'warning': return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'success': return 'bg-green-600 text-white hover:bg-green-700';
      case 'info': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    }
  };
  
  // Obtenir les classes de taille pour les icônes
  const getIconSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };
  
  // Montrer le tooltip pour les actions désactivées
  const showTooltip = (action: Action) => {
    if (action.disabled && action.disabledReason) {
      setTooltipAction(action);
    }
  };
  
  // Cacher le tooltip
  const hideTooltip = () => {
    setTooltipAction(null);
  };
  
  // Si aucune action disponible
  if (allowedActions.length === 0) {
    return null;
  }
  
  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 ${className}`}>
      {title && <div className="text-sm font-medium">{title}</div>}
      
      {/* Actions visibles */}
      {visibleActions.map(action => (
        <button
          key={action.id}
          className={`rounded ${getSizeClasses()} flex items-center ${
            action.disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : getVariantClasses(action.variant || 'secondary')
          }`}
          onClick={() => !action.disabled && action.action()}
          onMouseEnter={() => showTooltip(action)}
          onMouseLeave={hideTooltip}
        >
          {React.cloneElement(action.icon as React.ReactElement, { className: getIconSizeClasses() })}
          <span>{action.label}</span>
        </button>
      ))}
      
      {/* Menu déroulant pour les actions supplémentaires */}
      {overflowActions.length > 0 && (
        <div className="relative">
          <button
            className={`rounded ${getSizeClasses()} flex items-center bg-gray-200 text-gray-800 hover:bg-gray-300`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {layout === 'dropdown' ? (
              <>
                <MenuIcon className={getIconSizeClasses()} />
                <span>Actions</span>
                <ChevronDown className={getIconSizeClasses()} />
              </>
            ) : (
              <>
                <MenuIcon className={getIconSizeClasses()} />
                <span>Plus</span>
              </>
            )}
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {overflowActions.map(action => (
                  <button
                    key={action.id}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                      action.disabled 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => {
                      if (!action.disabled) {
                        action.action();
                        setDropdownOpen(false);
                      }
                    }}
                    onMouseEnter={() => showTooltip(action)}
                    onMouseLeave={hideTooltip}
                  >
                    {React.cloneElement(action.icon as React.ReactElement, { className: 'h-4 w-4 mr-2' })}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Tooltip pour actions désactivées */}
      {tooltipAction && tooltipAction.disabled && tooltipAction.disabledReason && (
        <div className="absolute bg-gray-800 text-white text-xs rounded px-2 py-1 mt-1 max-w-xs z-20">
          {tooltipAction.disabledReason}
        </div>
      )}
    </div>
  );
};

export default RoleBasedActionMenu;