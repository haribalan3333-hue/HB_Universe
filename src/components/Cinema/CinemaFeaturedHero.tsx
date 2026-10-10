import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Sparkles, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../../data/media';
import { isCinemaFavorite, toggleCinemaFavorite } from '../../data/cinemaStore';
import { audioManager } from '../../audio/audioManager';
import { useUniverseStore } from '../../store/universeStore';

interface CinemaFeaturedHeroProps {
  featuredList: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onDetails: (item: MediaItem) => void;
}

export const CinemaFeaturedHero: React.FC<CinemaFeaturedHeroProps> = ({
  featuredList,
  onPlay,
  onDetails,
}) => {
  const { soundEnabled } = useUniverseStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentItem = featuredList[currentIndex] || featuredList[0];
  const [favorite, setFavorite] = React.useState(() => (currentItem ? isCinemaFavorite(currentItem.id) : false));

  React.useEffect(() => {
    if (currentItem) {
      setFavorite(isCinemaFavorite(currentItem.id));
    }
  }, [currentIndex, currentItem]);

  // Auto rotation
  React.useEffect(() => {
    if (featuredList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [featuredList.length]);

  if (!currentItem) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) audioManager.playClick();
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) audioManager.playClick();
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  };

  const handleFavoriteToggle = () => {
    if (soundEnabled) audioManager.playClick();
    const next = toggleCinemaFavorite(currentItem.id);
    setFavorite(next);
  };

  return (
    <div className="relative rounded-3xl bg-slate-950 border border-red-500/40 overflow-hidden shadow-[0_0_80px_rgba(255,42,85,0.2)] backdrop-blur-2xl">
      {/* Background Poster / Visual Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 pointer-events-none"
        >
          <img
            src={currentItem.poster || currentItem.thumbnail}
            alt={currentItem.title}
            className="w-full h-full object-cover opacity-25 filter blur-[2px]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hb_pilot.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
          {/* Ambient Red Glow */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-500/20 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layout */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 font-orbitron text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              SPOTLIGHT PREMIERE
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
              {currentItem.category} • {currentItem.year}
            </span>
          </div>

          {/* Carousel Selector Controls */}
          {featuredList.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-500/20 border border-slate-800 hover:border-red-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400">
                {currentIndex + 1} / {featuredList.length}
              </span>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-500/20 border border-slate-800 hover:border-red-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Hero Body Content */}
        <div className="my-6 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-orbitron tracking-tight leading-none drop-shadow-[0_0_30px_rgba(255,42,85,0.4)]">
                {currentItem.title}
              </h1>

              {currentItem.subtitle && (
                <h2 className="text-base sm:text-xl font-bold font-inter text-red-400 tracking-wide">
                  {currentItem.subtitle}
                </h2>
              )}

              <p className="text-xs sm:text-sm text-slate-300 font-inter line-clamp-3 leading-relaxed max-w-xl">
                {currentItem.synopsis || currentItem.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {currentItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                  +{currentItem.xpReward} XP REWARD
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPlay(currentItem)}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-orbitron text-sm font-black uppercase tracking-wider shadow-[0_0_30px_rgba(255,42,85,0.6)] flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>WATCH NOW</span>
          </motion.button>

          <button
            onClick={() => onDetails(currentItem)}
            className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-orbitron text-sm font-bold tracking-wider border border-slate-800 hover:border-red-500/40 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>DETAILS & SPECS</span>
          </button>

          <button
            onClick={handleFavoriteToggle}
            className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-500/40 transition-all cursor-pointer backdrop-blur-md"
            title={favorite ? 'Remove Favorite' : 'Save to Favorites'}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
