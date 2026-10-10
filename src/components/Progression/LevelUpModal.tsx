import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Key, ArrowRight } from 'lucide-react';
import { getRankForLevel } from '../../progression/RankManager';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  const rank = getRankForLevel(level);
  const isMysteryUnlocked = level >= 20;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-950 border-2 border-yellow-400 p-8 text-center space-y-6 shadow-[0_0_100px_rgba(255,229,0,0.5)]"
        >
          {/* Pulsing Crown / Trophy */}
          <div className="w-24 h-24 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 mx-auto shadow-[0_0_40px_rgba(255,229,0,0.7)] animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest animate-pulse">
              ✨ ASCENSION PROTOCOL ✨
            </span>
            <h2 className="text-4xl font-black font-orbitron text-white mt-1">
              LEVEL {level}!
            </h2>
            <p className="text-sm font-mono text-cyan-300 mt-1">
              RANK: {rank.title} ({rank.badge})
            </p>
          </div>

          {/* Mystery World Unlock Banner if Level 20 */}
          {isMysteryUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-purple-500/20 border border-purple-500 text-left space-y-1 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              <div className="flex items-center gap-2 text-purple-300 font-orbitron font-bold text-xs">
                <Key className="w-4 h-4 text-purple-400" />
                <span>MYSTERY WORLD GATEWAY UNLOCKED!</span>
              </div>
              <p className="text-xs font-inter text-slate-300">
                You have attained Level 20. The dimensional barrier guarding Sector 07 has dissolved!
              </p>
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-3 text-xs font-mono text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>+250 COINS & NEW STAT BOOST AWARDED</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-orbitron text-xs font-black uppercase tracking-wider shadow-neon-yellow flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONTINUE EXPLORATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
