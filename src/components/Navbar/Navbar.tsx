import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, Maximize2, Globe, Sliders, User, LogIn } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { TabType } from '../../types';
import { AuthManager } from '../../auth/AuthManager';
import { AuthModal } from '../Auth/AuthModal';
import { SyncStatusBadge } from '../Sync/SyncStatusBadge';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    character,
    soundEnabled,
    toggleSound,
    musicEnabled,
    toggleMusic,
    setWorldMapOpen,
    setSettingsOpen,
  } = useUniverseStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const user = AuthManager.getStoredUser();

  const navItems: { id: TabType; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'worlds', label: 'WORLDS' },
    { id: 'play', label: 'PLAY' },
    { id: 'rank', label: 'RANK' },
    { id: 'profile', label: 'PROFILE' },
  ];

  const handleTabClick = (id: TabType) => {
    try { audioManager.playClick(); } catch {}
    useUniverseStore.setState({ currentWorldId: null });
    setCurrentTab(id);
  };

  const handleToggleSound = () => {
    try { audioManager.playClick(); } catch {}
    toggleSound();
  };

  const handleToggleMusic = () => {
    try { audioManager.playClick(); } catch {}
    toggleMusic();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-yellow-400/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-[0_0_15px_rgba(255,229,0,0.4)] group-hover:scale-105 transition-transform">
            <img src="/images/hb_logo.png" alt="HB Universe Logo" className="w-full h-full object-cover rounded-[9px]" />
          </div>
          <div className="hidden sm:block">
            <span className="font-orbitron font-black text-base tracking-wider bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              HB UNIVERSE
            </span>
            <span className="block text-[10px] font-mono text-slate-400 tracking-widest uppercase">
              One Website. Infinite Worlds.
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3.5 py-1.5 rounded-xl font-orbitron text-xs font-bold transition-all relative ${
                  isActive
                    ? 'text-black bg-yellow-400 shadow-[0_0_15px_rgba(255,229,0,0.5)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              try { audioManager.playClick(); } catch {}
              setWorldMapOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl font-orbitron text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>WORLD MAP</span>
          </button>
        </nav>

        {/* Right Section: Cloud Sync + HUD Stats + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Phase 12 Cloud Sync Badge */}
          <SyncStatusBadge />

          {/* Coins Display */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-yellow-400/30 text-yellow-400 font-mono text-xs font-bold shadow-[0_0_10px_rgba(255,229,0,0.15)]">
            <span>🪙</span>
            <span>{character.coins.toLocaleString()}</span>
          </div>

          {/* Level Display */}
          <div className="hidden xs:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white font-mono text-xs font-bold">
            <span className="text-yellow-400">LV</span>
            <span>{character.level}</span>
          </div>

          {/* Auth ID / Profile Gateway Button */}
          <button
            onClick={() => {
              try { audioManager.playClick(); } catch {}
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/40 text-yellow-300 hover:text-yellow-200 font-orbitron text-xs font-bold transition-all hover:scale-105"
            title={user ? `Logged in as @${user.username}` : 'Login or Create HB ID'}
          >
            {user ? <User className="w-3.5 h-3.5 text-yellow-400" /> : <LogIn className="w-3.5 h-3.5 text-yellow-400" />}
            <span className="hidden sm:inline">{user ? user.display_name.split(' ')[0] : 'HB ID'}</span>
          </button>

          {/* Controls: Audio, Settings, Fullscreen */}
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleToggleMusic}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title={musicEnabled ? 'Pause Space Ambient' : 'Play Space Ambient'}
            >
              <Radio className={`w-4 h-4 ${musicEnabled ? 'text-cyan-400 animate-pulse' : ''}`} />
            </button>

            <button
              onClick={() => {
                try { audioManager.playClick(); } catch {}
                setSettingsOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Universe Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors hidden sm:block"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal Trigger */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </header>
  );
};
