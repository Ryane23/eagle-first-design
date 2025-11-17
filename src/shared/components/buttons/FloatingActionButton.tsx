import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface ActionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions?: ActionItem[];
  mainIcon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  showLabels?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions = [],
  mainIcon,
  position = 'bottom-right',
  color = 'blue',
  size = 'medium',
  onClick,
  showLabels = true
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleMainButtonClick = () => {
    if (actions.length > 0) {
      setExpanded(!expanded);
    } else if (onClick) {
      onClick();
    }
  };
  
  // Déterminer les classes de position
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }[position];
  
  // Déterminer les classes de couleur
  const colorClasses = {
    'blue': 'bg-blue-600 hover:bg-blue-700 text-white',
    'green': 'bg-green-600 hover:bg-green-700 text-white',
    'red': 'bg-red-600 hover:bg-red-700 text-white',
    'purple': 'bg-purple-600 hover:bg-purple-700 text-white',
    'gray': 'bg-gray-600 hover:bg-gray-700 text-white'
  }[color];
  
  // Déterminer les classes de taille
  const sizeClasses = {
    'small': 'w-10 h-10',
    'medium': 'w-12 h-12',
    'large': 'w-14 h-14'
  }[size];
  
  const iconSizeClasses = {
    'small': 'h-4 w-4',
    'medium': 'h-5 w-5',
    'large': 'h-6 w-6'
  }[size];
  
  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Actions secondaires */}
      {expanded && actions.length > 0 && (
        <div className={`absolute ${
          position.includes('bottom') ? 'bottom-full mb-2' : 'top-full mt-2'
        } ${
          position.includes('right') ? 'right-0' : 'left-0'
        }`}>
          <div className="flex flex-col-reverse space-y-reverse space-y-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  action.onClick();
                  setExpanded(false);
                }}
                className={`${colorClasses} opacity-90 ${
                  showLabels ? 'flex items-center' : ''
                } ${sizeClasses} rounded-full shadow-lg flex justify-center items-center`}
              >
                <span className={iconSizeClasses}>{action.icon}</span>
                {showLabels && (
                  <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {action.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Bouton principal */}
      <button
        onClick={handleMainButtonClick}
        className={`${colorClasses} ${sizeClasses} rounded-full shadow-lg flex justify-center items-center`}
      >
        {expanded ? (
          <X className={iconSizeClasses} />
        ) : (
          mainIcon || <Plus className={iconSizeClasses} />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;