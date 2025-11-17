import React from 'react';

interface StatCardGroupProps {
  children: React.ReactNode;
  darkMode?: boolean;
  compact?: boolean;
}

export const StatCardGroup: React.FC<StatCardGroupProps> = ({ 
  children, 
  darkMode = false,
  compact = true
}) => {
  return (
    <div className={`flex mb-3 ${compact ? 'space-x-2 overflow-x-auto' : 'flex-wrap gap-2'} ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-1.5`}>
      {React.Children.map(children, (child, index) => (
        <div className={index !== React.Children.count(children) - 1 ? "border-r pr-3 mr-3" : ""}>
          {child}
        </div>
      ))}
    </div>
  );
};