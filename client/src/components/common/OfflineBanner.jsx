import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSync } from '../../store/useSyncStore';

export default function OfflineBanner() {
  const {
    isOnline,
    manualOfflineSimulation,
    toggleOfflineSimulation,
    pendingCount,
    isSyncing,
    syncPendingQueue,
    lastSyncTime
  } = useSync();

  return (
    <div className={`w-full border-b transition-colors ${
      isOnline 
        ? 'bg-agri-light/40 border-agri-border/60 text-agri-dark text-xs py-1.5 px-4' 
        : 'bg-amber-100 border-amber-300 text-amber-900 text-xs py-2 px-4'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-1.5 font-medium text-agri-dark">
              <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse"></span>
              <Wifi className="w-3.5 h-3.5 text-agri-green" />
              <span>Online Mode (इंटरनेट जुड़ा है)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-semibold text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
              <span>Offline Mode Active (ऑफ़लाइन कार्यशील) — Local ML & Advisory Active</span>
            </span>
          )}

          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold">
              <AlertCircle className="w-3 h-3" />
              {pendingCount} offline image(s) queued for sync
            </span>
          )}

          {lastSyncTime && isOnline && (
            <span className="text-[11px] text-agri-muted hidden md:inline">
              (Synced at {lastSyncTime})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && isOnline && (
            <button
              onClick={syncPendingQueue}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-agri-dark text-white rounded font-medium hover:bg-agri-dark/90 text-[11px]"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          )}

          <button
            onClick={toggleOfflineSimulation}
            className={`px-2 py-0.5 rounded border text-[11px] font-medium transition-all ${
              manualOfflineSimulation 
                ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700' 
                : 'bg-white text-agri-muted border-agri-border hover:text-agri-dark'
            }`}
            title="Toggle simulated offline mode to test offline capabilities without turning off Wi-Fi"
          >
            {manualOfflineSimulation ? 'Exit Simulated Offline' : 'Simulate Offline Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}
