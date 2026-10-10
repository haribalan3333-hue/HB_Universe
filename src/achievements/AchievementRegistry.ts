export type AchievementRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'ARCADE' | 'CINEMA' | 'MUSIC' | 'AI' | 'CHALLENGE' | 'PROGRESSION';
  rarity: AchievementRarity;
  icon: string;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export const ACHIEVEMENTS_REGISTRY: AchievementItem[] = [
  {
    id: 'first_game',
    title: 'Arcade Initiate',
    description: 'Play your first mini-game in Arcade World.',
    category: 'ARCADE',
    rarity: 'COMMON',
    icon: 'Gamepad2',
    xpReward: 50,
    coinReward: 25,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'snake_king',
    title: 'Neon Snake Sovereign',
    description: 'Score over 500 points in Neon Snake 2099.',
    category: 'ARCADE',
    rarity: 'RARE',
    icon: 'Zap',
    xpReward: 100,
    coinReward: 60,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'speed_demon',
    title: 'Void Velocity Master',
    description: 'Reach 200+ KM/H in Void Racer without collision.',
    category: 'ARCADE',
    rarity: 'RARE',
    icon: 'Flame',
    xpReward: 100,
    coinReward: 60,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'first_movie',
    title: 'Premiere Spectator',
    description: 'Stream a 4K film or trailer in Cinema World.',
    category: 'CINEMA',
    rarity: 'COMMON',
    icon: 'Film',
    xpReward: 50,
    coinReward: 25,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'pushpawathi_complete',
    title: 'Heritage Chronicler',
    description: 'Complete the full AI Historical Film Pushpawathi.',
    category: 'CINEMA',
    rarity: 'EPIC',
    icon: 'Sparkles',
    xpReward: 150,
    coinReward: 100,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'ai_explorer',
    title: 'Neural Synthesizer',
    description: 'Interact with all 5 neural AI companion personas.',
    category: 'AI',
    rarity: 'RARE',
    icon: 'Bot',
    xpReward: 100,
    coinReward: 50,
    unlocked: true,
    progress: 5,
    maxProgress: 5,
  },
  {
    id: 'quiz_champion',
    title: 'Master of Knowledge',
    description: 'Achieve 100% accuracy on an AI or Challenge Arena quiz.',
    category: 'CHALLENGE',
    rarity: 'EPIC',
    icon: 'Brain',
    xpReward: 150,
    coinReward: 100,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'streak_7',
    title: 'Cosmic Discipline',
    description: 'Maintain a continuous 7-day multiverse activity streak.',
    category: 'PROGRESSION',
    rarity: 'EPIC',
    icon: 'Flame',
    xpReward: 200,
    coinReward: 150,
    unlocked: true,
    progress: 7,
    maxProgress: 7,
  },
  {
    id: 'level_20_mystery',
    title: 'Dimension Breaker',
    description: 'Reach Level 20 and unlock the Mystery World Void.',
    category: 'PROGRESSION',
    rarity: 'LEGENDARY',
    icon: 'Key',
    xpReward: 500,
    coinReward: 300,
    unlocked: false,
    progress: 12,
    maxProgress: 20,
  },
  {
    id: 'hb_legend',
    title: 'Multiverse Architect',
    description: 'Attain the supreme rank of HB Legend.',
    category: 'PROGRESSION',
    rarity: 'LEGENDARY',
    icon: 'Crown',
    xpReward: 1000,
    coinReward: 500,
    unlocked: false,
    progress: 12,
    maxProgress: 75,
  },
];
