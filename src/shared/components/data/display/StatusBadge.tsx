import React from 'react';

type StatusType = 'online' | 'offline' | 'warning' | 'error' | 'success' | 'info';
type SeverityLevel = 'normal' | 'warning' | 'issue';

interface StatusBadgeProps {
  type: StatusType | SeverityLevel;
  label?: string;
  icon?: React.ReactNode;
  count?: number;
  rounded?: 'full' | 'md' | 'sm';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  label,
  icon,
  count,
  rounded = 'full'
}) => {
  // Map de couleurs pour les différents types de statut
  const colorMap = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    normal: 'bg-green-100 text-green-800',
    issue: 'bg-red-100 text-red-800'
  };

  // Label par défaut si non fourni
  const defaultLabels = {
    online: 'En ligne',
    offline: 'Hors ligne',
    warning: 'Attention',
    error: 'Erreur',
    success: 'Succès',
    info: 'Info',
    normal: 'Normal',
    issue: 'Problème'
  };

  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-md',
    sm: 'rounded-sm'
  };

  const displayLabel = label || defaultLabels[type];

  return (
    <span className={`px-1.5 py-0.5 ${roundedClasses[rounded]} text-xs flex items-center ${colorMap[type]}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {displayLabel}
      {count !== undefined && (
        <span className="ml-1 bg-white text-gray-800 rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </span>
  );
};