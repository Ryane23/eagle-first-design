import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number; // en millisecondes
  onClose?: () => void;
}

const ToastNotification: React.FC<ToastProps> = ({ 
  type, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const getToastIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <AlertOctagon className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getToastClasses = () => {
    const baseClasses = "flex items-center p-4 rounded-lg shadow-lg";
    switch (type) {
      case 'success': return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'error': return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case 'warning': return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'info': default: return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
    }
  };
  
  if (!visible) return null;
  
  return (
    <div className={`${getToastClasses()} animate-fadeIn`}>
      <div className="mr-3 flex-shrink-0">
        {getToastIcon()}
      </div>
      <div className="flex-1">
        {message}
      </div>
      <button 
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ToastNotification;