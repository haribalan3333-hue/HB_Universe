import { GameData } from '../types';

export const GAMES_DATA: GameData[] = [
  {
    id: 'xo',
    title: 'XO Cyber Arena',
    category: 'STRATEGY',
    thumbnail: '❌⭕',
    badge: 'MINIMAX AI',
    rating: 4.9,
    xpReward: 50,
    coinReward: 30,
    difficulty: 'EASY',
    status: 'ONLINE',
  },
  {
    id: 'snake',
    title: 'Neon Snake 2099',
    category: 'ARCADE',
    thumbnail: '🐍',
    badge: 'POPULAR',
    rating: 4.9,
    xpReward: 80,
    coinReward: 50,
    difficulty: 'MEDIUM',
    status: 'ONLINE',
  },
  {
    id: 'racing',
    title: 'Void Racer 3D',
    category: '3D RACING',
    thumbnail: '🏎️',
    badge: 'HIGH SPEED',
    rating: 5.0,
    xpReward: 120,
    coinReward: 75,
    difficulty: 'HARD',
    status: 'ONLINE',
  },
  {
    id: 'runner',
    title: 'Cyber Grid Runner',
    category: 'ACTION',
    thumbnail: '🏃',
    badge: 'HB JUMPER',
    rating: 4.8,
    xpReward: 100,
    coinReward: 60,
    difficulty: 'MEDIUM',
    status: 'ONLINE',
  },
  {
    id: 'memory',
    title: 'Cosmic Memory Matrix',
    category: 'PUZZLE',
    thumbnail: '🧠',
    badge: 'MIND MATRIX',
    rating: 4.7,
    xpReward: 70,
    coinReward: 45,
    difficulty: 'MEDIUM',
    status: 'ONLINE',
  },
  {
    id: 'reaction',
    title: 'Photon Tap Trials',
    category: 'REFLEX',
    thumbnail: '⚡',
    badge: 'SPEED TEST',
    rating: 4.9,
    xpReward: 90,
    coinReward: 55,
    difficulty: 'HARD',
    status: 'ONLINE',
  },
];

export function calculateGameReward(_gameId: string, score: number, difficulty: string = 'NORMAL') {
  let xp = 15;
  let coins = 10;

  if (score > 1000) {
    xp = 60;
    coins = 45;
  } else if (score > 500) {
    xp = 40;
    coins = 30;
  } else if (score > 200) {
    xp = 25;
    coins = 20;
  }

  if (difficulty === 'HARD') {
    xp = Math.floor(xp * 1.3);
    coins = Math.floor(coins * 1.3);
  }

  return { xp, coins };
}
