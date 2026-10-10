import React from 'react';
import { Play, Trophy } from 'lucide-react';

interface GameStartScreenProps {
  title: string;
  subtitle: string;
  icon: string;
  highScore: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  onDifficultyChange?: (diff: 'EASY' | 'NORMAL' | 'HARD') => void;
  onStart: () => void;
  onBack: () => void;
  controlsHelp?: string[];
}

export const GameStartScreen: React.FC<GameStartScreenProps> = ({
  title,
  subtitle,
  icon,
  highScore,
  difficulty,
  onDifficultyChange,
  onStart,
  onBack,
  controlsHelp = ['Use Arrow Keys or Swipe on mobile', 'Press SPACE for primary action']
}) => {
  return (
    <div className="min-h-[500px] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-950/95 border border-yellow-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(255,229,0,0.2)] text-white text-center backdrop-blur-2xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 p-1 mx-auto mb-4 shadow-[0_0_30px_rgba(255,229,0,0.3)]">
          <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-4xl">
            {icon}
          </div>
        </div>

        <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white mb-1">{title}</h2>
        <p className="text-xs font-mono text-yellow-400 mb-5">{subtitle}</p>

        {/* High Score Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 mb-6">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>BEST RECORD:</span>
          <span className="font-orbitron font-bold text-yellow-400 text-sm">{highScore.toLocaleString()}</span>
        </div>

        {/* Difficulty Selector */}
        {onDifficultyChange && (
          <div className="mb-6">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">SELECT DIFFICULTY</div>
            <div className="flex gap-2">
              {(['EASY', 'NORMAL', 'HARD'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onDifficultyChange(diff)}
                  className={`flex-1 py-2 rounded-xl font-orbitron font-bold text-xs transition-all ${
                    difficulty === diff
                      ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,229,0,0.4)]'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls Instructions */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left text-xs font-inter text-slate-300 mb-6 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-1">HOW TO PLAY:</div>
          {controlsHelp.map((help, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <span className="text-yellow-400">•</span>
              <span>{help}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onStart}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-orbitron font-black text-sm hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,229,0,0.5)] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>START GAME</span>
          </button>

          <button
            onClick={onBack}
            className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs hover:bg-slate-800"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};
