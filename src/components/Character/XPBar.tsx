import React from 'react';

interface XPBarProps {
  current: number;
  max: number;
}

export const XPBar: React.FC<XPBarProps> = ({ current, max }) => {
  const percentage = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-mono mb-1.5">
        <span className="text-gray-400 font-semibold tracking-wider">XP PROGRESS</span>
        <span className="text-yellow-400 font-bold">{current} / {max} XP ({percentage}%)</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/10 overflow-hidden p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 shadow-neon-yellow-sm transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
