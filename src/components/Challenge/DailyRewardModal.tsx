import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Check } from 'lucide-react';
import { loadStreakState } from '../../progression/StreakManager';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface DailyRewardModalProps {
  onClose: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClose }) => {
  const { addCoins, addXp, showSpeech, soundEnabled } = useUniverseStore();
  const streak = loadStreakState();

  const daysConfig = [
    { day: 1, coins: 50, xp: 20 },
    { day: 2, coins: 75, xp: 30 },
    { day: 3, coins: 100, xp: 40 },
    { day: 4, coins: 125, xp: 50 },
    { day: 5, coins: 150, xp: 60 },
    { day: 6, coins: 200, xp: 80 },
    { day: 7, coins: 500, xp: 150, bonus: '🏆 MEGA REWARD' },
  ];

  const handleClaim = (dayNum: number, coins: number, xp: number) => {
    if (soundEnabled) audioManager.playClick();
    addCoins(coins);
    addXp(xp);
    showSpeech(`🔥 DAY ${dayNum} REWARD: +${coins} COINS & +${xp} XP!`, 3500);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl rounded-3xl bg-slate-950 border border-amber-500/40 p-6 sm:p-8 flex flex-col space-y-6 shadow-[0_0_80px_rgba(245,158,11,0.3)]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" /> DAILY ACTIVITY STREAK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-white mt-1">
              {streak.currentStreak} DAY STREAK
            </h2>
            <p className="text-xs text-slate-400 font-inter mt-1">
              Log in daily and complete any universe activity to claim progressive rewards!
            </p>
          </div>

          {/* 7 Days Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {daysConfig.map((d) => {
              const isClaimed = d.day <= streak.currentStreak;
              const isToday = d.day === streak.currentStreak;

              return (
                <div
                  key={d.day}
                  className={`p-3 rounded-2xl border text-center flex flex-col justify-between ${
                    isToday
                      ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : isClaimed
                      ? 'bg-slate-900/60 border-slate-800 opacity-75'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400">DAY {d.day}</span>
                  <div className="my-2">
                    <span className="font-orbitron font-bold text-sm text-yellow-400">🪙 {d.coins}</span>
                    <p className="text-[10px] font-mono text-amber-300">+{d.xp} XP</p>
                  </div>

                  {isClaimed ? (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> CLAIMED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">LOCKED</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleClaim(streak.currentStreak, 200, 80)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-orbitron text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
          >
            CLAIM TODAY&apos;S BONUS REWARD
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
