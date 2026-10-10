import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';

interface ReturnToUniverseProps {
  worldName?: string;
  themeColor?: string;
}

export const ReturnToUniverse: React.FC<ReturnToUniverseProps> = ({
  worldName,
  themeColor = '#FFE500',
}) => {
  const { returnToUniverseHub, character } = useUniverseStore();

  return (
    <div className="w-full flex items-center justify-between py-4 border-b border-white/[0.08] mb-6 select-none">
      {/* Return Button */}
      <button
        onClick={returnToUniverseHub}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border text-slate-200 hover:text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-105"
        style={{ borderColor: `${themeColor}60` }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO UNIVERSE</span>
      </button>

      {/* World Identity Pill */}
      {worldName && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
          <span className="text-white font-bold">{worldName}</span>
        </div>
      )}

      {/* Vitals Pill */}
      <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
        <span className="hidden md:inline">PILOT LV {character.level}</span>
        <span className="text-yellow-400 font-bold">XP {character.xp}</span>
        <span className="flex items-center gap-1 text-cyan-300">
          <Home className="w-3.5 h-3.5 text-yellow-400" />
          <span>ORIGIN GATE READY</span>
        </span>
      </div>
    </div>
  );
};
