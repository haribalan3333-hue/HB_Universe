import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Radio } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';
import { WORLD_REGISTRY } from './WorldRegistry';

export const TravelLoading: React.FC = () => {
  const {
    worldTransitionState,
    destinationWorldId,
    travelProgress,
    travelMessage,
  } = useUniverseStore();

  const isTransitioning =
    worldTransitionState === 'PORTAL_ACTIVATING' ||
    worldTransitionState === 'CAMERA_TRAVEL' ||
    worldTransitionState === 'LOADING_WORLD' ||
    worldTransitionState === 'RETURNING_TO_UNIVERSE';

  const destination = destinationWorldId ? WORLD_REGISTRY[destinationWorldId] : null;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 select-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hyperspace Warp Core Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[140vw] h-[140vw] rounded-full animate-ping opacity-30"
              style={{
                background: `radial-gradient(circle, ${destination ? destination.themeColor : '#FFE500'} 0%, transparent 65%)`,
                animationDuration: '1.8s',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_90%)]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md w-full">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-yellow-400/40 text-yellow-400 text-xs font-mono mb-6">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>QUANTUM DIMENSIONAL GATEWAY</span>
            </div>

            {/* Destination Title */}
            <motion.h2
              className="text-3xl sm:text-5xl font-black tracking-wider text-white font-orbitron mb-2"
              animate={{ scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {worldTransitionState === 'RETURNING_TO_UNIVERSE'
                ? 'UNIVERSE HUB'
                : destination
                ? destination.name
                : 'DIMENSIONAL WARP'}
            </motion.h2>

            <p className="text-xs sm:text-sm text-cyan-300 font-mono mb-8 min-h-[20px]">
              {travelMessage}
            </p>

            {/* Tech Loading Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-700 p-0.5 mb-3 overflow-hidden shadow-inner">
              <motion.div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${travelProgress}%`,
                  backgroundColor: destination ? destination.themeColor : '#FFE500',
                  boxShadow: `0 0 15px ${destination ? destination.themeColor : '#FFE500'}`,
                }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
                <span>WARP MATRIX SYNC</span>
              </span>
              <span className="text-white font-bold">{travelProgress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
