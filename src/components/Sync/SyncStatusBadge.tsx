import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, AlertTriangle, Zap, CheckCircle2, X } from 'lucide-react';
import { SyncManager } from '../../sync/SyncManager';
import { SyncState } from '../../sync/syncTypes';
import { SyncQueue } from '../../sync/SyncQueue';
import { useAuth } from '../../auth/AuthManager';

export const SyncStatusBadge: React.FC = () => {
  const [syncState, setSyncState] = useState<SyncState>(SyncState.SYNCED);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const queueCount = SyncQueue.getQueue().length;

  useEffect(() => {
    SyncManager.init();
    return SyncManager.subscribe(state => setSyncState(state));
  }, []);

  const handleManualSync = async () => {
    await SyncManager.sync();
  };

  const badgeConfig = {
    [SyncState.SYNCED]: {
      icon: <Cloud className="w-3 h-3 text-cyan-400" />,
      text: 'CLOUD SYNCED',
      color: 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
    },
    [SyncState.SYNCING]: {
      icon: <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />,
      text: 'SYNCING...',
      color: 'bg-amber-500/10 border-amber-400/30 text-amber-300'
    },
    [SyncState.OFFLINE]: {
      icon: <Zap className="w-3 h-3 text-yellow-400" />,
      text: 'OFFLINE MODE',
      color: 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300'
    },
    [SyncState.ERROR]: {
      icon: <AlertTriangle className="w-3 h-3 text-rose-400" />,
      text: 'SYNC ALERT',
      color: 'bg-rose-500/10 border-rose-400/30 text-rose-300'
    },
    [SyncState.CONFLICT]: {
      icon: <AlertTriangle className="w-3 h-3 text-purple-400" />,
      text: 'RESOLVING',
      color: 'bg-purple-500/10 border-purple-400/30 text-purple-300'
    }
  }[syncState];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold transition-all hover:scale-105 ${badgeConfig.color}`}
        title="Cross-Device Cloud Sync Status"
      >
        {badgeConfig.icon}
        <span>{badgeConfig.text}</span>
        {queueCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] flex items-center justify-center font-bold">
            {queueCount}
          </span>
        )}
      </button>

      {/* Sync Status Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
          <div className="w-full max-w-md bg-slate-950 border border-cyan-400/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(0,240,255,0.2)] text-white relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-white">CLOUD SYNCHRONIZATION</h3>
                <p className="text-xs font-mono text-slate-400">Phase 12 Real-Time Data Pipeline</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-xs font-inter mb-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account Status:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {isAuthenticated ? 'AUTH PILOT' : 'GUEST (LOCAL ONLY)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cloud Pipeline:</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE & READY
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pending Actions in Queue:</span>
                <span className="font-mono font-bold text-yellow-400">{queueCount} events</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Authoritative Protocol:</span>
                <span className="font-mono text-slate-300">Server-Validated (Idempotent)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleManualSync}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-orbitron font-black text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> SYNC NOW
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
