import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Radio } from 'lucide-react';
import { ReturnToUniverse } from '../../navigation/ReturnToUniverse';
import { WorldBreadcrumb } from '../../navigation/WorldBreadcrumb';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';
import { pageVariants } from '../../animations/transitions';

export const MusicWorld: React.FC = () => {
  const { addXp, soundEnabled } = useUniverseStore();

  const tracks = [
    { title: 'Cosmic Drift Synth', bpm: '128 BPM', genre: 'Synthwave / Cyber', streams: '32.1K' },
    { title: 'Neon Highway Horizon', bpm: '135 BPM', genre: 'Retrowave Drive', streams: '21.5K' },
    { title: 'Quantum Void Resonance', bpm: '110 BPM', genre: 'Ambient Drone', streams: '18.9K' },
    { title: 'Galactic Arena Anthem', bpm: '140 BPM', genre: 'Electro Cyber', streams: '44.2K' },
  ];

  const handlePlayTrack = () => {
    if (soundEnabled) audioManager.playClick();
    addXp(20);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 max-w-6xl mx-auto select-none"
    >
      <ReturnToUniverse worldName="MUSIC WORLD" themeColor="#A855F7" />
      <WorldBreadcrumb worldName="MUSIC WORLD" themeColor="#A855F7" />

      {/* Hero */}
      <div className="relative rounded-3xl bg-slate-950/80 border border-purple-500/40 p-6 sm:p-10 overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.15)] backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/15 border-2 border-purple-500 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <Headphones className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                DIMENSION SECTOR 03 • SYNTH & AUDIO
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-orbitron tracking-wider">
                MUSIC WORLD
              </h1>
              <p className="text-sm text-slate-300 font-inter mt-1 max-w-xl">
                Dynamic cosmic soundscapes and Web Audio procedural frequency synthesizers.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Equalizer Bars */}
        <div className="flex items-end gap-1.5 h-16 pt-6">
          {[40, 75, 30, 90, 60, 100, 45, 80, 65, 95, 50, 85, 35, 70, 90, 60].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t-sm animate-pulse"
              style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>

      {/* Track List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((t, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 transition-all flex items-center justify-between backdrop-blur-xl"
          >
            <div>
              <h4 className="font-orbitron font-bold text-base text-white">{t.title}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{t.genre} • {t.bpm}</p>
            </div>

            <button
              onClick={handlePlayTrack}
              className="px-3.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>PLAY (+20 XP)</span>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
