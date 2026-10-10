import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Sparkles, Tv } from 'lucide-react';
import { MediaItem } from '../../data/media';
import { useUniverseStore } from '../../store/universeStore';

interface VirtualTheaterModeProps {
  item: MediaItem;
  onExit: () => void;
}

export const VirtualTheaterMode: React.FC<VirtualTheaterModeProps> = ({ item, onExit }) => {
  const { addXp } = useUniverseStore();
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-[#030308] flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Top Header */}
      <div className="w-full z-20 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
              3D VIRTUAL THEATER ARENA
            </span>
            <h3 className="text-sm sm:text-base font-orbitron font-bold text-white">
              {item.title}
            </h3>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white font-orbitron text-xs font-bold tracking-wider flex items-center gap-2 cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
          <span>EXIT THEATER</span>
        </button>
      </div>

      {/* Virtual Cinema Screen Area */}
      <div className="relative w-full max-w-5xl px-4 flex flex-col items-center justify-center flex-1 my-4">
        {/* Projector Light Cone Effect */}
        <div className="absolute -top-12 w-3/4 h-72 bg-gradient-to-b from-cyan-500/10 via-red-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Curved Theater Screen */}
        <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full aspect-[16/9] rounded-2xl bg-black border-4 border-slate-800 shadow-[0_0_120px_rgba(255,42,85,0.35)] overflow-hidden flex items-center justify-center"
        >
          <img
            src={item.poster || item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hb_logo.png';
            }}
          />

          {/* Screen Light Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/15 via-transparent to-cyan-500/15 pointer-events-none" />

          {/* Center Play Indicator */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute w-16 h-16 rounded-full bg-red-500/80 text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,42,85,0.7)] hover:scale-110 transition-transform cursor-pointer"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </button>
        </motion.div>

        {/* Theater Seating Rows Silhouette */}
        <div className="w-full max-w-4xl mt-6 flex justify-around opacity-30 pointer-events-none">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="w-10 sm:w-16 h-8 sm:h-12 rounded-t-2xl bg-gradient-to-t from-black to-slate-900 border-t border-slate-700 shadow-md"
            />
          ))}
        </div>
      </div>

      {/* Bottom Theater Footer */}
      <div className="w-full p-4 bg-slate-950/80 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>IMAX 4K MULTI-DIMENSIONAL PROJECTION ACTIVE</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> +{item.xpReward} XP
          </span>
          <button
            onClick={() => {
              addXp(item.xpReward);
              onExit();
            }}
            className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer font-bold"
          >
            COMPLETE & CLAIM XP
          </button>
        </div>
      </div>
    </div>
  );
};
