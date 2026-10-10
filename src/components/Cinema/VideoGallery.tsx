import React from 'react';
import { motion } from 'framer-motion';
import { Video, Play } from 'lucide-react';
import { MediaItem } from '../../data/media';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface VideoGalleryProps {
  onPlayClip: (item: MediaItem) => void;
  onBack: () => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ onPlayClip, onBack }) => {
  const { soundEnabled } = useUniverseStore();

  const clips: MediaItem[] = [
    {
      id: 'clip-1',
      title: 'Multiverse Quantum Engine Launch',
      category: 'VFX Motion Reel',
      description: 'High-speed particle simulation of the central portal activation sequence.',
      thumbnail: '/images/hb_pilot.png',
      videoUrl: '/videos/clip-01.mp4',
      duration: '01:15',
      year: 2026,
      creator: 'VFX Lab',
      type: 'video',
      tags: ['VFX', 'Simulation', 'Portal'],
      xpReward: 10,
      available: true,
    },
    {
      id: 'clip-2',
      title: 'HB Pilot Suit Mechanics Breakdown',
      category: '3D Breakdown',
      description: 'Wireframe and lighting inspection of the pilot quantum armor.',
      thumbnail: '/images/hb_logo.png',
      videoUrl: '/videos/clip-02.mp4',
      duration: '01:45',
      year: 2026,
      creator: 'Avatar Studio',
      type: 'video',
      tags: ['Armor', '3D', 'Pilot'],
      xpReward: 10,
      available: true,
    },
    {
      id: 'clip-3',
      title: 'Arcade World Neon Shader Timelapse',
      category: 'Production Reel',
      description: 'Behind the scenes creation of glowing floor reflections and arcade machine holograms.',
      thumbnail: '/images/hb_pilot.png',
      videoUrl: '/videos/clip-03.mp4',
      duration: '02:10',
      year: 2026,
      creator: 'Environment Team',
      type: 'video',
      tags: ['Behind The Scenes', 'Arcade', 'Neon'],
      xpReward: 10,
      available: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-widest">
              MOTION VAULT
            </span>
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              Universe Video Album
            </h2>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-300 hover:text-white font-orbitron text-xs font-bold cursor-pointer"
        >
          ← BACK TO CINEMA
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <motion.div
            key={clip.id}
            whileHover={{ y: -4 }}
            onClick={() => {
              if (soundEnabled) audioManager.playClick();
              onPlayClip(clip);
            }}
            className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={clip.thumbnail}
                alt={clip.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hb_logo.png';
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.7)] group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300">
                {clip.duration}
              </div>
            </div>

            <div className="p-4">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                {clip.category}
              </span>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                {clip.title}
              </h4>
              <p className="text-xs text-slate-400 font-inter mt-1 line-clamp-2">
                {clip.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
