import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Tv,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { MediaItem } from '../../data/media';
import { saveWatchProgress, getWatchProgress, canClaimCinemaReward, markCinemaRewarded } from '../../data/cinemaStore';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface CinematicVideoPlayerProps {
  item: MediaItem;
  onClose: () => void;
  onOpenTheater?: (item: MediaItem) => void;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  item,
  onClose,
  onOpenTheater,
}) => {
  const { addXp, addCoins, showSpeech, soundEnabled } = useUniverseStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Skip Intro
  const handleSkipIntro = () => {
    setShowIntro(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Resume Progress
  useEffect(() => {
    const saved = getWatchProgress(item.id);
    if (saved && saved.progressSeconds > 0 && saved.percent < 95) {
      if (videoRef.current) {
        videoRef.current.currentTime = saved.progressSeconds;
        setCurrentTime(saved.progressSeconds);
      }
    }
  }, [item.id]);

  // Intro Auto Dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  // Controls Visibility on Mouse Move
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (soundEnabled) audioManager.playClick();
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [soundEnabled]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      } else if (e.key === 'ArrowRight') {
        if (videoRef.current) videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement && containerRef.current) {
          containerRef.current.requestFullscreen().catch(() => {});
          setIsFullscreen(true);
        } else if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, duration, onClose]);

  // Progress Update & XP Completion
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 100;
    setCurrentTime(cur);
    saveWatchProgress(item.id, cur, dur);

    // If watched > 80% and can claim
    if (cur / dur > 0.8 && !rewardClaimed && canClaimCinemaReward(item.id)) {
      setRewardClaimed(true);
      markCinemaRewarded(item.id);
      addXp(item.xpReward);
      addCoins(Math.floor(item.xpReward * 0.75));
      showSpeech(`🎬 CINEMA REWARD: +${item.xpReward} XP EARNED!`, 3500);
    }
  };

  // Speed Toggle
  const handleSpeedToggle = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Cinematic Intro Bumper */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-mono font-bold tracking-[0.3em] text-red-500 uppercase"
            >
              HB UNIVERSE PRESENTS
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-3xl sm:text-6xl font-black font-orbitron text-white mt-3 tracking-wider drop-shadow-[0_0_35px_rgba(255,42,85,0.7)]"
            >
              {item.title}
            </motion.h1>

            {item.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-sm sm:text-lg font-inter text-slate-300 mt-2 max-w-xl"
              >
                {item.subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-6 flex items-center gap-2 text-xs font-mono text-slate-400"
            >
              <span>{item.creator}</span>
              <span>•</span>
              <span className="text-red-400">{item.category}</span>
            </motion.div>

            <button
              onClick={handleSkipIntro}
              className="absolute bottom-8 right-8 px-4 py-2 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-red-500 text-xs font-mono text-slate-300 hover:text-white cursor-pointer transition-all"
            >
              SKIP INTRO ➔
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTML5 Video Element / Simulated Cinematic Reel Canvas */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.poster || item.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onError={() => {
            setVideoError(true);
          }}
          onClick={togglePlay}
          muted={isMuted}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
        />
      ) : (
        /* Graceful Media Reel Visualizer when video source file is pending */
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black p-6 text-center">
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_50px_rgba(255,42,85,0.4)] mb-4 animate-pulse">
            <Tv className="w-12 h-12" />
          </div>

          <span className="text-xs font-mono font-bold text-red-400 tracking-widest uppercase">
            CINEMATIC STREAM EMULATOR
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-orbitron text-white mt-1">
            {item.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-inter mt-2 max-w-md">
            {item.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => {
                addXp(item.xpReward);
                addCoins(Math.floor(item.xpReward * 0.75));
                showSpeech(`🎬 DEMO REEL COMPLETED: +${item.xpReward} XP!`, 3000);
              }}
              className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-orbitron text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,85,0.6)] cursor-pointer"
            >
              CLAIM EXPERIENCE REWARD (+{item.xpReward} XP)
            </button>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-mono">
            <AlertCircle className="w-4 h-4" />
            <span>Ready for external video upload ({item.videoUrl || 'video.mp4'})</span>
          </div>
        </div>
      )}

      {/* Top Header Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between z-30"
          >
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-orbitron text-[10px] font-bold uppercase">
                {item.category}
              </span>
              <div>
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-white">
                  {item.title}
                </h3>
                <p className="text-[11px] font-mono text-slate-400">{item.creator}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenTheater && (
                <button
                  onClick={() => onOpenTheater(item)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-orbitron font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Enter Virtual 3D Theater"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">THEATER</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-red-500 border border-slate-700 hover:border-red-500 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close Player (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Control Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-3 z-30"
          >
            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 w-12 text-right">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 group/bar py-2 cursor-pointer">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value);
                    setCurrentTime(next);
                    if (videoRef.current) videoRef.current.currentTime = next;
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none"
                />
              </div>

              <span className="text-xs font-mono text-slate-400 w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Bottom Button Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,42,85,0.6)] cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                {/* Rewind 10s */}
                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 10);
                  }}
                  className="p-2 text-slate-300 hover:text-white cursor-pointer"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Forward 10s */}
                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                  }}
                  className="p-2 text-slate-300 hover:text-white cursor-pointer"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="p-2 text-slate-300 hover:text-white cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      setIsMuted(false);
                      if (videoRef.current) videoRef.current.volume = v;
                    }}
                    className="w-16 sm:w-24 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-red-500 hidden sm:inline-block"
                  />
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                {/* Reward Badge */}
                <span className="text-xs font-mono text-amber-400 hidden md:flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> +{item.xpReward} XP
                </span>

                {/* Playback Speed */}
                <button
                  onClick={handleSpeedToggle}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
                >
                  {playbackSpeed}x
                </button>

                {/* Fullscreen */}
                <button
                  onClick={() => {
                    if (!document.fullscreenElement && containerRef.current) {
                      containerRef.current.requestFullscreen().catch(() => {});
                      setIsFullscreen(true);
                    } else if (document.fullscreenElement) {
                      document.exitFullscreen().catch(() => {});
                      setIsFullscreen(false);
                    }
                  }}
                  className="p-2 text-slate-300 hover:text-white cursor-pointer"
                  title="Fullscreen (F)"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
