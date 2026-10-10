import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Film, Headphones, Bot, Trophy, Sparkles, ArrowUpRight, Users } from 'lucide-react';
import { WorldData } from '../../types';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface WorldCardProps {
  world: WorldData;
  index: number;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Gamepad2,
  Film,
  Headphones,
  Bot,
  Trophy,
  Sparkles,
};

export const WorldCard: React.FC<WorldCardProps> = ({ world, index }) => {
  const { openWorldModal } = useUniverseStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = ICON_MAP[world.iconName] || Sparkles;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -8;
    const tiltY = ((x - centerX) / centerX) * 8;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    audioManager.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = () => {
    audioManager.playPortalOpen();
    openWorldModal(world);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className={`relative cursor-pointer rounded-2xl bg-gradient-to-b from-[#10101c] to-[#08080f] border border-white/[0.08] p-5 sm:p-6 overflow-hidden transition-all duration-300 group ${world.borderGlow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${world.accentColor} opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`} />

      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />

      <div className="relative z-10 flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundColor: `${world.themeColor}15`,
            borderColor: `${world.themeColor}40`,
            color: world.themeColor,
            boxShadow: isHovered ? `0 0 20px ${world.themeColor}40` : 'none',
          }}
        >
          <IconComponent className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-gray-300 group-hover:border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{world.badge}</span>
        </div>
      </div>

      <div className="relative z-10 mb-4">
        <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-1">
          {world.category}
        </div>
        <h3 className="font-orbitron font-extrabold text-2xl text-white group-hover:text-yellow-400 transition-colors tracking-wide mb-1">
          {world.name}
        </h3>
        <p className="text-xs text-gray-300 font-inter line-clamp-2">
          {world.subtitle}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] font-mono text-gray-400">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-gray-500" />
          <span>{world.stats.playersCount}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>PORTAL</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};
