import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Tv, Heart, Clock, Calendar, Sparkles, BookOpen, User, Tag } from 'lucide-react';
import { MediaItem } from '../../data/media';
import { isCinemaFavorite, toggleCinemaFavorite, getWatchProgress } from '../../data/cinemaStore';
import { audioManager } from '../../audio/audioManager';
import { useUniverseStore } from '../../store/universeStore';

interface CinemaDetailsModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
  onTheaterMode: (item: MediaItem) => void;
}

export const CinemaDetailsModal: React.FC<CinemaDetailsModalProps> = ({
  item,
  onClose,
  onPlay,
  onTheaterMode,
}) => {
  const { soundEnabled } = useUniverseStore();
  const [favorite, setFavorite] = React.useState(false);

  React.useEffect(() => {
    if (item) setFavorite(isCinemaFavorite(item.id));
  }, [item]);

  if (!item) return null;

  const progress = getWatchProgress(item.id);

  const handleFavoriteToggle = () => {
    if (soundEnabled) audioManager.playClick();
    const next = toggleCinemaFavorite(item.id);
    setFavorite(next);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-red-500/40 overflow-hidden shadow-[0_0_80px_rgba(255,42,85,0.3)] max-h-[90vh] flex flex-col"
        >
          {/* Backdrop Header */}
          <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900 shrink-0">
            <img
              src={item.poster || item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover opacity-40"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hb_pilot.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Close Button */}
            <button
              onClick={() => {
                if (soundEnabled) audioManager.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 font-orbitron text-xs font-bold uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            {/* Bottom Title inside Backdrop */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-orbitron">
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="text-sm font-inter text-red-400 font-medium">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 font-inter text-sm">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onPlay(item);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-orbitron text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,85,0.5)] flex items-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{progress && progress.percent > 0 ? `RESUME (${progress.percent}%)` : 'START WATCHING'}</span>
              </button>

              {item.type !== 'story' && item.type !== 'photo' && (
                <button
                  onClick={() => {
                    onClose();
                    onTheaterMode(item);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 font-orbitron text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Tv className="w-4 h-4" />
                  <span>3D VIRTUAL THEATER</span>
                </button>
              )}

              <button
                onClick={handleFavoriteToggle}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-red-400 font-orbitron text-xs font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{favorite ? 'FAVORITED' : 'ADD TO FAVORITES'}</span>
              </button>
            </div>

            {/* Synopsis */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider mb-1.5">
                SYNOPSIS & LORE
              </h4>
              <p className="text-slate-300 leading-relaxed font-inter text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                {item.synopsis || item.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-400" /> DURATION
                </span>
                <p className="font-orbitron font-bold text-xs text-white mt-1">{item.duration || 'N/A'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" /> RELEASE YEAR
                </span>
                <p className="font-orbitron font-bold text-xs text-white mt-1">{item.year}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <User className="w-3 h-3 text-purple-400" /> CREATOR / STUDIO
                </span>
                <p className="font-orbitron font-bold text-xs text-white mt-1 line-clamp-1">{item.creator}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> REWARD
                </span>
                <p className="font-orbitron font-bold text-xs text-amber-400 mt-1">+{item.xpReward} XP</p>
              </div>
            </div>

            {/* Chapters (for Stories) */}
            {item.chapters && item.chapters.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  CHAPTER INDEX ({item.chapters.length} CHAPTERS)
                </h4>
                <div className="space-y-2">
                  {item.chapters.map((ch) => (
                    <div
                      key={ch.chapterNumber}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-slate-400">Chapter {ch.chapterNumber}</span>
                      <span className="font-orbitron font-bold text-white">{ch.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" /> CATEGORY TAGS
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
