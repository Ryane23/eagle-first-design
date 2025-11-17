import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  isOnline: boolean;
  onToggleConnection?: () => void; // Pour la démo uniquement
  onReconnect?: () => void;
  showControls?: boolean;
  showFullAlert?: boolean;
  bandwidth?: number;
  darkMode?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isOnline,
  onToggleConnection,
  onReconnect,
  showControls = false,
  showFullAlert = false,
  bandwidth,
  darkMode = false,
  className = ""
}) => {
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);
  
  useEffect(() => {
    if (!isOnline) {
      setLastOnlineTime(new Date());
    }
  }, [isOnline]);
  
  // Calcul du temps écoulé depuis la dernière connexion
  const getElapsedTime = () => {
    if (!lastOnlineTime) return "";
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastOnlineTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `il y a ${diffInSeconds} secondes`;
    } else if (diffInSeconds < 3600) {
      return `il y a ${Math.floor(diffInSeconds / 60)} minutes`;
    } else {
      return `il y a ${Math.floor(diffInSeconds / 3600)} heures`;
    }
  };
  
  // Indicateur compact
  const renderIndicator = () => (
    <div className={`px-3 py-1 rounded-full text-xs flex items-center ${
      isOnline 
        ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
        : (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
    } ${className}`}>
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3 mr-1" />
          <span>Connecté</span>
          {bandwidth && (
            <span className="ml-1">({bandwidth} Mbps)</span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          <span>Hors ligne</span>
        </>
      )}
    </div>
  );
  
  // Contrôles de connexion (pour démo)
  const renderControls = () => (
    <div className="flex space-x-2 items-center">
      {renderIndicator()}
      
      <button 
        className={`text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} px-3 py-1 rounded-lg flex items-center`}
        onClick={isOnline ? onToggleConnection : onReconnect}
      >
        {isOnline ? (
          <>
            <WifiOff className="h-4 w-4 mr-1" />
            <span>Simuler perte connexion</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-1" />
            <span>Reconnexion</span>
          </>
        )}
      </button>
    </div>
  );
  
  // Alerte complète (pour mode hors ligne)
  const renderFullAlert = () => (
    <div className={`m-4 ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 p-4 flex items-start`}>
      <WifiOff className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
      <div>
        <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
          Mode hors ligne actif {lastOnlineTime && getElapsedTime()}
        </p>
        <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          Les données sont stockées localement et seront synchronisées automatiquement une fois la connexion rétablie.
        </p>
        {!isOnline && onReconnect && (
          <button 
            className={`mt-2 px-3 py-1 rounded-md text-xs ${darkMode ? 'bg-red-800 text-red-200' : 'bg-red-200 text-red-800'} flex items-center w-fit`}
            onClick={onReconnect}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Tenter une reconnexion
          </button>
        )}
      </div>
    </div>
  );
  
  return (
    <>
      {showControls ? renderControls() : renderIndicator()}
      {showFullAlert && !isOnline && renderFullAlert()}
    </>
  );
};