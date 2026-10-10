import React, { useState, useEffect } from 'react';
import { NetworkManager } from './NetworkManager';
import { NetworkState } from './networkTypes';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const OnlineStatus: React.FC = () => {
  const [netState, setNetState] = useState<NetworkState>(NetworkManager.getState());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    NetworkManager.init();
    return NetworkManager.subscribe(state => {
      setNetState(state);
      if (state !== 'ONLINE') {
        setVisible(true);
      } else {
        setTimeout(() => setVisible(false), 3000);
      }
    });
  }, []);

  if (!visible && netState === 'ONLINE') return null;

  return (
    <div
      className={`fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full font-mono text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-xl transition-all ${
        netState === 'ONLINE'
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
          : netState === 'RECONNECTING'
          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse'
          : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
      }`}
    >
      {netState === 'ONLINE' && <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
      {netState === 'RECONNECTING' && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
      {netState === 'OFFLINE' && <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
      <span>
        {netState === 'ONLINE' && 'NETWORK RESTORED • CLOUD SYNCED'}
        {netState === 'RECONNECTING' && 'RECONNECTING TO CLOUD...'}
        {netState === 'OFFLINE' && 'OFFLINE MODE • LOCAL PLAY ACTIVE'}
      </span>
    </div>
  );
};
