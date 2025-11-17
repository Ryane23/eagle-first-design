import React from 'react';

interface UrgencyIndicatorProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const UrgencyIndicator: React.FC<UrgencyIndicatorProps> = ({
  level,
  size = 'sm',
  showText = false
}) => {
  // Couleurs pour les différents niveaux d'urgence
  const getUrgencyColor = (level: number) => {
    const colors = {
      1: "bg-green-500",
      2: "bg-blue-500",
      3: "bg-yellow-500",
      4: "bg-orange-500",
      5: "bg-red-500"
    };
    return colors[level as keyof typeof colors] || "bg-gray-500";
  };

  // Tailles pour l'indicateur
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-5 h-5 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base"
  };

  return (
    <div className="flex items-center">
      <div className={`${getUrgencyColor(level)} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold`}>
        {size !== 'xs' && level}
      </div>
      {showText && (
        <span className="ml-1 text-xs">
          {level === 1 && "Non urgent"}
          {level === 2 && "Peu urgent"}
          {level === 3 && "Urgent"}
          {level === 4 && "Très urgent"}
          {level === 5 && "Critique"}
        </span>
      )}
    </div>
  );
};