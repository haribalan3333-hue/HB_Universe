import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Monitor, Shield, Database, Trash2, LogOut } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';
import { AuthManager } from '../auth/AuthManager';
import { pageVariants } from '../animations/transitions';

export const SettingsPage: React.FC = () => {
  const {
    soundEnabled,
    musicEnabled,
    reducedMotion,
    toggleSound,
    toggleMusic,
    toggleReducedMotion,
    showSpeech,
  } = useUniverseStore();

  const user = AuthManager.getStoredUser();
  const [activeTab, setActiveTab] = useState<'AUDIO' | 'GRAPHICS' | 'ACCOUNT' | 'DATA'>('AUDIO');

  const handleLogout = () => {
    AuthManager.clearSession();
    showSpeech('LOGGED OUT. GUEST MODE ACTIVE.', 3000);
    window.location.reload();
  };

  const handleClearCache = () => {
    localStorage.clear();
    showSpeech('LOCAL CACHE CLEARED.', 2500);
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 max-w-4xl mx-auto select-none pb-12"
    >
      <div>
        <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-1">
          SYSTEM <span className="text-yellow-400">SETTINGS</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-inter">
          Configure audio engines, rendering quality, cloud credentials, and data privacy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'AUDIO', label: 'AUDIO', icon: <Volume2 className="w-4 h-4" /> },
          { id: 'GRAPHICS', label: 'GRAPHICS & MOTION', icon: <Monitor className="w-4 h-4" /> },
          { id: 'ACCOUNT', label: 'ACCOUNT', icon: <Shield className="w-4 h-4" /> },
          { id: 'DATA', label: 'DATA & STORAGE', icon: <Database className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
        {activeTab === 'AUDIO' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h4 className="font-orbitron font-bold text-sm text-white">Audio Effects Engine</h4>
                <p className="text-xs text-slate-400">Play spatial portal and interactive UI sounds</p>
              </div>
              <button
                onClick={toggleSound}
                className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold ${
                  soundEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h4 className="font-orbitron font-bold text-sm text-white">Multiverse Soundtrack</h4>
                <p className="text-xs text-slate-400">Ambient synthwave and cosmic background lo-fi</p>
              </div>
              <button
                onClick={toggleMusic}
                className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold ${
                  musicEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {musicEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'GRAPHICS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h4 className="font-orbitron font-bold text-sm text-white">Reduced Motion Mode</h4>
                <p className="text-xs text-slate-400">Minimize camera warp transitions and particle intense animations</p>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold ${
                  reducedMotion ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {reducedMotion ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ACCOUNT' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase">AUTHENTICATED PILOT</span>
                <h3 className="font-orbitron font-bold text-base text-white">{user ? user.display_name : 'Guest Pilot'}</h3>
                <p className="text-xs text-slate-400">{user ? user.email : 'Local Session'}</p>
              </div>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-orbitron text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" /> LOGOUT
                </button>
              ) : (
                <span className="text-xs font-mono text-slate-500">GUEST MODE</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'DATA' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-orbitron font-bold text-sm text-white">Clear Local Terminal Cache</h4>
                <p className="text-xs text-slate-400">Resets local browser cache and reload workspace</p>
              </div>
              <button
                onClick={handleClearCache}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-orbitron text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" /> CLEAR CACHE
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
