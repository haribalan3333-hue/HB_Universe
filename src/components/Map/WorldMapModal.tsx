import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  Lock,
  Unlock,
  Sparkles,
  Layers,
  Gamepad2,
  Film,
  Headphones,
  Bot,
  Trophy,
} from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { WORLDS_DATA } from '../../data/worlds';
import { WorldData } from '../../types';

export const WorldMapModal: React.FC = () => {
  const {
    worldMapOpen,
    setWorldMapOpen,
    character,
    unlockedWorlds,
    hoveredWorld,
    setHoveredWorld,
    initiatePortalTravel,
    soundEnabled,
  } = useUniverseStore();

  if (!worldMapOpen) return null;

  const handleClose = () => {
    if (soundEnabled) audioManager.playMapClose();
    setWorldMapOpen(false);
  };

  const handleSelectWorld = (world: WorldData) => {
    const isUnlocked = unlockedWorlds.includes(world.id);
    if (!isUnlocked) {
      if (soundEnabled) audioManager.playLockedWorld();
      return;
    }
    setWorldMapOpen(false);
    initiatePortalTravel(world.id);
  };

  const mapCoordinates: Record<string, { x: number; y: number }> = {
    mystery: { x: 50, y: 15 },
    cinema: { x: 22, y: 35 },
    ai: { x: 78, y: 35 },
    arcade: { x: 22, y: 68 },
    music: { x: 78, y: 68 },
    challenge: { x: 50, y: 88 },
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5" />;
      case 'Film':
        return <Film className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative w-full max-w-5xl h-[90vh] max-h-[850px] bg-slate-900/80 border border-yellow-400/30 rounded-3xl p-6 md:p-8 flex flex-col shadow-[0_0_80px_rgba(255,229,0,0.15)] overflow-hidden"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black tracking-wider text-white">
                    HB UNIVERSE MAP
                  </h2>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                    Constellation Radar v5.0
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Topological Nexus • Player Level: <span className="text-yellow-400 font-bold">LV {character.level}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 hover:border-yellow-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Map Interactive Canvas */}
          <div className="relative flex-1 my-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,229,0,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

            {/* SVG Constellation Vectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {WORLDS_DATA.map((w: WorldData) => {
                const isUnlocked = unlockedWorlds.includes(w.id);
                const coords = mapCoordinates[w.id] || { x: 50, y: 50 };
                return (
                  <g key={'line-' + w.id}>
                    <line
                      x1="50%"
                      y1="50%"
                      x2={coords.x + '%'}
                      y2={coords.y + '%'}
                      stroke={isUnlocked ? w.themeColor : '#334155'}
                      strokeWidth={isUnlocked ? '2' : '1'}
                      strokeDasharray={isUnlocked ? 'none' : '4 4'}
                      opacity={isUnlocked ? 0.6 : 0.25}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central HB Hub Node */}
            <div
              className="absolute z-10 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-default"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-yellow-400/30 to-purple-600/30 border-2 border-yellow-400 p-1 flex items-center justify-center shadow-[0_0_30px_rgba(255,229,0,0.4)]">
                <div className="w-full h-full rounded-xl bg-slate-900/90 flex flex-col items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  <span className="text-[10px] font-black text-white mt-0.5">HB HUB</span>
                </div>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-yellow-300 mt-1 uppercase">
                Core Origin
              </span>
            </div>

            {/* World Star Nodes */}
            {WORLDS_DATA.map((w: WorldData) => {
              const isUnlocked = unlockedWorlds.includes(w.id);
              const coords = mapCoordinates[w.id] || { x: 50, y: 50 };
              const isHovered = hoveredWorld?.id === w.id;

              return (
                <motion.button
                  key={w.id}
                  onClick={() => handleSelectWorld(w)}
                  onMouseEnter={() => {
                    setHoveredWorld(w);
                    if (soundEnabled) audioManager.playHover();
                  }}
                  onMouseLeave={() => setHoveredWorld(null)}
                  className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 focus:outline-none group cursor-pointer"
                  style={{ left: coords.x + '%', top: coords.y + '%' }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg ${
                      isUnlocked
                        ? 'bg-slate-900/90 hover:shadow-[0_0_25px_var(--glow)] text-white'
                        : 'bg-slate-950/80 border-slate-800 opacity-70 grayscale text-slate-500'
                    }`}
                    style={
                      {
                        borderColor: isUnlocked ? w.themeColor : '#334155',
                        '--glow': w.themeColor,
                      } as React.CSSProperties
                    }
                  >
                    {renderIcon(w.iconName)}

                    <div
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] border shadow"
                      style={{
                        backgroundColor: isUnlocked ? '#0284c7' : '#1e293b',
                        borderColor: isUnlocked ? '#38bdf8' : '#475569',
                        color: '#ffffff',
                      }}
                    >
                      {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </div>
                  </div>

                  <div
                    className={`mt-2 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase border transition-all ${
                      isHovered
                        ? 'bg-slate-900 border-yellow-400 text-white shadow-[0_0_15px_rgba(255,229,0,0.3)]'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    {w.name}
                  </div>
                  {!isUnlocked && (
                    <span className="text-[9px] font-mono text-amber-400 mt-0.5">
                      REQ LV {w.requiredLevel}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-3 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span>5 Dimensions Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span>1 Void Dimension Locked</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-yellow-400" />
              <span>Select any illuminated node to initiate instant dimensional warp</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
