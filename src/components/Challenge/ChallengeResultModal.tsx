import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';

interface ChallengeResultModalProps {
  results: {
    score: number;
    accuracy: number;
    timeTakenSeconds: number;
    xpEarned: number;
    coinsEarned: number;
  };
  onPlayAgain: () => void;
  onBackToArena: () => void;
}

export const ChallengeResultModal: React.FC<ChallengeResultModalProps> = ({
  results,
  onPlayAgain,
  onBackToArena,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-cyan-400/50 p-6 sm:p-8 text-center space-y-6 shadow-[0_0_80px_rgba(0,240,255,0.4)]"
      >
        <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_30px_rgba(0,240,255,0.5)]">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            TRIAL CONCLUDED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-white mt-1">
            CHALLENGE COMPLETE!
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">SCORE</span>
            <p className="font-orbitron font-bold text-base text-cyan-300 mt-0.5">{results.score}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">ACCURACY</span>
            <p className="font-orbitron font-bold text-base text-emerald-400 mt-0.5">{results.accuracy}%</p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">TIME</span>
            <p className="font-orbitron font-bold text-base text-yellow-400 mt-0.5">{results.timeTakenSeconds}s</p>
          </div>
        </div>

        {/* Rewards Earned */}
        <div className="flex items-center justify-center gap-4 py-2">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> +{results.xpEarned} XP
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-mono text-xs font-bold">
            🪙 +{results.coinsEarned} COINS
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onBackToArena}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>BACK TO ARENA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
