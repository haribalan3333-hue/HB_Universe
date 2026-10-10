import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';

interface WorldBreadcrumbProps {
  worldName: string;
  themeColor?: string;
}

export const WorldBreadcrumb: React.FC<WorldBreadcrumbProps> = ({
  worldName,
  themeColor = '#FFE500',
}) => {
  const { returnToUniverseHub } = useUniverseStore();

  return (
    <div className="flex items-center gap-2 text-xs font-mono select-none">
      <button
        onClick={returnToUniverseHub}
        className="flex items-center gap-1 text-slate-400 hover:text-yellow-400 transition-colors cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>HB UNIVERSE</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-600" />

      <span className="font-bold font-orbitron uppercase" style={{ color: themeColor }}>
        {worldName}
      </span>
    </div>
  );
};
