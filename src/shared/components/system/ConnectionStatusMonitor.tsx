import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Clock, Activity, Signal } from 'lucide-react';

interface ConnectionStatusMonitorProps {
  isOnline?: boolean;
  onConnectionChange?: (isOnline: boolean) => void;
  onConnectionTest?: () => Promise<boolean>;
  showStats?: boolean;
  offlineActions?: number;
  lastSyncTime?: string;
  bandwidthSpeed?: number; // in Mbps
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  mode?: 'full' | 'badge' | 'minimal';
  pinned?: boolean;
  className?: string;
  onToggleOfflineMode?: () => void;
}

const ConnectionStatusMonitor: React.FC<ConnectionStatusMonitorProps> = ({
  isOnline = navigator.onLine,
  onConnectionChange,
  onConnectionTest,
  showStats = true,
  offlineActions = 0,
  lastSyncTime,
  bandwidthSpeed,
  autoRefresh = true,
  refreshInterval = 30,
  mode = 'full',
  pinned = false,
  className = '',
  onToggleOfflineMode
}) => {
  const [internalIsOnline, setInternalIsOnline] = useState(isOnline);
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'moderate' | 'poor'>('good');
  
  // Mettre à jour le statut interne lorsque la prop change
  useEffect(() => {
    setInternalIsOnline(isOnline);
  }, [isOnline]);
  
  // Écouteurs d'événements pour les changements de connexion du navigateur
  useEffect(() => {
    const handleOnline = () => {
      setInternalIsOnline(true);
      if (onConnectionChange) onConnectionChange(true);
    };
    
    const handleOffline = () => {
      setInternalIsOnline(false);
      if (onConnectionChange) onConnectionChange(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onConnectionChange]);
  
  // Rafraîchissement automatique
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        testConnection();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);
  
  // Tester la connexion
  const testConnection = async () => {
    if (isTesting) return;
    
    setIsTesting(true);
    let result = internalIsOnline;
    
    try {
      if (onConnectionTest) {
        result = await onConnectionTest();
      } else {
        // Test de connexion basique si aucun handler n'est fourni
        const response = await fetch('https://www.gstatic.com/generate_204', {
          mode: 'no-cors',
          cache: 'no-store'
        });
        result = true;
      }
    } catch (error) {
      result = false;
    }
    
    setInternalIsOnline(result);
    if (onConnectionChange) onConnectionChange(result);
    setLastTestTime(new Date().toLocaleTimeString());
    setIsTesting(false);
    
    // Calculer la qualité de connexion basée sur la vitesse
    if (bandwidthSpeed) {
      if (bandwidthSpeed >= 5) {
        setConnectionQuality('good');
      } else if (bandwidthSpeed >= 2) {
        setConnectionQuality('moderate');
      } else {
        setConnectionQuality('poor');
      }
    }
  };
  
  // Obtenir les classes de couleur pour la qualité de connexion
  const getConnectionQualityClasses = () => {
    switch (connectionQuality) {
      case 'good': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };
  
  // Rendu selon le mode
  if (mode === 'badge') {
    return (
      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
        internalIsOnline 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      } ${className}`}>
        {internalIsOnline ? (
          <>
            <Wifi className="h-3 w-3 mr-1" />
            <span>Connecté</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 mr-1" />
            <span>Hors ligne</span>
          </>
        )}
        
        {isTesting && (
          <RefreshCw className="h-3 w-3 ml-1 animate-spin" />
        )}
      </div>
    );
  }
  
  if (mode === 'minimal') {
    return (
      <button 
        className={`inline-flex items-center justify-center rounded-full h-8 w-8 ${
          internalIsOnline 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-red-100 text-red-800 hover:bg-red-200'
        } ${className}`}
        onClick={testConnection}
        title={internalIsOnline ? 'Connecté' : 'Hors ligne'}
      >
        {isTesting ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : internalIsOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
      </button>
    );
  }
  
  // Mode complet
  return (
    <div className={`${pinned ? 'fixed bottom-4 right-4 z-50' : ''} ${className}`}>
      <div className={`rounded-lg shadow-lg overflow-hidden ${internalIsOnline ? 'border-green-200' : 'border-red-200'} border`}>
        <div className={`p-3 ${internalIsOnline ? 'bg-green-50' : 'bg-red-50'} flex justify-between items-center`}>
          <div className="flex items-center">
            {internalIsOnline ? (
              <>
                <Wifi className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Connecté</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-medium text-red-800">Hors ligne</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {showStats && bandwidthSpeed && internalIsOnline && (
              <div className={`text-xs px-2 py-0.5 rounded-full bg-white flex items-center ${getConnectionQualityClasses()}`}>
                <Signal className="h-3 w-3 mr-1" />
                {bandwidthSpeed.toFixed(1)} Mbps
              </div>
            )}
            
            <button 
              className={`p-1 rounded-full ${
                internalIsOnline ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              } ${isTesting ? 'animate-pulse' : ''}`}
              onClick={testConnection}
              disabled={isTesting}
            >
              <RefreshCw className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
            </button>
            
            {onToggleOfflineMode && (
              <button 
                className={`p-1 rounded-full ${internalIsOnline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                onClick={onToggleOfflineMode}
              >
                {internalIsOnline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
        
        {showStats && (
          <div className="bg-white p-3 text-xs">
            <div className="flex items-center justify-between">
              {lastTestTime && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-gray-600">Dernier test: {lastTestTime}</span>
                </div>
              )}
              
              {internalIsOnline && offlineActions > 0 && (
                <div className="flex items-center">
                  <Activity className="h-3 w-3 text-yellow-600 mr-1" />
                  <span className="text-yellow-700">{offlineActions} actions en attente</span>
                </div>
              )}
              
              {internalIsOnline && lastSyncTime && (
                <div className="flex items-center">
                  <RefreshCw className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-blue-700">Dernière sync: {lastSyncTime}</span>
                </div>
              )}
              
              {!internalIsOnline && (
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-700">Mode hors ligne actif</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatusMonitor;