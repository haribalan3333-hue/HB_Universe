import { useUniverseStore } from '../../store/universeStore';
import { SyncQueue } from '../../sync/SyncQueue';
import { GameDifficulty } from './GameState';

export interface GameRewardResult {
  xp: number;
  coins: number;
  isHighScore: boolean;
}

export function calculateGameRewards(gameId: string, score: number, _duration: number, difficulty: GameDifficulty = 'NORMAL'): GameRewardResult {
  let multiplier = 1.0;
  if (difficulty === 'EASY') multiplier = 0.8;
  if (difficulty === 'HARD') multiplier = 1.5;

  let baseXP = Math.floor((score / 10) * multiplier);
  let baseCoins = Math.floor((score / 25) * multiplier);

  if (baseXP < 5 && score > 0) baseXP = 5;
  if (baseCoins < 2 && score > 0) baseCoins = 2;

  if (baseXP > 0) useUniverseStore.getState().addXp(baseXP);
  if (baseCoins > 0) useUniverseStore.getState().addCoins(baseCoins);

  SyncQueue.enqueue({
    eventType: 'GAME_COMPLETED',
    entityId: gameId,
    score: score,
    metadata: {
      xpEarned: baseXP,
      coinsEarned: baseCoins,
      difficulty
    }
  });

  return {
    xp: baseXP,
    coins: baseCoins,
    isHighScore: false
  };
}