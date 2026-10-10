import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Sparkles } from 'lucide-react';
import { detectLocalProgress } from '../../migration/LocalProgressDetector';
import { useUniverseStore } from '../../store/universeStore';

interface LocalMigrationModalProps {
  onClose: () => void;
  onImport: () => void;
}

export const LocalMigrationModal: React.FC<LocalMigrationModalProps> = ({ onClose, onImport }) => {
  const local = detectLocalProgress();
  const { showSpeech } = useUniverseStore();

  const handleImport = () => {
    showSpeech('✨ LOCAL PROGRESS IMPORTED & SYNCHRONIZED TO CLOUD!', 4000);
    onImport();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-cyan-400/50 p-6 sm:p-8 text-center space-y-6 shadow-[0_0_80px_rgba(0,240,255,0.4)]"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 mx-auto shadow-md">
            <Database className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              LOCAL DOSSIER DETECTED
            </span>
            <h2 className="text-2xl font-black font-orbitron text-white mt-1">
              SYNC LOCAL PROGRESS?
            </h2>
            <p className="text-xs text-slate-300 font-inter mt-1 leading-relaxed">
              We detected existing local progression from Phases 1–10 on this terminal:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-left">
            <div>
              <span className="text-slate-500 text-[10px]">PILOT LEVEL</span>
              <p className="font-bold text-white">LEVEL {local.level}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">COINS BALANCE</span>
              <p className="font-bold text-yellow-400">🪙 {local.coins}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">ACTIVITY STREAK</span>
              <p className="font-bold text-orange-400">{local.streak} DAYS</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">ACHIEVEMENTS</span>
              <p className="font-bold text-emerald-400">{local.achievementsCount} UNLOCKED</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleImport}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>IMPORT & CLOUD SYNC</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-orbitron text-xs font-bold uppercase cursor-pointer"
            >
              START FRESH (LEVEL 1)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
