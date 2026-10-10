import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { PhotoItem } from '../../data/media';

interface PhotoLightboxProps {
  photos: PhotoItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const photo = photos[currentIndex];
  const [zoom, setZoom] = React.useState(1);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 select-none">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between z-20">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            {photo.category} • PHOTO {currentIndex + 1} / {photos.length}
          </span>
          <h3 className="text-sm sm:text-base font-orbitron font-bold text-white">
            {photo.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-4">
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/60 border border-slate-800 hover:border-cyan-400 text-white flex items-center justify-center cursor-pointer transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <motion.img
          key={photo.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: zoom }}
          transition={{ duration: 0.3 }}
          src={photo.url}
          alt={photo.title}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/hb_logo.png';
          }}
        />

        <button
          onClick={onNext}
          className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/60 border border-slate-800 hover:border-cyan-400 text-white flex items-center justify-center cursor-pointer transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption & Metadata */}
      <div className="w-full max-w-2xl text-center bg-slate-950/80 p-3 rounded-xl border border-slate-900 text-xs font-inter text-slate-300">
        <p>{photo.caption}</p>
        {photo.dimensions && (
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">
            Resolution: {photo.dimensions}
          </span>
        )}
      </div>
    </div>
  );
};
