import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  suffix?: string;
  action?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
  darkMode?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  suffix,
  action,
  darkMode = false
}) => {
  return (
    <div className="flex items-center">
      <div className={`${iconBgColor} p-1.5 rounded-full`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <div className="ml-2">
        <div className="flex items-center">
          <span className="text-lg font-bold">{value}</span>
          {suffix && <span className="text-xs ml-1">{suffix}</span>}
        </div>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
      </div>
      {action && (
        <button 
          className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ml-1 flex items-center"
          onClick={action.onClick}
        >
          {action.icon}
          <span className="ml-0.5">{action.label}</span>
        </button>
      )}
    </div>
  );
};