import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Image as ImageIcon, Heart, Sparkles, Clock, Eye } from 'lucide-react';
import { MediaItem } from '../../data/media';
import { isCinemaFavorite, toggleCinemaFavorite, getWatchProgress } from '../../data/cinemaStore';
import { audioManager } from '../../audio/audioManager';
import { useUniverseStore } from '../../store/universeStore';

interface MediaCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
  onQuickPlay: (item: MediaItem) => void;
  onFavoriteChanged?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onSelect, onQuickPlay, onFavoriteChanged }) => {
  const { soundEnabled } = useUniverseStore();
  const [favorite, setFavorite] = React.useState(() => isCinemaFavorite(item.id));
  const progress = getWatchProgress(item.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) audioManager.playClick();
    const nextFav = toggleCinemaFavorite(item.id);
    setFavorite(nextFav);
    if (onFavoriteChanged) onFavoriteChanged();
  };

  const getActionIcon = () => {
    if (item.type === 'story') return <BookOpen className="w-4 h-4" />;
    if (item.type === 'photo') return <ImageIcon className="w-4 h-4" />;
    return <Play className="w-4 h-4 fill-current" />;
  };

  const getActionLabel = () => {
    if (item.type === 'story') return 'READ STORY';
    if (item.type === 'photo') return 'VIEW GALLERY';
    if (item.type === 'video') return 'PLAY CLIP';
    return 'WATCH';
  };

  const getTypeBadgeColor = () => {
    switch (item.type) {
      case 'ai-film':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'movie':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'short-film':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'trailer':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'story':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'photo':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'video':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(item)}
      className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(255,42,85,0.25)] flex flex-col justify-between cursor-pointer backdrop-blur-xl transition-all"
    >
      {/* Thumbnail / Poster Image Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        <img
          src={item.poster || item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            // graceful fallback
            (e.target as HTMLImageElement).src = '/images/hb_logo.png';
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className={`text-[10px] font-orbitron font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-md ${getTypeBadgeColor()}`}>
            {item.category}
          </span>
          <button
            onClick={handleFavoriteClick}
            className="pointer-events-auto p-1.5 rounded-full bg-slate-950/70 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-colors backdrop-blur-md"
            title={favorite ? 'Remove Favorite' : 'Add to Favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Duration / Chapter Badge */}
        {item.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-400" />
            <span>{item.duration}</span>
          </div>
        )}

        {/* Views / Rating */}
        {item.views && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-md flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>{item.views}</span>
          </div>
        )}

        {/* Play Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickPlay(item);
            }}
            className="w-12 h-12 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,42,85,0.7)] border border-red-300/40"
          >
            {getActionIcon()}
          </motion.button>
        </div>

        {/* Watch Progress Bar */}
        {progress && progress.percent > 0 && progress.percent < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div className="h-full bg-red-500" style={{ width: `${progress.percent}%` }} />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-orbitron font-bold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
              {item.title}
            </h3>
            {item.rating && (
              <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                {item.rating}
              </span>
            )}
          </div>

          {item.subtitle && (
            <p className="text-xs font-mono text-red-400/90 mt-0.5 line-clamp-1">
              {item.subtitle}
            </p>
          )}

          <p className="text-xs text-slate-400 font-inter mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Metadata & Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>+{item.xpReward} XP</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickPlay(item);
            }}
            className="px-3 py-1 rounded-lg bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border border-red-500/30 hover:border-red-500"
          >
            {getActionIcon()}
            <span>{getActionLabel()}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
