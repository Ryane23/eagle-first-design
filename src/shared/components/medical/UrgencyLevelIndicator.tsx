import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

interface UrgencyLevelIndicatorProps {
  level: number;
  maxLevel?: number;
  showIcon?: boolean;
  showNumber?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  validated?: boolean;
  className?: string;
}

const UrgencyLevelIndicator: React.FC<UrgencyLevelIndicatorProps> = ({
  level,
  maxLevel = 5,
  showIcon = true,
  showNumber = true,
  showLabel = false,
  size = 'md',
  validated = true,
  className = ''
}) => {
  // Normaliser le niveau entre 1 et maxLevel
  const normalizedLevel = Math.min(Math.max(1, level), maxLevel);
  
  // Déterminer les classes de couleur en fonction du niveau
  const getColorClasses = () => {
    const baseClasses = validated ? '' : 'border-dashed';
    
    switch (normalizedLevel) {
      case 5: return `${baseClasses} ${validated ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-50 text-red-800 border-red-300'}`;
      case 4: return `${baseClasses} ${validated ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-orange-50 text-orange-800 border-orange-300'}`;
      case 3: return `${baseClasses} ${validated ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-yellow-50 text-yellow-800 border-yellow-300'}`;
      case 2: return `${baseClasses} ${validated ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-50 text-blue-800 border-blue-300'}`;
      case 1: return `${baseClasses} ${validated ? 'bg-green-100 text-green-800 border-green-300' : 'bg-green-50 text-green-800 border-green-300'}`;
      default: return `${baseClasses} ${validated ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-gray-50 text-gray-800 border-gray-300'}`;
    }
  };
  
  // Déterminer l'icône appropriée
  const getIcon = () => {
    if (normalizedLevel >= 5) return <AlertOctagon />;
    if (normalizedLevel >= 3) return <AlertTriangle />;
    return <AlertCircle />;
  };
  
  // Déterminer les classes de taille
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-1.5 py-0.5 text-xs border';
      case 'lg': return 'px-3 py-1.5 text-sm border-2';
      default: return 'px-2 py-1 text-xs border';
    }
  };
  
  // Déterminer la taille de l'icône
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };
  
  // Label textuel en fonction du niveau
  const getUrgencyLabel = () => {
    switch (normalizedLevel) {
      case 5: return 'Urgence vitale';
      case 4: return 'Très urgent';
      case 3: return 'Urgent';
      case 2: return 'Peu urgent';
      case 1: return 'Non urgent';
      default: return 'Niveau inconnu';
    }
  };
  
  return (
    <div className={`inline-flex items-center rounded-lg ${getColorClasses()} ${getSizeClasses()} ${className}`}>
      {showIcon && (
        <span className={`${getIconSize()} mr-1`}>
          {getIcon()}
        </span>
      )}
      
      {showNumber && (
        <span className="font-medium">
          Niveau {normalizedLevel}
        </span>
      )}
      
      {showLabel && (
        <span className={`${showNumber ? 'ml-1' : ''}`}>
          {getUrgencyLabel()}
        </span>
      )}
    </div>
  );
};

export default UrgencyLevelIndicator;