import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Clock, Sparkles, Play } from 'lucide-react';
import { ChallengeItem } from '../../data/challenges';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface ChallengeCardProps {
  item: ChallengeItem;
  onSelect: (item: ChallengeItem) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ item, onSelect }) => {
  const { character, soundEnabled } = useUniverseStore();
  const isLocked = character.level < item.unlockedAtLevel;

  const handleClick = () => {
    if (isLocked) {
      if (soundEnabled) audioManager.playLockedWorld();
      return;
    }
    if (soundEnabled) audioManager.playClick();
    onSelect(item);
  };

  return (
    <motion.div
      whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
      onClick={handleClick}
      className={`group relative p-5 rounded-2xl bg-slate-900/80 border transition-all flex flex-col justify-between backdrop-blur-xl ${
        isLocked
          ? 'border-slate-800 opacity-60 cursor-not-allowed'
          : 'border-slate-800 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] cursor-pointer'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <span
            style={{ backgroundColor: `${item.color}20`, color: item.color, borderColor: `${item.color}40` }}
            className="text-[10px] font-orbitron font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
          >
            {item.category} • {item.difficulty}
          </span>

          {isLocked ? (
            <span className="text-[10px] font-mono text-red-400 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              <Lock className="w-3 h-3" /> REQ LV {item.unlockedAtLevel}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> {item.timeLimitSeconds}s
            </span>
          )}
        </div>

        <h4 className="font-orbitron font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-slate-400 font-inter mt-1.5 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Footer Rewards & Action */}
      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> +{item.xpReward} XP
          </span>
          <span className="text-yellow-400">🪙 +{item.coinReward}</span>
        </div>

        <button
          disabled={isLocked}
          className={`px-3 py-1.5 rounded-lg font-orbitron text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-cyan-500/20 hover:bg-cyan-400 text-cyan-300 hover:text-black shadow-md cursor-pointer'
          }`}
        >
          {isLocked ? <Lock className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          <span>{isLocked ? 'LOCKED' : 'ENTER'}</span>
        </button>
      </div>
    </motion.div>
  );
};
