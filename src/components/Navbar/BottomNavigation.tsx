import React, { useState } from 'react';
import { Home, Gamepad2, User, Menu, Globe, Trophy, Sliders, X } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { TabType } from '../../types';
import { audioManager } from '../../audio/audioManager';

export const BottomNavigation: React.FC = () => {
  const { currentTab, setCurrentTab, setWorldMapOpen, setSettingsOpen } = useUniverseStore();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'worlds', label: 'Worlds', icon: <Globe className="w-5 h-5" /> },
    { id: 'play', label: 'Arcade', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'rank', label: 'Rank', icon: <Trophy className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const handleSelectTab = (id: TabType) => {
    try { audioManager.playClick(); } catch {}
    useUniverseStore.setState({ currentWorldId: null });
    setCurrentTab(id);
    setShowMoreMenu(false);
  };

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 border-t border-yellow-400/20 backdrop-blur-2xl select-none"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                  isActive ? 'text-yellow-400 scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive ? 'bg-yellow-400/15' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-orbitron font-bold mt-0.5 tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 hover:text-white"
          >
            <div className="p-1 rounded-xl">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-orbitron font-bold mt-0.5 tracking-wider">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile More Drawer Sheet */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end md:hidden select-none">
          <div className="bg-slate-950 border-t border-yellow-400/40 rounded-t-3xl p-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-orbitron font-black text-lg text-white">UNIVERSE QUICK ACCESS</h3>
              <button onClick={() => setShowMoreMenu(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  try { audioManager.playClick(); } catch {}
                  setWorldMapOpen(true);
                  setShowMoreMenu(false);
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left flex items-center gap-3 hover:border-cyan-400"
              >
                <Globe className="w-6 h-6 text-cyan-400" />
                <div>
                  <div className="font-orbitron font-bold text-xs text-white">WORLD MAP</div>
                  <div className="text-[10px] font-mono text-slate-400">All 7 Multiverse Worlds</div>
                </div>
              </button>

              <button
                onClick={() => {
                  try { audioManager.playClick(); } catch {}
                  setSettingsOpen(true);
                  setShowMoreMenu(false);
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left flex items-center gap-3 hover:border-yellow-400"
              >
                <Sliders className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="font-orbitron font-bold text-xs text-white">SETTINGS</div>
                  <div className="text-[10px] font-mono text-slate-400">Audio, Graphics & Cache</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
