import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Compass, Radio } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

export const EntryScreen: React.FC = () => {
  const { enterUniverse, soundEnabled } = useUniverseStore();

  const handleEnter = () => {
    if (soundEnabled) audioManager.playPortalOpen();
    enterUniverse();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 select-none overflow-hidden">
      {/* Ambient Pulsing Glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/15 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* HB Pilot Avatar Hero Frame */}
        <motion.div
          className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-cyan-400 shadow-[0_0_60px_rgba(255,229,0,0.4)]"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 border-2 border-yellow-400/80">
            <img
              src="/images/hb_pilot.png"
              alt="HB Pilot Commander"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900 border border-yellow-400 text-yellow-400 text-xs font-mono font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            <span>PILOT COMMANDER</span>
          </div>
        </motion.div>

        {/* Title & Slogan */}
        <div className="space-y-2 mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-xs tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>TRANSMISSION ACTIVE • PHASE 3</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-wider text-white font-orbitron">
            HB <span className="text-yellow-400 neon-text-yellow">UNIVERSE</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-inter max-w-md mx-auto">
            One Website. Infinite Worlds. Step into a 3D futuristic entertainment galaxy floating in deep space.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center gap-1">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold">6 WORLDS</span>
            <span className="text-[10px] text-gray-400">Dimensions</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold">3D CITY</span>
            <span className="text-[10px] text-gray-400">Three.js Hub</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center gap-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold">LV 12 PILOT</span>
            <span className="text-[10px] text-gray-400">2,450 Coins</span>
          </div>
        </div>

        {/* Enter Button */}
        <motion.button
          onClick={handleEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-orbitron font-black text-sm uppercase tracking-widest shadow-neon-yellow flex items-center gap-3 cursor-pointer"
        >
          <span>ENTER HB UNIVERSE</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};
