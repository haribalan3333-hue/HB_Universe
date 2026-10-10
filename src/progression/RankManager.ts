import { RankInfo } from './progressionTypes';

export const RANKS_CONFIG: RankInfo[] = [
  {
    tier: 'ROOKIE',
    title: 'Cosmic Cadet',
    minLevel: 1,
    maxLevel: 4,
    color: '#94A3B8',
    badge: '🚀 ROOKIE',
    description: 'Initial pilot tier exploring basic multiverse portals and controls.',
  },
  {
    tier: 'EXPLORER',
    title: 'Dimensional Scout',
    minLevel: 5,
    maxLevel: 9,
    color: '#00F0FF',
    badge: '🌌 EXPLORER',
    description: 'Proficient navigator active across Arcade and Cinema sectors.',
  },
  {
    tier: 'CHALLENGER',
    title: 'Sector Challenger',
    minLevel: 10,
    maxLevel: 19,
    color: '#FFE500',
    badge: '⚡ CHALLENGER',
    description: 'High-tier competitor mastering quizzes, games, and neural AI labs.',
  },
  {
    tier: 'PRO',
    title: 'Quantum Vanguard',
    minLevel: 20,
    maxLevel: 29,
    color: '#A855F7',
    badge: '🔮 PRO VANGUARD',
    description: 'Elite pilot with full access to Mystery Dimension Void.',
  },
  {
    tier: 'MASTER',
    title: 'Multiverse Master',
    minLevel: 30,
    maxLevel: 49,
    color: '#FF2A55',
    badge: '👑 MASTER',
    description: 'Master tactician holding top arcade high scores and challenge honors.',
  },
  {
    tier: 'LEGEND',
    title: 'Galactic Legend',
    minLevel: 50,
    maxLevel: 74,
    color: '#F59E0B',
    badge: '🏆 LEGEND',
    description: 'Hall of Fame navigator who has completed all planetary trials.',
  },
  {
    tier: 'HB LEGEND',
    title: 'Supreme Architect',
    minLevel: 75,
    maxLevel: 999,
    color: '#EC4899',
    badge: '✨ HB LEGEND',
    description: 'Transcendent creator tier of the unified HB Multiverse.',
  },
];

export function getRankForLevel(level: number): RankInfo {
  for (let i = RANKS_CONFIG.length - 1; i >= 0; i--) {
    if (level >= RANKS_CONFIG[i].minLevel) {
      return RANKS_CONFIG[i];
    }
  }
  return RANKS_CONFIG[0];
}

export function getNextRank(level: number): RankInfo | null {
  const current = getRankForLevel(level);
  const currentIdx = RANKS_CONFIG.findIndex((r) => r.tier === current.tier);
  if (currentIdx < RANKS_CONFIG.length - 1) {
    return RANKS_CONFIG[currentIdx + 1];
  }
  return null;
}
