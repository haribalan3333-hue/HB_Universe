import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Shield, Lock, Check } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { CHARACTER_SKINS, CHARACTER_AURAS } from '../../data/skins';

export const HBCharacterCustomizer: React.FC = () => {
  const {
    customizerOpen,
    setCustomizerOpen,
    character,
    setSkin,
    setAura,
    soundEnabled,
  } = useUniverseStore();

  if (!customizerOpen) return null;

  const handleClose = () => {
    if (soundEnabled) audioManager.playClick();
    setCustomizerOpen(false);
  };

  const handleSelectSkin = (skinId: string, unlocked: boolean, reqLevel: number) => {
    if (!unlocked && character.level < reqLevel) {
      if (soundEnabled) audioManager.playLockedWorld();
      return;
    }
    if (soundEnabled) audioManager.playClick();
    setSkin(skinId);
  };

  const handleSelectAura = (auraId: string, unlocked: boolean, reqLevel: number) => {
    if (!unlocked && character.level < reqLevel) {
      if (soundEnabled) audioManager.playLockedWorld();
      return;
    }
    if (soundEnabled) audioManager.playClick();
    setAura(auraId);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl bg-slate-900/90 border border-yellow-400/40 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(255,229,0,0.2)] max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-neon-yellow-sm">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-orbitron tracking-wider">
                  HB CHARACTER CUSTOMIZER
                </h3>
                <p className="text-xs text-slate-400 font-inter">
                  Equip pilot skins, quantum auras, and customized visual loadouts.
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

          {/* Character Preview Avatar */}
          <div className="my-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-2xl p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-cyan-400 shadow-[0_0_30px_rgba(255,229,0,0.4)]">
                <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 border border-yellow-400">
                  <img
                    src="/images/hb_pilot.png"
                    alt="HB Pilot Commander"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  ACTIVE LOADOUT
                </div>
                <h4 className="text-lg font-bold text-white font-orbitron">{character.name}</h4>
                <p className="text-xs text-slate-400 font-mono">
                  PLAYER LEVEL: <span className="text-yellow-400 font-bold">LV {character.level}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                Skin: {character.selectedSkin}
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Aura: {character.selectedAura}
              </span>
            </div>
          </div>

          {/* 1. OUTFITS / SKINS SELECTION */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-bold text-white font-orbitron flex items-center gap-2">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>PILOT OUTFITS & EXOSUITS</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHARACTER_SKINS.map((s) => {
                const isEquipped = character.selectedSkin === s.id;
                const isLocked = !s.unlocked && character.level < s.requiredLevel;

                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSkin(s.id, s.unlocked, s.requiredLevel)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isEquipped
                        ? 'bg-slate-950 border-yellow-400 shadow-[0_0_20px_rgba(255,229,0,0.3)]'
                        : isLocked
                        ? 'bg-slate-950/60 border-slate-800 opacity-60'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white font-orbitron">{s.name}</span>
                      {isEquipped ? (
                        <span className="px-2 py-0.5 rounded bg-yellow-400 text-black text-[10px] font-bold font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" /> EQUIPPED
                        </span>
                      ) : isLocked ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono flex items-center gap-1">
                          <Lock className="w-3 h-3" /> REQ LV {s.requiredLevel}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-cyan-400">UNLOCKED</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. QUANTUM AURAS SELECTION */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-bold text-white font-orbitron flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>QUANTUM VISUAL AURAS</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHARACTER_AURAS.map((a) => {
                const isEquipped = character.selectedAura === a.id;
                const isLocked = !a.unlocked && character.level < a.requiredLevel;

                return (
                  <div
                    key={a.id}
                    onClick={() => handleSelectAura(a.id, a.unlocked, a.requiredLevel)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isEquipped
                        ? 'bg-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : isLocked
                        ? 'bg-slate-950/60 border-slate-800 opacity-60'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: a.color }}
                        />
                        <span className="font-bold text-xs text-white font-orbitron">{a.name}</span>
                      </div>
                      {isEquipped ? (
                        <span className="px-2 py-0.5 rounded bg-cyan-400 text-black text-[10px] font-bold font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : isLocked ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono flex items-center gap-1">
                          <Lock className="w-3 h-3" /> REQ LV {a.requiredLevel}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400">READY</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{a.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">Auto-saved to Local Pilot Memory</span>
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl bg-yellow-400 text-black font-bold font-orbitron text-xs uppercase tracking-wider shadow-neon-yellow hover:scale-105 transition-transform cursor-pointer"
            >
              APPLY & CLOSE
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
