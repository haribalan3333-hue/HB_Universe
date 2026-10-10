import React from 'react';
import { Play, RotateCcw, } from 'lucide-react';

interface GamePauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export const GamePauseMenu: React.FC<GamePauseMenuProps> = ({ onResume, onRestart, onBack }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="w-full max-w-sm bg-slate-950 border border-yellow-400/40 rounded-3xl p-6 text-center text-white shadow-[0_0_60px_rgba(255,229,0,0.2)]">
        <h3 className="font-orbitron font-black text-2xl text-yellow-400 mb-2">GAME PAUSED</h3>
        <p className="text-xs font-mono text-slate-400 mb-6">Quantum state preserved</p>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-orbitron font-black text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" /> RESUME
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-xs hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> RESTART
          </button>

          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl bg-transparent border border-slate-800 text-slate-400 hover:text-white font-mono text-xs"
          >
            EXIT TO ARCADE
          </button>
        </div>
      </div>
    </div>
  );
};
