import React from 'react';
import { RotateCcw, Trophy, } from 'lucide-react';
// store hooks

interface GameResultScreenProps {
  gameTitle: string;
  score: number;
  highScore: number;
  xpEarned: number;
  coinsEarned: number;
  isVictory?: boolean;
  isNewHighScore?: boolean;
  customStats?: Array<{ label: string; value: string | number }>;
  onPlayAgain: () => void;
  onBackToArcade: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  gameTitle,
  score,
  highScore,
  xpEarned,
  coinsEarned,
  isVictory = false,
  isNewHighScore = false,
  customStats = [],
  onPlayAgain,
  onBackToArcade
}) => {
  // store hooks

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none">
      <div className="w-full max-w-md bg-slate-950 border border-yellow-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(255,229,0,0.25)] text-white text-center relative overflow-hidden">
        {/* Glow Header */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-500 p-1 mx-auto mb-4 shadow-[0_0_40px_rgba(255,229,0,0.5)]">
          <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-4xl">
            {isVictory ? '👑' : '🏁'}
          </div>
        </div>

        <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white mb-1">
          {isVictory ? 'VICTORY ACHIEVED!' : 'MATCH COMPLETED'}
        </h2>
        <p className="text-xs font-mono text-yellow-400 mb-6">{gameTitle}</p>

        {isNewHighScore && (
          <div className="mb-4 py-2 px-4 rounded-xl bg-yellow-400/20 border border-yellow-400 text-yellow-300 font-orbitron font-bold text-xs flex items-center justify-center gap-2 animate-bounce">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>NEW ALL-TIME RECORD!</span>
          </div>
        )}

        {/* Score & Rewards Box */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">FINAL SCORE</div>
            <div className="font-orbitron font-black text-xl text-yellow-400">{score.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">ALL-TIME BEST</div>
            <div className="font-orbitron font-black text-xl text-white">{highScore.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6">
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-300 font-bold">
            <span>⚡ +{xpEarned} XP</span>
          </div>
          <div className="text-slate-600">•</div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-amber-300 font-bold">
            <span>🪙 +{coinsEarned} COINS</span>
          </div>
        </div>

        {/* Custom Stats if any */}
        {customStats.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs font-mono">
            {customStats.map((st, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/50">
                <span className="text-slate-400">{st.label}: </span>
                <span className="text-white font-bold">{st.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-orbitron font-black text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,229,0,0.4)]"
          >
            <RotateCcw className="w-4 h-4" /> PLAY AGAIN
          </button>
          <button
            onClick={onBackToArcade}
            className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs hover:bg-slate-800"
          >
            ARCADE
          </button>
        </div>
      </div>
    </div>
  );
};
