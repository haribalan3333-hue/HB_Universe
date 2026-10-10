import React, { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { audioManager } from '../../audio/audioManager';

const AI_TIPS = [
  "Welcome Pilot! You can simulate missions on your character panel to gain XP and Coins.",
  "Six infinite worlds await! Check the Arcade for retro 3D games or Cinema for trailers.",
  "Tip: Turn on Ambient Sound in the top navbar for a complete cosmic audio immersion.",
  "Phase 1 foundation is fully connected. More dimensions will unlock as you level up!",
];

export const AICompanionOrb: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const toggleOrb = () => {
    audioManager.playClick();
    if (!isOpen) {
      setTipIndex((prev) => (prev + 1) % AI_TIPS.length);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 p-4 rounded-2xl bg-[#121220]/95 border border-yellow-400/40 backdrop-blur-xl shadow-glass-panel text-xs text-gray-200 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between font-orbitron font-bold text-yellow-400 text-[11px] mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HB AI COMPANION</span>
            </div>
            <button onClick={toggleOrb} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-inter leading-relaxed text-gray-300">
            {AI_TIPS[tipIndex]}
          </p>
        </div>
      )}

      <button
        onClick={toggleOrb}
        onMouseEnter={() => audioManager.playHover()}
        className="relative group w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 text-black flex items-center justify-center shadow-neon-yellow hover:scale-110 transition-transform duration-300"
        title="HB AI Companion"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black animate-ping" />
      </button>
    </div>
  );
};
