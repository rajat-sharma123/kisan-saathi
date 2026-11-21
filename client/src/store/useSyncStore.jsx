import { useState, useEffect, createContext, useContext } from 'react';
import { offlineStorage } from '../services/offlineStorage';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const [isBrowserOnline, setIsBrowserOnline] = useState(navigator.onLine);
  const [manualOfflineSimulation, setManualOfflineSimulation] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Effective online status: false if browser is offline OR if user clicked simulate offline
  const isOnline = isBrowserOnline && !manualOfflineSimulation;

  const refreshPendingCount = async () => {
    try {
      const items = await offlineStorage.getPendingUploads();
      setPendingCount(items.length);
    } catch (e) {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      refreshPendingCount();
    };
    const handleOffline = () => {
      setIsBrowserOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    refreshPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingQueue = async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);

    try {
      const items = await offlineStorage.getPendingUploads();
      for (const item of items) {
        // Mock upload processing
        await new Promise(r => setTimeout(r, 600));
        await offlineStorage.deletePendingUpload(item.id);
      }
      await refreshPendingCount();
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleOfflineSimulation = () => {
    setManualOfflineSimulation(prev => !prev);
  };

  return (
    <SyncContext.Provider value={{
      isOnline,
      isBrowserOnline,
      manualOfflineSimulation,
      toggleOfflineSimulation,
      pendingCount,
      refreshPendingCount,
      isSyncing,
      syncPendingQueue,
      lastSyncTime
    }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
