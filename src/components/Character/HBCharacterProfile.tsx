import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Shield, Award, Heart, Zap, Compass, CheckCircle2 } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { ACHIEVEMENTS_DATA } from '../../data/achievements';
import { CHARACTER_LORE } from '../../data/character';

export const HBCharacterProfile: React.FC = () => {
  const {
    profileModalOpen,
    setProfileModalOpen,
    character,
    setCustomizerOpen,
    unlockedWorlds,
    soundEnabled,
  } = useUniverseStore();

  if (!profileModalOpen) return null;

  const handleClose = () => {
    if (soundEnabled) audioManager.playClick();
    setProfileModalOpen(false);
  };

  const xpPercent = Math.min(100, Math.round((character.xp / character.maxXp) * 100));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-3xl bg-slate-900/90 border border-yellow-400/40 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(255,229,0,0.2)] max-h-[90vh] overflow-y-auto select-none"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-neon-yellow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-orbitron tracking-wider">
                  VANGUARD PILOT DOSSIER
                </h3>
                <p className="text-xs text-slate-400 font-inter">
                  Multidimensional clearance credentials and telemetry.
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Character Card */}
          <div className="my-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-2xl p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-cyan-400 shadow-[0_0_35px_rgba(255,229,0,0.4)] flex-shrink-0">
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 border border-yellow-400">
                <img
                  src="/images/hb_pilot.png"
                  alt="HB Pilot Commander"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="font-orbitron font-black text-2xl text-white">{character.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-black text-xs font-bold font-mono">
                  LEVEL {character.level}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono">
                  {character.rank}
                </span>
              </div>
              <p className="text-xs text-yellow-400 font-mono mb-1">
                {CHARACTER_LORE.codename} • {CHARACTER_LORE.classType}
              </p>
              <p className="text-xs text-slate-400 italic">"{CHARACTER_LORE.quote}"</p>

              {/* XP Gauge */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>EXPERIENCE PROGRESS</span>
                  <span className="text-yellow-400 font-bold">{character.xp} / {character.maxXp} ({xpPercent}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-cyan-400" style={{ width: `${xpPercent}%` }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setProfileModalOpen(false);
                setCustomizerOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-orbitron font-bold text-xs shadow-neon-yellow hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOMIZE</span>
            </button>
          </div>

          {/* Vitals & Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                <span>HEALTH</span>
              </div>
              <div className="text-base font-bold text-white font-orbitron">{character.health} / {character.maxHealth}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>ENERGY</span>
              </div>
              <div className="text-base font-bold text-white font-orbitron">{character.energy} / {character.maxEnergy}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
                <span className="text-sm">🪙</span>
                <span>COINS</span>
              </div>
              <div className="text-base font-bold text-yellow-400 font-orbitron">{character.coins.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXPLORED</span>
              </div>
              <div className="text-base font-bold text-cyan-400 font-orbitron">{unlockedWorlds.length} / 6 WORLDS</div>
            </div>
          </div>

          {/* Achievements Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-orbitron flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>PILOT MEDALS & ACCOMPLISHMENTS</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS_DATA.slice(0, 4).map((ach) => (
                <div key={ach.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{ach.title}</span>
                      {ach.unlocked ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">{ach.progress}/{ach.maxProgress}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
