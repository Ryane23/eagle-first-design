export const checkNetworkStatus = async (): Promise<{
  online: boolean;
  bandwidth?: number;
  latency?: number;
}> => {
  if (!navigator.onLine) {
    return { online: false };
  }

  try {
    const startTime = performance.now();
    const response = await fetch('/api/ping', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    const latency = performance.now() - startTime;

    return {
      online: response.ok,
      latency: Math.round(latency)
    };
  } catch (error) {
    return { online: false };
  }
};

export const simulateOfflineMode = (): void => {
  // Simulation du mode hors ligne pour les tests
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false
  });
  
  window.dispatchEvent(new Event('offline'));
};

export const simulateOnlineMode = (): void => {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true
  });
  
  window.dispatchEvent(new Event('online'));
};