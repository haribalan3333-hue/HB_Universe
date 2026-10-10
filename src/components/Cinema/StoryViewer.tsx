import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import { MediaItem } from '../../data/media';
import { useUniverseStore } from '../../store/universeStore';
import { canClaimCinemaReward, markCinemaRewarded } from '../../data/cinemaStore';
import { audioManager } from '../../audio/audioManager';

interface StoryViewerProps {
  item: MediaItem;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ item, onClose }) => {
  const { addXp, addCoins, showSpeech, soundEnabled } = useUniverseStore();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const chapters = item.chapters || [];
  const currentChapter = chapters[currentChapterIndex] || {
    chapterNumber: 1,
    title: 'Prologue',
    content: ['No chapter text found.'],
  };

  const handleNext = () => {
    if (soundEnabled) audioManager.playClick();
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    } else if (!completed) {
      setCompleted(true);
      if (canClaimCinemaReward(item.id)) {
        markCinemaRewarded(item.id);
        addXp(item.xpReward);
        addCoins(Math.floor(item.xpReward * 0.75));
        showSpeech(`📖 STORY COMPLETED: +${item.xpReward} XP!`, 3500);
      }
    }
  };

  const handlePrev = () => {
    if (soundEnabled) audioManager.playClick();
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  const progressPercent = Math.round(((currentChapterIndex + 1) / (chapters.length || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto select-none">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest">
              LORE STORY ARCHIVE
            </span>
            <h2 className="text-base sm:text-xl font-orbitron font-bold text-white">
              {item.title}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Story Chapter Container */}
      <div className="w-full max-w-3xl my-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapterIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6"
          >
            {/* Chapter Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                CHAPTER {currentChapter.chapterNumber} OF {chapters.length}
              </span>
              <span className="text-xs font-mono text-slate-400">{progressPercent}% READ</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-orbitron font-black text-white">
              {currentChapter.title}
            </h3>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-slate-300 font-inter text-base sm:text-lg leading-relaxed">
              {currentChapter.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-emerald-400">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Illustration Icon if present */}
            {currentChapter.illustration && (
              <div className="text-center text-4xl pt-4 opacity-75">
                {currentChapter.illustration}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="w-full max-w-3xl flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={handlePrev}
          disabled={currentChapterIndex === 0}
          className="px-4 py-2.5 rounded-xl bg-slate-900 disabled:opacity-30 border border-slate-800 text-slate-300 hover:text-white font-orbitron text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        <div className="flex items-center gap-2">
          {completed && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> COMPLETE (+{item.xpReward} XP)
            </span>
          )}
        </div>

        <button
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer"
        >
          <span>{currentChapterIndex === chapters.length - 1 ? (completed ? 'CLOSE' : 'FINISH STORY') : 'NEXT CHAPTER'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
