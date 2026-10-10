import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Film,
  Headphones,
  Bot,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';

export const WorldTransition: React.FC = () => {
  const {
    transitionActive,
    transitioningWorld,
    completeWorldTransition,
    effectsEnabled,
  } = useUniverseStore();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!transitionActive) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            completeWorldTransition();
          }, 200);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [transitionActive, completeWorldTransition]);

  if (!transitionActive || !transitioningWorld) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-12 h-12 text-cyan-400" />;
      case 'Film':
        return <Film className="w-12 h-12 text-red-400" />;
      case 'Headphones':
        return <Headphones className="w-12 h-12 text-purple-400" />;
      case 'Bot':
        return <Bot className="w-12 h-12 text-yellow-400" />;
      case 'Trophy':
        return <Trophy className="w-12 h-12 text-emerald-400" />;
      default:
        return <Sparkles className="w-12 h-12 text-indigo-400" />;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hyper-tunnel background effect */}
      {effectsEnabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[160vw] h-[160vw] rounded-full animate-ping opacity-25"
            style={{
              background: `radial-gradient(circle, ${transitioningWorld.themeColor} 0%, transparent 70%)`,
              animationDuration: '2s',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_90%)]" />
        </div>
      )}

      {/* Centered Hologram Transition Info */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md">
        <motion.div
          className="w-24 h-24 rounded-3xl flex items-center justify-center border-2 shadow-[0_0_50px_var(--glow)] bg-slate-900/90 mb-6"
          style={
            {
              borderColor: transitioningWorld.themeColor,
              '--glow': transitioningWorld.themeColor,
            } as React.CSSProperties
          }
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {renderIcon(transitioningWorld.iconName)}
        </motion.div>

        <span className="text-xs uppercase font-mono tracking-widest text-yellow-400 mb-2">
          Quantum Dimensional Warp
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-wider text-white mb-2">
          ENTERING {transitioningWorld.name}
        </h2>
        <p className="text-sm text-slate-400 mb-8 font-mono">
          INITIALIZING WORLD SUBSYSTEMS...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-700 p-0.5 mb-3 overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${progress}%`,
              backgroundColor: transitioningWorld.themeColor,
              boxShadow: `0 0 15px ${transitioningWorld.themeColor}`,
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
          <span>PORTAL MATRIX SYNCHRONIZED</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};
