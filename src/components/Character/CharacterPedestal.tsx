import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

export const CharacterPedestal: React.FC = () => {
  const { character, addXp, soundEnabled } = useUniverseStore();

  const handleBoost = () => {
    if (soundEnabled) audioManager.playClick();
    addXp(50);
  };

  const xpPercent = Math.min(100, Math.round((character.xp / character.maxXp) * 100));

  return (
    <div className="relative flex flex-col items-center justify-center p-6 select-none">
      {/* Background Rotating Cyber Rings */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-yellow-400/40 border-dashed"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner Counter-Rotating Ring */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-cyan-400/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />

        {/* Avatar Image Frame with Uploaded Photo */}
        <div className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-cyan-400 shadow-[0_0_40px_rgba(255,229,0,0.5)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border-2 border-yellow-400/80">
            <img
              src="/images/hb_pilot.png"
              alt="HB Pilot Commander"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Level Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-900 border border-yellow-400 text-yellow-400 text-xs font-black tracking-wider font-mono shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3 fill-yellow-400" />
            <span>LV {character.level}</span>
          </div>
        </div>
      </div>

      {/* Pilot Name & Lore */}
      <div className="text-center mt-4">
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>{character.rank}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
          {character.name}
        </h2>
        <p className="text-xs text-slate-400">{character.title}</p>
      </div>

      {/* XP Gauge Bar */}
      <div className="w-64 max-w-full mt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span>XP PROGRESS</span>
          <span className="text-yellow-400 font-bold">
            {character.xp} / {character.maxXp} ({xpPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-700 p-0.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-cyan-400 rounded-full shadow-[0_0_10px_#FFE500]"
            style={{ width: `${xpPercent}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Boost Mission Action Button */}
      <button
        onClick={handleBoost}
        className="mt-4 px-4 py-1.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400 border border-yellow-400 text-yellow-400 hover:text-black text-xs font-bold font-mono tracking-wider transition-all transform hover:scale-105 cursor-pointer shadow-lg flex items-center gap-1.5"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>BOOST MISSION XP (+50)</span>
      </button>
    </div>
  );
};
