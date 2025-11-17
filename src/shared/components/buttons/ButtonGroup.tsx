import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {children}
    </div>
  );
};