import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Gamepad2,
  Film,
  Headphones,
  Bot,
  Trophy,
  Sparkles,
  Lock,
  Compass,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { WorldData } from '../../types';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface WorldPortalProps {
  world: WorldData;
  onEnter?: (world: WorldData) => void;
}

export const WorldPortal: React.FC<WorldPortalProps> = ({ world, onEnter }) => {
  const {
    hoveredWorld,
    setHoveredWorld,
    selectedWorld,
    setSelectedWorld,
    unlockedWorlds,
    openWorldModal,
    soundEnabled,
    effectsEnabled,
    reducedMotion,
  } = useUniverseStore();

  const isUnlocked = unlockedWorlds.includes(world.id);
  const isHovered = hoveredWorld?.id === world.id;
  const isSelected = selectedWorld?.id === world.id;

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    mouseX.set((clientX / width) - 0.5);
    mouseY.set((clientY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredWorld(null);
  };

  const handleMouseEnter = () => {
    setHoveredWorld(world);
    if (soundEnabled) audioManager.playHover();
  };

  const handleClick = () => {
    if (!isUnlocked) {
      if (soundEnabled) audioManager.playLockedWorld();
      setSelectedWorld(world);
      openWorldModal(world);
      return;
    }
    if (soundEnabled) audioManager.playPortalOpen();
    setSelectedWorld(world);
    if (onEnter) {
      onEnter(world);
    } else {
      openWorldModal(world);
    }
  };

  const renderIcon = () => {
    switch (world.iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-cyan-400" />;
      case 'Film':
        return <Film className="w-6 h-6 text-red-400" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-purple-400" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-yellow-400" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-emerald-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={reducedMotion ? {} : { scale: 1.04 }}
      whileTap={reducedMotion ? {} : { scale: 0.97 }}
      tabIndex={0}
      role="button"
      aria-label={`Portal to ${world.name}, ${isUnlocked ? 'Unlocked' : 'Locked'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`relative cursor-pointer select-none rounded-2xl p-4 md:p-5 transition-all duration-300 backdrop-blur-xl border ${
        isUnlocked
          ? 'bg-slate-900/80 border-slate-700/60 hover:border-yellow-400/80 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
          : 'bg-slate-950/80 border-slate-800/80 opacity-75 grayscale hover:grayscale-0'
      } ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
    >
      {/* Background World Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${world.themeColor}20 0%, transparent 70%)`,
          opacity: isHovered && effectsEnabled ? 0.9 : 0,
        }}
      />

      {/* Header & Status Indicator */}
      <div className="flex items-center justify-between mb-3">
        {world.image && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-lg">
            <img src={world.image} alt={world.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300"
          style={{
            backgroundColor: `${world.themeColor}15`,
            borderColor: `${world.themeColor}40`,
            boxShadow: isHovered ? `0 0 20px ${world.themeColor}60` : 'none',
          }}
        >
          {renderIcon()}
        </div>

        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Lock className="w-3 h-3" />
              LV {world.requiredLevel}
            </span>
          )}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">
        {world.category}
      </div>
      <h3
        className="text-base md:text-lg font-black tracking-wide text-white transition-colors duration-200"
        style={{ color: isHovered ? world.themeColor : '#ffffff' }}
      >
        {world.name}
      </h3>
      <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
        {world.subtitle}
      </p>

      {/* Stats bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>{world.features.length} MODULES</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Shield className="w-3 h-3" />
          <span>+{world.stats.rewardXp} XP</span>
        </div>
      </div>

      {/* Enter prompt */}
      <div className="mt-2.5 flex items-center justify-between text-xs font-bold">
        <span
          className="text-[10px] uppercase tracking-wider flex items-center gap-1"
          style={{ color: world.themeColor }}
        >
          {isUnlocked ? 'Inspect Dimension' : 'Restricted Sector'}
          <ChevronRight className="w-3 h-3" />
        </span>
        <span className="text-[10px] font-mono text-slate-400">{world.badge}</span>
      </div>
    </motion.div>
  );
};
