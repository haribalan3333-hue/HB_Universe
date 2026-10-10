import React from 'react';
import { Pause, Play, RotateCcw, ArrowLeft,  } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';

interface GameHUDProps {
  gameTitle: string;
  score: number;
  highScore: number;
  timer?: number;
  lives?: number;
  speed?: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameTitle,
  score,
  highScore,
  timer,
  lives,
  speed,
  isPaused,
  onPauseToggle,
  onRestart,
  onBack
}) => {
  const { character } = useUniverseStore();

  return (
    <div className="w-full bg-slate-950/90 border-b border-yellow-400/30 backdrop-blur-xl px-4 py-3 select-none flex items-center justify-between gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Return to Arcade"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-orbitron font-black text-sm sm:text-base text-white truncate">{gameTitle}</h2>
          <div className="text-[10px] font-mono text-yellow-400">
            BEST: <span className="font-bold">{highScore.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Center: Live Gauges */}
      <div className="flex items-center gap-4">
        {/* Score */}
        <div className="text-center px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[9px] font-mono text-slate-400 uppercase">SCORE</div>
          <div className="font-orbitron font-black text-base sm:text-lg text-yellow-400">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Timer if applicable */}
        {timer !== undefined && (
          <div className="hidden xs:block text-center px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">TIME</div>
            <div className="font-mono font-bold text-sm text-cyan-300">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </div>
          </div>
        )}

        {/* Lives / Speed / Streak */}
        {lives !== undefined && (
          <div className="hidden sm:flex items-center gap-1 text-rose-400 text-sm">
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>
        )}

        {speed !== undefined && (
          <div className="hidden sm:block text-center px-2 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-400">
            {speed} KM/H
          </div>
        )}
      </div>

      {/* Right: Controls & Pilot Level */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white">
          <span className="text-yellow-400 font-bold">LV</span>
          <span>{character.level}</span>
        </div>

        <button
          onClick={onPauseToggle}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title={isPaused ? 'Resume Game' : 'Pause Game'}
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-yellow-400" />}
        </button>

        <button
          onClick={onRestart}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Restart Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
