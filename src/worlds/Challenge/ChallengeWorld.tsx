import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Sparkles, Brain, Code2, Wrench, Zap, Key } from 'lucide-react';
import { ReturnToUniverse } from '../../navigation/ReturnToUniverse';
import { WorldBreadcrumb } from '../../navigation/WorldBreadcrumb';
import { useUniverseStore } from '../../store/universeStore';
import { pageVariants } from '../../animations/transitions';
import {
  CHALLENGE_REGISTRY,
  ChallengeCategory,
  ChallengeItem,
  getChallengesByCategory,
  getDailyChallengeForDate,
} from '../../data/challenges';
import { ChallengeCoreVisualizer } from '../../components/Challenge/ChallengeCoreVisualizer';
import { ChallengeCard } from '../../components/Challenge/ChallengeCard';
import { ChallengeSessionModal } from '../../components/Challenge/ChallengeSessionModal';
import { ChallengeResultModal } from '../../components/Challenge/ChallengeResultModal';
import { DailyRewardModal } from '../../components/Challenge/DailyRewardModal';
import { WeeklyMissionsModal } from '../../components/Challenge/WeeklyMissionsModal';
import { getLocalDateString, loadStreakState } from '../../progression/StreakManager';
import { getRankForLevel } from '../../progression/RankManager';

export const ChallengeWorld: React.FC = () => {
  const { character } = useUniverseStore();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'ALL'>('ALL');
  const [activeChallenge, setActiveChallenge] = useState<ChallengeItem | null>(null);
  const [challengeResults, setChallengeResults] = useState<any | null>(null);

  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showWeeklyMissions, setShowWeeklyMissions] = useState(false);

  const todayStr = getLocalDateString();
  const dailyChallenge = getDailyChallengeForDate(todayStr);
  const streakState = loadStreakState();
  const rankInfo = getRankForLevel(character.level);

  const challengesList = getChallengesByCategory(selectedCategory);

  const categories = [
    { id: 'ALL', label: 'ALL TRIALS', icon: <Trophy className="w-4 h-4" /> },
    { id: 'QUIZ', label: 'QUIZ ARENA', icon: <Brain className="w-4 h-4" /> },
    { id: 'CODING', label: 'CODING LAB', icon: <Code2 className="w-4 h-4" /> },
    { id: 'ENGINEERING', label: 'ENGINEERING', icon: <Wrench className="w-4 h-4" /> },
    { id: 'PUZZLE', label: 'PUZZLES', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'REACTION', label: 'REACTION', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 max-w-7xl mx-auto select-none pb-12"
    >
      {/* Navigation Headers */}
      <ReturnToUniverse worldName="CHALLENGE WORLD" themeColor="#00F0FF" />
      <WorldBreadcrumb worldName="CHALLENGE WORLD" themeColor="#00F0FF" />

      {/* Hero Marquee with Challenge Core Visualizer */}
      <div className="relative rounded-3xl bg-slate-950 border border-cyan-400/40 p-6 sm:p-10 overflow-hidden shadow-[0_0_80px_rgba(0,240,255,0.2)] backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              DIMENSION SECTOR 06 • COMPETITION ARENA
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-orbitron tracking-wider">
              CHALLENGE WORLD
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-inter max-w-xl leading-relaxed">
              Test your engineering prowess, algorithm debugging, and reflex speed. Earn massive XP, climb ranks from Rookie to HB Legend, and unlock the Mystery World!
            </p>

            {/* Quick Player Stat Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
                RANK: {rankInfo.tier}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {streakState.currentStreak} DAY STREAK
              </span>
              {character.level >= 20 ? (
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-mono font-bold flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> MYSTERY WORLD UNLOCKED
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
                  🔒 MYSTERY UNLOCKS AT LV 20 ({character.level}/20)
                </span>
              )}
            </div>
          </div>

          {/* Central Challenge Core */}
          <div className="shrink-0">
            <ChallengeCoreVisualizer />
          </div>
        </div>
      </div>

      {/* Daily Challenge & Quick Modules Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Challenge Spotlight */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900/80 border border-cyan-400/40 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> TODAY&apos;S DAILY CHALLENGE
            </span>
            <h3 className="font-orbitron font-bold text-base text-white mt-1">
              {dailyChallenge.title}
            </h3>
            <p className="text-xs text-slate-300 font-inter mt-1 line-clamp-2">
              {dailyChallenge.description}
            </p>
          </div>
          <button
            onClick={() => setActiveChallenge(dailyChallenge)}
            className="mt-4 py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
          >
            PLAY DAILY TRIAL (+{dailyChallenge.xpReward} XP)
          </button>
        </div>

        {/* Daily Streak Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-950/60 to-slate-900/80 border border-orange-500/40 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> 7-DAY STREAK CALENDAR
            </span>
            <h3 className="font-orbitron font-bold text-base text-white mt-1">
              {streakState.currentStreak} Days Active
            </h3>
            <p className="text-xs text-slate-300 font-inter mt-1">
              Log in daily to claim bonus coins and XP multipliers.
            </p>
          </div>
          <button
            onClick={() => setShowDailyReward(true)}
            className="mt-4 py-2 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-orbitron text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
          >
            VIEW DAILY STREAK LADDER
          </button>
        </div>

        {/* Weekly Operations */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900/80 border border-purple-500/40 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> WEEKLY OPERATIONS
            </span>
            <h3 className="font-orbitron font-bold text-base text-white mt-1">
              Multiverse Missions
            </h3>
            <p className="text-xs text-slate-300 font-inter mt-1">
              Complete universe objectives to unlock grand XP rewards.
            </p>
          </div>
          <button
            onClick={() => setShowWeeklyMissions(true)}
            className="mt-4 py-2 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-orbitron text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
          >
            OPEN MISSIONS (5 ACTIVE)
          </button>
        </div>
      </div>

      {/* Arena Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.5)] border border-cyan-400'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {challengesList.map((item) => (
          <ChallengeCard
            key={item.id}
            item={item}
            onSelect={(chal) => setActiveChallenge(chal)}
          />
        ))}
      </div>

      {/* Active Challenge Session Modal */}
      {activeChallenge && (
        <ChallengeSessionModal
          challenge={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onComplete={(results) => {
            setActiveChallenge(null);
            setChallengeResults(results);
          }}
        />
      )}

      {/* Challenge Results Modal */}
      {challengeResults && (
        <ChallengeResultModal
          results={challengeResults}
          onPlayAgain={() => {
            setChallengeResults(null);
            setActiveChallenge(CHALLENGE_REGISTRY[0]);
          }}
          onBackToArena={() => setChallengeResults(null)}
        />
      )}

      {/* Daily Reward Modal */}
      {showDailyReward && (
        <DailyRewardModal onClose={() => setShowDailyReward(false)} />
      )}

      {/* Weekly Missions Modal */}
      {showWeeklyMissions && (
        <WeeklyMissionsModal onClose={() => setShowWeeklyMissions(false)} />
      )}
    </motion.div>
  );
};
