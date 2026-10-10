import React from 'react';
import { motion } from 'framer-motion';
import { AICoreState } from '../../ai/aiTypes';

interface AICoreVisualizerProps {
  state: AICoreState;
  characterColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AICoreVisualizer: React.FC<AICoreVisualizerProps> = ({
  state,
  characterColor = '#FFE500',
  size = 'md',
}) => {
  const getCoreColor = () => {
    switch (state) {
      case 'THINKING':
        return '#00F0FF';
      case 'RESPONDING':
        return '#10B981';
      case 'LISTENING':
        return '#FF2A55';
      case 'ERROR':
        return '#EF4444';
      case 'OFFLINE':
        return '#64748B';
      case 'IDLE':
      default:
        return characterColor;
    }
  };

  const color = getCoreColor();
  const dimensionClass =
    size === 'sm'
      ? 'w-16 h-16'
      : size === 'lg'
      ? 'w-40 h-40 sm:w-56 sm:h-56'
      : 'w-28 h-28 sm:w-36 sm:h-36';

  return (
    <div className={`relative ${dimensionClass} flex items-center justify-center select-none`}>
      {/* Outer Rotating Energy Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: state === 'THINKING' ? 3 : 14,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ borderColor: `${color}40`, borderTopColor: color }}
        className="absolute inset-0 rounded-full border-2 border-dashed shadow-[0_0_30px_rgba(255,229,0,0.2)]"
      />

      {/* Middle Counter-Rotating Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: state === 'THINKING' ? 4 : 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ borderColor: `${color}30`, borderBottomColor: color }}
        className="absolute inset-2 rounded-full border border-dotted"
      />

      {/* Pulsing Neural Ambient Glow */}
      <motion.div
        animate={{
          scale: state === 'LISTENING' ? [1, 1.35, 1] : state === 'THINKING' ? [0.95, 1.15, 0.95] : [1, 1.1, 1],
          opacity: state === 'LISTENING' ? [0.6, 0.9, 0.6] : [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: state === 'LISTENING' ? 1.2 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ backgroundColor: `${color}25` }}
        className="absolute inset-4 rounded-full blur-xl"
      />

      {/* Inner Glowing AI Core Nucleus */}
      <motion.div
        animate={{
          scale: state === 'RESPONDING' ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 0.6, repeat: state === 'RESPONDING' ? Infinity : 0 }}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 40px ${color}80, inset 0 0 15px rgba(255,255,255,0.8)`,
        }}
        className="relative w-1/3 h-1/3 rounded-full flex items-center justify-center text-black font-black text-xs font-orbitron"
      >
        <span className="animate-pulse">AI</span>
      </motion.div>

      {/* Orbiting Quantum Nodes */}
      {state !== 'OFFLINE' && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
              className="w-2.5 h-2.5 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"
            />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
              className="w-2 h-2 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2"
            />
          </motion.div>
        </>
      )}
    </div>
  );
};
