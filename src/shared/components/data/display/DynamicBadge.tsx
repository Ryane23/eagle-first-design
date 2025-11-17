import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface DynamicBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  count?: number;
  pulsating?: boolean;
  dot?: boolean;
  rounded?: 'full' | 'md' | 'sm';
  outline?: boolean;
}

const DynamicBadge: React.FC<DynamicBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'sm',
  icon,
  count,
  pulsating = false,
  dot = false,
  rounded = 'md',
  outline = false
}) => {
  // Classes de variante
  const variantClasses = {
    success: outline 
      ? 'bg-transparent text-green-600 border border-green-600' 
      : 'bg-green-100 text-green-800',
    warning: outline 
      ? 'bg-transparent text-yellow-600 border border-yellow-600' 
      : 'bg-yellow-100 text-yellow-800',
    error: outline 
      ? 'bg-transparent text-red-600 border border-red-600' 
      : 'bg-red-100 text-red-800',
    info: outline 
      ? 'bg-transparent text-blue-600 border border-blue-600' 
      : 'bg-blue-100 text-blue-800',
    neutral: outline 
      ? 'bg-transparent text-gray-600 border border-gray-600' 
      : 'bg-gray-100 text-gray-800',
  }[variant];
  
  // Classes de taille
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }[size];
  
  // Classes de coins arrondis
  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-md',
    sm: 'rounded-sm'
  }[rounded];
  
  // Animation de pulsation
  const pulsatingClass = pulsating ? 'animate-pulse' : '';
  
  return (
    <span className={`inline-flex items-center ${variantClasses} ${sizeClasses} ${roundedClasses} ${pulsatingClass}`}>
      {icon && <span className="mr-1">{icon}</span>}
      
      {label}
      
      {count !== undefined && (
        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white ${
          variant === 'success' ? 'text-green-800' :
          variant === 'warning' ? 'text-yellow-800' :
          variant === 'error' ? 'text-red-800' :
          variant === 'info' ? 'text-blue-800' :
          'text-gray-800'
        }`}>
          {count}
        </span>
      )}
      
      {dot && (
        <span className={`ml-1 h-2 w-2 rounded-full ${
          variant === 'success' ? 'bg-green-600' :
          variant === 'warning' ? 'bg-yellow-600' :
          variant === 'error' ? 'bg-red-600' :
          variant === 'info' ? 'bg-blue-600' :
          'bg-gray-600'
        }`}></span>
      )}
    </span>
  );
};

export default DynamicBadge;