import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, X, Info } from 'lucide-react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertNotificationProps {
  message: string;
  type?: AlertType;
  duration?: number; // en millisecondes, 0 = ne disparaît pas automatiquement
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
  isVisible: boolean;
  darkMode?: boolean;
}

export const AlertNotification: React.FC<AlertNotificationProps> = ({
  message,
  type = 'info',
  duration = 5000,
  position = 'bottom-right',
  onClose,
  isVisible,
  darkMode = false
}) => {
  const [isHidden, setIsHidden] = useState(!isVisible);
  
  useEffect(() => {
    setIsHidden(!isVisible);
    
    let timeout: NodeJS.Timeout;
    if (isVisible && duration > 0) {
      timeout = setTimeout(() => {
        setIsHidden(true);
        if (onClose) onClose();
      }, duration);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isVisible, duration, onClose]);
  
  const handleClose = () => {
    setIsHidden(true);
    if (onClose) onClose();
  };
  
  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return darkMode
          ? 'bg-green-900 text-green-300 border-l-4 border-green-600'
          : 'bg-green-100 text-green-800 border-l-4 border-green-500';
      case 'warning':
        return darkMode
          ? 'bg-yellow-900 text-yellow-300 border-l-4 border-yellow-600'
          : 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
      case 'error':
        return darkMode
          ? 'bg-red-900 text-red-300 border-l-4 border-red-600'
          : 'bg-red-100 text-red-800 border-l-4 border-red-500';
      case 'info':
      default:
        return darkMode
          ? 'bg-blue-900 text-blue-300 border-l-4 border-blue-600'
          : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
    }
  };
  
  if (isHidden) return null;
  
  return (
    <div className={`fixed ${getPositionClasses()} max-w-md z-50 transform transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
    }`}>
      <div className={`p-3 rounded-lg shadow-lg flex items-start ${getTypeClasses()}`}>
        <div className="mr-2 flex-shrink-0">
          {getAlertIcon()}
        </div>
        <div className="flex-1 mr-2">
          <p className="font-medium">{message}</p>
        </div>
        <button
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};