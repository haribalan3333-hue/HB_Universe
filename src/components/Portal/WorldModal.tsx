import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, ChevronRight, Sparkles, Compass } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

export const WorldModal: React.FC = () => {
  const {
    isWorldModalOpen,
    selectedWorld,
    closeWorldModal,
    initiatePortalTravel,
    unlockedWorlds,
    soundEnabled,
  } = useUniverseStore();

  if (!isWorldModalOpen || !selectedWorld) return null;

  const isUnlocked = unlockedWorlds.includes(selectedWorld.id);

  const handleClose = () => {
    if (soundEnabled) audioManager.playClick();
    closeWorldModal();
  };

  const handleEnterWorld = () => {
    if (!isUnlocked) {
      if (soundEnabled) audioManager.playLockedWorld();
      return;
    }
    initiatePortalTravel(selectedWorld.id);
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
          className="relative w-full max-w-2xl bg-slate-900/90 border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl"
          style={{
            borderColor: selectedWorld.themeColor + '60',
            boxShadow: '0 0 60px ' + selectedWorld.themeColor + '20',
          }}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span
                className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: selectedWorld.themeColor + '15',
                  borderColor: selectedWorld.themeColor + '40',
                  color: selectedWorld.themeColor,
                }}
              >
                {selectedWorld.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-orbitron mt-2">
                {selectedWorld.name}
              </h2>
              <p className="text-xs text-slate-400 font-inter mt-1">{selectedWorld.subtitle}</p>
            </div>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description & Lore */}
          <div className="my-5 space-y-3">
            <p className="text-sm text-slate-300 font-inter leading-relaxed">
              {selectedWorld.description}
            </p>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 font-mono italic">
              "{selectedWorld.loreSnippet}"
            </div>
          </div>

          {/* Features List */}
          <div className="mb-6">
            <div className="text-xs font-mono text-slate-400 uppercase mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIMENSIONAL MODULES</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {selectedWorld.features.map((f, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-yellow-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                +{selectedWorld.stats.rewardXp} XP REWARD
              </span>
            </div>

            <button
              onClick={handleEnterWorld}
              className={`px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isUnlocked
                  ? 'bg-yellow-400 text-black shadow-neon-yellow hover:scale-105'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? (
                <>
                  <span>ENTER WORLD</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>REQ LEVEL {selectedWorld.requiredLevel}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
