import React, { useEffect, useState } from 'react';
import { Clock, PauseCircle } from 'lucide-react';

interface ConsultationTimerProps {
  elapsedTime?: number; // en secondes
  isPaused?: boolean;
  startTime?: Date;
  darkMode?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConsultationTimer: React.FC<ConsultationTimerProps> = ({
  elapsedTime: propElapsedTime,
  isPaused = false,
  startTime,
  darkMode = false,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const [internalElapsedTime, setInternalElapsedTime] = useState(propElapsedTime || 0);
  
  // Si le temps écoulé est contrôlé par le parent
  useEffect(() => {
    if (propElapsedTime !== undefined) {
      setInternalElapsedTime(propElapsedTime);
    }
  }, [propElapsedTime]);
  
  // Si le temps est calculé en interne à partir d'une heure de début
  useEffect(() => {
    if (startTime && propElapsedTime === undefined) {
      const interval = setInterval(() => {
        if (!isPaused) {
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
          setInternalElapsedTime(elapsed);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [startTime, isPaused, propElapsedTime]);
  
  // Si aucun temps n'est fourni, utiliser un chronomètre interne
  useEffect(() => {
    if (propElapsedTime === undefined && !startTime) {
      const interval = setInterval(() => {
        if (!isPaused) {
          setInternalElapsedTime(prev => prev + 1);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused, propElapsedTime, startTime]);
  
  // Formatage du temps écoulé
  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Styles selon la taille
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-medium'
  };
  
  // Couleurs selon la durée (pour indiquer des consultations longues)
  const getColorClass = () => {
    if (internalElapsedTime < 15 * 60) { // Moins de 15 minutes
      return darkMode ? 'text-green-400' : 'text-green-600';
    } else if (internalElapsedTime < 30 * 60) { // Moins de 30 minutes
      return darkMode ? 'text-blue-400' : 'text-blue-600';
    } else if (internalElapsedTime < 45 * 60) { // Moins de 45 minutes
      return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    } else { // Plus de 45 minutes
      return darkMode ? 'text-red-400' : 'text-red-600';
    }
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      {showIcon && (
        <>
          {isPaused ? (
            <PauseCircle className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-1 ${getColorClass()}`} />
          ) : (
            <Clock className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-1 ${getColorClass()}`} />
          )}
        </>
      )}
      
      <span className={getColorClass()}>
        {formatElapsedTime(internalElapsedTime)}
      </span>
    </div>
  );
};