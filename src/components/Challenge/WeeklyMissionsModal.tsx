import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface WeeklyMissionsModalProps {
  onClose: () => void;
}

export const WeeklyMissionsModal: React.FC<WeeklyMissionsModalProps> = ({ onClose }) => {
  const { addXp, addCoins, showSpeech, soundEnabled } = useUniverseStore();

  const missions = [
    { id: '1', title: 'Arcade Champion', desc: 'Play 3 Arcade mini-games', progress: 3, target: 3, xp: 150, coins: 100, claimed: false },
    { id: '2', title: 'Cinema Aficionado', desc: 'Watch 2 movies or trailers', progress: 2, target: 2, xp: 120, coins: 80, claimed: false },
    { id: '3', title: 'Harmonic Sync', desc: 'Tune into 5 music tracks', progress: 4, target: 5, xp: 100, coins: 60, claimed: false },
    { id: '4', title: 'Neural Dialogues', desc: 'Interact with 3 AI characters', progress: 3, target: 3, xp: 140, coins: 90, claimed: false },
    { id: '5', title: 'Arena Conqueror', desc: 'Complete 3 challenge arena trials', progress: 2, target: 3, xp: 160, coins: 110, claimed: false },
  ];

  const handleClaimMission = (m: typeof missions[0]) => {
    if (soundEnabled) audioManager.playClick();
    addXp(m.xp);
    addCoins(m.coins);
    showSpeech(`🎯 MISSION REWARD CLAIMED: +${m.xp} XP & +${m.coins} COINS!`, 3500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl rounded-3xl bg-slate-950 border border-purple-500/40 p-6 sm:p-8 flex flex-col space-y-6 shadow-[0_0_80px_rgba(168,85,247,0.3)] max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-4 h-4" /> MULTIVERSE CAMPAIGN
            </span>
            <h2 className="text-2xl font-black font-orbitron text-white mt-1">
              Weekly Operations
            </h2>
          </div>

          <div className="space-y-3">
            {missions.map((m) => {
              const isDone = m.progress >= m.target;
              const percent = Math.min(100, Math.round((m.progress / m.target) * 100));

              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <h4 className="font-orbitron font-bold text-sm text-white">{m.title}</h4>
                    <p className="text-xs text-slate-400 font-inter">{m.desc}</p>
                    <div className="w-full max-w-xs h-1.5 bg-slate-950 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                      {m.progress} / {m.target} ({percent}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-amber-400">+{m.xp} XP</span>
                    {isDone ? (
                      <button
                        onClick={() => handleClaimMission(m)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-orbitron text-xs font-bold uppercase cursor-pointer"
                      >
                        CLAIM
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-slate-500">IN PROGRESS</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
