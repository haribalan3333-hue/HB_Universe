import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { WorldData } from '../../types';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface WorldInfoCardProps {
  world: WorldData | null;
}

export const WorldInfoCard: React.FC<WorldInfoCardProps> = ({ world }) => {
  const { character, initiatePortalTravel, openWorldModal } = useUniverseStore();

  if (!world) {
    return (
      <div className="w-full max-w-md p-4 rounded-2xl bg-[#0b0b14]/70 border border-white/[0.06] backdrop-blur-md text-center text-xs font-mono text-gray-400">
        <Sparkles className="w-4 h-4 mx-auto text-yellow-400 mb-1 animate-pulse" />
        <span>HOVER OR CLICK ANY DIMENSIONAL PORTAL TO INSPECT PARAMETERS</span>
      </div>
    );
  }

  const isLocked = world.locked || character.level < world.requiredLevel;
  const levelProgress = Math.min(100, Math.round((character.level / world.requiredLevel) * 100));

  const handleEnterWorld = () => {
    if (isLocked) {
      audioManager.playLockedWorld();
      openWorldModal(world);
      return;
    }
    audioManager.playWarp();
    initiatePortalTravel(world.id);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={world.id}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl bg-[#0e0e1c]/90 border border-white/[0.1] backdrop-blur-2xl shadow-glass-panel relative overflow-hidden"
      >
        {/* Top visual image banner */}
        {world.image && (
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={world.image}
              alt={world.name}
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1c] via-[#0e0e1c]/40 to-transparent" />
            
            {/* World Category Tag */}
            <div className="absolute bottom-2 left-4 text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-bold drop-shadow">
              {world.category}
            </div>
          </div>
        )}

        <div className="p-5 pt-3">
          <div 
            className="absolute top-0 left-0 right-0 h-1 shadow-[0_0_12px]"
            style={{ backgroundColor: isLocked ? '#EF4444' : world.themeColor }}
          />

          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="font-orbitron font-black text-xl text-white">
                {world.name}
              </h3>
            </div>

            {isLocked ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>LOCKED • LV {world.requiredLevel}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>UNLOCKED</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-300 font-inter mb-3 leading-relaxed">
            {world.description}
          </p>

          {isLocked && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25">
              <div className="flex justify-between items-center text-[11px] font-mono text-gray-300 mb-1">
                <span>UNLOCK REQUIREMENT: LEVEL {world.requiredLevel}</span>
                <span className="text-red-400 font-bold">Current: LV {character.level} ({levelProgress}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 font-inter mt-1 italic">
                Gain {world.requiredLevel - character.level} more levels in Arcade or Challenge arenas to unlock.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 text-xs font-mono">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[9px] text-gray-400">CONTENT</div>
              <div className="font-bold text-white text-[11px]">{world.stats.availableCount}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[9px] text-gray-400">REWARD</div>
              <div className="font-bold text-yellow-400 text-[11px]">+{world.stats.rewardXp} XP</div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] col-span-2 sm:col-span-1">
              <div className="text-[9px] text-gray-400">BOUNTY</div>
              <div className="font-bold text-yellow-400 text-[11px]">🪙 +{world.stats.rewardCoins}</div>
            </div>
          </div>

          <button
            onClick={handleEnterWorld}
            onMouseEnter={() => audioManager.playHover()}
            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-orbitron font-bold text-xs tracking-wider uppercase transition-all duration-200 ${
              isLocked
                ? 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                : 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black shadow-neon-yellow hover:scale-[1.02]'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4" />
                <span>DIMENSION LOCKED (REQ LEVEL 20)</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>ENTER {world.name}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
