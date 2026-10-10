import React from 'react';
import { CircularWorldHub } from '../Hub/CircularWorldHub';

export const WebGLFallback: React.FC = () => {
  return (
    <div className="w-full">
      <div className="text-center py-2 text-xs font-mono text-yellow-400/80">
        ✦ 2D UNIVERSE HUB FALLBACK ACTIVE ✦
      </div>
      <CircularWorldHub />
    </div>
  );
};
