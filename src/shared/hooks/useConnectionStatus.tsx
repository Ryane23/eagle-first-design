import { useState, useEffect } from 'react';

export interface ConnectionStatus {
  isOnline: boolean;
  bandwidth?: number;
  latency?: number;
  lastConnected?: Date;
}

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    bandwidth: 0,
    latency: 0
  });

  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleConnection = () => {
    setStatus(prev => ({ ...prev, isOnline: !prev.isOnline }));
  };

  return { status, toggleConnection };
};