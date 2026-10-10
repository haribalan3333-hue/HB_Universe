import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { getWatchHistory } from '../../data/cinemaStore';
import { getMediaById, MediaItem } from '../../data/media';
import { audioManager } from '../../audio/audioManager';
import { useUniverseStore } from '../../store/universeStore';

interface ContinueWatchingSectionProps {
  onSelect: (item: MediaItem) => void;
}

export const ContinueWatchingSection: React.FC<ContinueWatchingSectionProps> = ({ onSelect }) => {
  const { soundEnabled } = useUniverseStore();
  const history = getWatchHistory();

  const items = Object.values(history)
    .filter((h) => h.percent > 0 && h.percent < 95)
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((h) => ({
      media: getMediaById(h.mediaId),
      progress: h,
    }))
    .filter((entry): entry is { media: MediaItem; progress: typeof entry.progress } => !!entry.media);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-red-400" />
        <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-white">
          CONTINUE WATCHING
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.slice(0, 3).map(({ media, progress }) => (
          <motion.div
            key={media.id}
            whileHover={{ y: -3 }}
            onClick={() => {
              if (soundEnabled) audioManager.playClick();
              onSelect(media);
            }}
            className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 flex items-center gap-3 cursor-pointer group backdrop-blur-xl"
          >
            <div className="relative w-16 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0">
              <img
                src={media.poster || media.thumbnail}
                alt={media.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hb_logo.png';
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-white text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-orbitron font-bold text-xs text-white group-hover:text-red-400 truncate">
                {media.title}
              </h4>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${progress.percent}%` }} />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                {progress.percent}% Completed
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
