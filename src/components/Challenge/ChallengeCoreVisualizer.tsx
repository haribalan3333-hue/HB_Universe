import React from 'react';
import { motion } from 'framer-motion';

export const ChallengeCoreVisualizer: React.FC = () => {
  return (
    <div className="relative w-44 h-44 sm:w-60 sm:h-60 flex items-center justify-center select-none">
      {/* Outer Hexagonal Energy Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 shadow-[0_0_40px_rgba(0,240,255,0.3)]"
      />

      {/* Middle Counter-Rotating Flame Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-3 rounded-full border border-dotted border-amber-400/50"
      />

      {/* Pulsing Energy Glow */}
      <motion.div
        animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-6 rounded-full bg-gradient-to-r from-cyan-500/30 to-amber-500/30 blur-xl"
      />

      {/* Inner Central Nucleus */}
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-slate-950 border-2 border-yellow-400 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(255,229,0,0.6)]">
        <span className="text-xl sm:text-2xl animate-pulse">⚡</span>
        <span className="text-[10px] font-orbitron font-black text-yellow-400 tracking-wider">
          ARENA CORE
        </span>
      </div>

      {/* Floating Arena Nodes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00F0FF] absolute -top-1.5 left-1/2 -translate-x-1/2" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#F59E0B] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
      </motion.div>
    </div>
  );
};
