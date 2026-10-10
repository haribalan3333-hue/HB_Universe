import React from 'react';
import { Html } from '@react-three/drei';
import { Sparkles } from 'lucide-react';

interface CharacterSpeechBubbleProps {
  text: string;
}

export const CharacterSpeechBubble: React.FC<CharacterSpeechBubbleProps> = ({ text }) => {
  return (
    <Html position={[0, 3.4, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
      <div className="flex flex-col items-center select-none animate-bounce-short whitespace-nowrap">
        <div className="relative px-3.5 py-1.5 rounded-2xl bg-slate-900/95 border-2 border-yellow-400 text-yellow-300 font-black text-xs tracking-wide shadow-[0_0_20px_rgba(255,229,0,0.6)] flex items-center gap-1.5 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
          <span>{text}</span>
          {/* Downward Speech Pointer Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-8 border-t-yellow-400" />
        </div>
      </div>
    </Html>
  );
};
