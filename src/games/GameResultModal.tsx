import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, RotateCcw, ArrowLeft, Home } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';

interface GameResultModalProps {
  isOpen: boolean;
  gameTitle: string;
  score: number;
  xpEarned: number;
  coinsEarned: number;
  isNewHighScore?: boolean;
  onPlayAgain: () => void;
  onBackToArcade: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  gameTitle,
  score,
  xpEarned,
  coinsEarned,
  isNewHighScore = false,
  onPlayAgain,
  onBackToArcade,
}) => {
  const { returnToUniverseHub } = useUniverseStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md bg-slate-900/95 border-2 border-yellow-400 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(255,229,0,0.3)] overflow-hidden"
          initial={{ scale: 0.85, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 20 }}
        >
          {/* Top Flare */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Trophy Icon */}
          <div className="w-16 h-16 rounded-2xl bg-yellow-400/20 border border-yellow-400 mx-auto flex items-center justify-center text-yellow-400 shadow-neon-yellow mb-4">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
            {gameTitle}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-orbitron tracking-wider mt-1">
            GAME COMPLETE
          </h3>

          {isNewHighScore && (
            <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-yellow-400 text-black font-mono font-bold text-xs tracking-wider shadow-neon-yellow animate-bounce-short">
              ★ NEW HIGH SCORE! ★
            </div>
          )}

          {/* Score & Rewards Card */}
          <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-slate-400">FINAL SCORE</span>
              <span className="text-2xl font-black text-white font-orbitron">{score}</span>
            </div>

            <div className="h-px bg-slate-800" />

            <div className="flex items-center justify-around text-xs font-mono">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>+{xpEarned} XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span>🪙</span>
                <span>+{coinsEarned} COINS</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onPlayAgain}
              className="w-full py-3 rounded-xl bg-yellow-400 text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-neon-yellow hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>

            <button
              onClick={onBackToArcade}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO ARCADE</span>
            </button>

            <button
              onClick={returnToUniverseHub}
              className="w-full py-2 text-[11px] font-mono text-slate-400 hover:text-yellow-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Universe Hub</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
