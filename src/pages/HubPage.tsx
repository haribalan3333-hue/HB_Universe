import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Eye, Sparkles, User } from 'lucide-react';
import { UniverseScene } from '../components/Universe/UniverseScene';
import { WebGLFallback } from '../components/Universe/WebGLFallback';
import { WorldInfoCard } from '../components/Hub/WorldInfoCard';
import { DesktopControlsHelp } from '../components/Character/DesktopControlsHelp';
import { MobileControls } from '../components/Character/MobileControls';
import { useUniverseStore } from '../store/universeStore';
import { pageVariants } from '../animations/transitions';
import { audioManager } from '../audio/audioManager';
import { WORLDS_DATA } from '../data/worlds';

export const HubPage: React.FC = () => {
  const {
    setWorldMapOpen,
    setCustomizerOpen,
    setProfileModalOpen,
    use3DScene,
    toggle3DScene,
    hoveredWorld,
    selectedWorld,
  } = useUniverseStore();

  const arcade = WORLDS_DATA.find((w) => w.id === 'arcade')!;
  const activeInspection = hoveredWorld || selectedWorld || arcade;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Top Action & Mode Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0e0e1a]/85 border border-white/[0.08] backdrop-blur-xl shadow-glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-neon-yellow-sm overflow-hidden p-0.5">
            <img src="/images/hb_logo.png" alt="HB UNIVERSE" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <div className="font-orbitron font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>HB UNIVERSE 3D CITY</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-400 text-black font-bold">
                PHASE 4
              </span>
            </div>
            <div className="text-xs text-gray-400 font-inter">
              Move HB using WASD/Arrows, approach portals to interact, and customize your 3D avatar.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Customize Avatar button */}
          <button
            onClick={() => {
              audioManager.playClick();
              setCustomizerOpen(true);
            }}
            onMouseEnter={() => audioManager.playHover()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400 hover:text-black font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CUSTOMIZE</span>
          </button>

          {/* Dossier button */}
          <button
            onClick={() => {
              audioManager.playClick();
              setProfileModalOpen(true);
            }}
            onMouseEnter={() => audioManager.playHover()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>DOSSIER</span>
          </button>

          {/* Toggle 3D / 2D view button */}
          <button
            onClick={() => {
              audioManager.playClick();
              toggle3DScene();
            }}
            onMouseEnter={() => audioManager.playHover()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{use3DScene ? '2D VIEW' : '3D SCENE'}</span>
          </button>

          {/* Topology Map button */}
          <button
            onClick={() => {
              audioManager.playMapOpen();
              setWorldMapOpen(true);
            }}
            onMouseEnter={() => audioManager.playHover()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-neon-yellow hover:scale-105 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>WORLD MAP</span>
          </button>
        </div>
      </div>

      {/* Main 3D / 2D Interactive Stage */}
      {use3DScene ? <UniverseScene /> : <WebGLFallback />}

      {/* Real-time World Inspection Panel */}
      <div className="w-full flex justify-center">
        <WorldInfoCard world={activeInspection} />
      </div>

      {/* Desktop Controls Floating Overlay */}
      {use3DScene && <DesktopControlsHelp />}

      {/* Mobile Virtual Joystick & Action Overlay */}
      {use3DScene && <MobileControls />}
    </motion.div>
  );
};
