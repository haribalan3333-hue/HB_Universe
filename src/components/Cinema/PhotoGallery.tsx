import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { MediaItem } from '../../data/media';
import { PhotoLightbox } from './PhotoLightbox';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface PhotoGalleryProps {
  item: MediaItem;
  onBack: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ item, onBack }) => {
  const { addXp, soundEnabled } = useUniverseStore();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = item.photos || [];

  const handleOpenPhoto = (idx: number) => {
    if (soundEnabled) audioManager.playClick();
    setLightboxIndex(idx);
    addXp(5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-widest">
              DIGITAL EXHIBITION
            </span>
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              {item.title}
            </h2>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white font-orbitron text-xs font-bold cursor-pointer"
        >
          ← BACK TO CINEMA
        </button>
      </div>

      {/* Masonry / Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            whileHover={{ y: -4 }}
            onClick={() => handleOpenPhoto(idx)}
            className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hb_logo.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-black/70 text-white">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">
                {photo.category}
              </span>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                {photo.title}
              </h4>
              <p className="text-xs text-slate-400 font-inter mt-1 line-clamp-2">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev! - 1 + photos.length) % photos.length)}
          onNext={() => setLightboxIndex((prev) => (prev! + 1) % photos.length)}
        />
      )}
    </div>
  );
};
