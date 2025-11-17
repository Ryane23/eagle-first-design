import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  count?: number;
  fullWidth?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  size = 'sm',
  onClick,
  disabled = false,
  count,
  fullWidth = false,
  className = ''
}) => {
  // Styles par variante
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    light: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    dark: 'bg-gray-600 text-white hover:bg-gray-700'
  };

  // Styles par taille
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button 
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-md flex items-center ${fullWidth ? 'w-full justify-center' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={`${label ? 'mr-1' : ''}`}>{icon}</span>}
      {label}
      {count !== undefined && (
        <span className="ml-1 bg-white text-gray-800 rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </button>
  );
};