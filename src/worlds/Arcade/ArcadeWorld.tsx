import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Play, Sparkles } from 'lucide-react';
// import { ReturnToUniverse } from '../../navigation/ReturnToUniverse';
// import { WorldBreadcrumb } from '../../navigation/WorldBreadcrumb';
import { XOGame } from '../../games/XO/XOGame';
import { SnakeGame } from '../../games/Snake/SnakeGame';
import { RacingGame } from '../../games/Racing/RacingGame';
import { RunnerGame } from '../../games/Runner/RunnerGame';
import { MemoryGame } from '../../games/Memory/MemoryGame';
import { ReactionGame } from '../../games/Reaction/ReactionGame';
import { getHighScores } from '../../data/highScores';
import { pageVariants } from '../../animations/transitions';

export const ArcadeWorld: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const highScores = getHighScores();

  const games = [
    {
      id: 'xo',
      title: 'XO Cyber Arena',
      genre: 'Logic Strategy Matrix',
      icon: '❌⭕',
      highScore: highScores.xo || 0,
      badge: 'MINIMAX AI',
      color: '#00F0FF',
      description: 'Battle quantum AI or local players in an intense cyberpunk 3x3 tactical grid.'
    },
    {
      id: 'snake',
      title: 'Neon Snake 2099',
      genre: 'Quantum Grid Reflex',
      icon: '🐍',
      highScore: highScores.snake || 0,
      badge: 'POPULAR',
      color: '#10B981',
      description: 'Navigate the high-voltage neon grid, collect quantum orbs, and test your reflexes.'
    },
    {
      id: 'racing',
      title: 'HB Future Race',
      genre: 'Hyper-Speed Arcade Highway',
      icon: '🏎️',
      highScore: highScores.racing || 0,
      badge: 'HIGH SPEED',
      color: '#F59E0B',
      description: 'Dodge autonomous cyber-cruisers across multi-lane highways and collect gold energy cores.'
    },
    {
      id: 'runner',
      title: 'HB Quantum Runner',
      genre: 'Cyber-Platform Endless Sprint',
      icon: '🏃‍♂️',
      highScore: highScores.runner || 0,
      badge: 'ACTION',
      color: '#EC4899',
      description: 'Leap over plasma barriers and slide under laser beams in this high-tempo endless sprint.'
    },
    {
      id: 'memory',
      title: 'Holo Memory Matrix',
      genre: 'Pattern Recognition Matrix',
      icon: '🧠',
      highScore: highScores.memory || 0,
      badge: 'TACTICAL',
      color: '#8B5CF6',
      description: 'Uncover pairs of holographic universe glyphs with speed and precision.'
    },
    {
      id: 'reaction',
      title: 'Neural Reflex Test',
      genre: 'Precision Latency Matrix',
      icon: '⚡',
      highScore: highScores.reaction || 0,
      badge: 'PRECISION',
      color: '#EAB308',
      description: 'Measure your millisecond neural reaction speed across 5 competitive rounds.'
    },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 select-none pb-12"
    >
      {/* If a game is actively playing, render it */}
      <AnimatePresence mode="wait">
        {activeGame ? (
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex justify-center"
          >
            {activeGame === 'xo' && <XOGame onBack={() => setActiveGame(null)} />}
            {activeGame === 'snake' && <SnakeGame onBack={() => setActiveGame(null)} />}
            {activeGame === 'racing' && <RacingGame onBack={() => setActiveGame(null)} />}
            {activeGame === 'runner' && <RunnerGame onBack={() => setActiveGame(null)} />}
            {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame(null)} />}
            {activeGame === 'reaction' && <ReactionGame onBack={() => setActiveGame(null)} />}
          </motion.div>
        ) : (
          <motion.div
            key="arcade-hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header / Intro Banner */}
            <div className="rounded-3xl bg-slate-950 border border-yellow-400/40 p-6 sm:p-8 relative overflow-hidden shadow-[0_0_80px_rgba(255,229,0,0.15)] backdrop-blur-xl">
              <div className="relative z-10 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 text-xs font-mono font-bold tracking-wider inline-flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> 6 PLAYABLE ARCADE STATIONS
                </span>
                <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-2 tracking-tight">
                  ARCADE <span className="text-yellow-400">WORLD</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-inter leading-relaxed">
                  Engage in real-time interactive challenges. Every victory grants authoritative XP, Coins, Leaderboard Rank boosts, and unlocks Multiverse Achievements.
                </p>
              </div>
            </div>

            {/* 6 Game Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((g) => (
                <div
                  key={g.id}
                  className="rounded-3xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between hover:border-yellow-400/60 transition-all hover:shadow-[0_0_40px_rgba(255,229,0,0.15)] group relative overflow-hidden backdrop-blur-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl p-2 rounded-2xl bg-slate-900 border border-slate-800">
                        {g.icon}
                      </span>
                      <span
                        style={{ color: g.color, borderColor: `${g.color}50`, backgroundColor: `${g.color}15` }}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                      >
                        {g.badge}
                      </span>
                    </div>

                    <h3 className="font-orbitron font-black text-xl text-white group-hover:text-yellow-400 transition-colors mb-1">
                      {g.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mb-3">{g.genre}</p>
                    <p className="text-xs text-slate-300 font-inter line-clamp-2 mb-4 leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-900">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" /> BEST SCORE
                      </span>
                      <span className="font-orbitron font-bold text-white text-sm">
                        {g.highScore.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveGame(g.id)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-orbitron font-black text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,229,0,0.3)]"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>PLAY MATCH</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
