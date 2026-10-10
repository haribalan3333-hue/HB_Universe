import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { ReturnToUniverse } from '../../navigation/ReturnToUniverse';
import { WorldBreadcrumb } from '../../navigation/WorldBreadcrumb';
import { useUniverseStore } from '../../store/universeStore';
import { pageVariants } from '../../animations/transitions';

export const MysteryWorld: React.FC = () => {
  const { character } = useUniverseStore();
  const isUnlocked = character.level >= 20;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 max-w-6xl mx-auto select-none"
    >
      <ReturnToUniverse worldName="MYSTERY WORLD" themeColor="#818CF8" />
      <WorldBreadcrumb worldName="MYSTERY WORLD" themeColor="#818CF8" />

      {/* Hero */}
      <div className="relative rounded-3xl bg-slate-950/90 border border-indigo-500/40 p-6 sm:p-10 overflow-hidden shadow-[0_0_80px_rgba(129,140,248,0.15)] backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/15 border-2 border-indigo-400 flex items-center justify-center text-indigo-400 shadow-[0_0_30px_rgba(129,140,248,0.5)]">
              {isUnlocked ? <Sparkles className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                DIMENSION SECTOR 06 • VOID ANOMALY
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-orbitron tracking-wider">
                MYSTERY WORLD
              </h1>
              <p className="text-sm text-slate-300 font-inter mt-1 max-w-xl">
                Encrypted temporal anomalies, hidden easter eggs, and uncharted outer-rim sectors.
              </p>
            </div>
          </div>
        </div>

        {!isUnlocked && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-orbitron font-bold text-white text-lg">SECURITY CLEARANCE RESTRICTED</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              This void dimension requires Pilot Level 20. Your current Level is {character.level}. Earn XP across other dimensions to unlock.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
