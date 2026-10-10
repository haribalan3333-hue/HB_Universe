import React from 'react';
import { Html } from '@react-three/drei';
import { Lock, Unlock } from 'lucide-react';
import { WorldData } from '../../types';

interface WorldPortalLabelProps {
  world: WorldData;
  isUnlocked: boolean;
  isHovered: boolean;
  isSelected: boolean;
}

export const WorldPortalLabel: React.FC<WorldPortalLabelProps> = ({
  world,
  isUnlocked,
  isHovered,
  isSelected,
}) => {
  return (
    <Html position={[0, 3.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
      <div
        className={`flex flex-col items-center select-none transition-all duration-300 ${
          isHovered || isSelected ? 'scale-110' : 'scale-95 opacity-90'
        }`}
      >
        <div
          className={`px-3.5 py-1.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-2 whitespace-nowrap ${
            isUnlocked
              ? 'bg-slate-900/90 text-white border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              : 'bg-slate-950/95 text-slate-400 border-slate-700'
          }`}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: isUnlocked ? world.themeColor : '#64748b' }}
          />
          <span className="font-bold text-xs tracking-wider uppercase font-orbitron">
            {world.name}
          </span>

          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]"
            style={{
              backgroundColor: isUnlocked ? `${world.themeColor}25` : '#334155',
              color: isUnlocked ? world.themeColor : '#94a3b8',
            }}
          >
            {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          </div>
        </div>

        {isUnlocked ? (
          <span
            className="text-[9px] font-mono font-bold tracking-widest mt-1 uppercase drop-shadow"
            style={{ color: world.themeColor }}
          >
            {world.badge}
          </span>
        ) : (
          <span className="text-[9px] font-mono text-amber-400 tracking-widest mt-1 uppercase drop-shadow">
            REQ LV {world.requiredLevel}
          </span>
        )}
      </div>
    </Html>
  );
};
