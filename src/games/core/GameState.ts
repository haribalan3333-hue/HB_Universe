export type GameStatus = 'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY' | 'RESULT';
export type GameDifficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface BaseGameState {
  status: GameStatus;
  score: number;
  highScore: number;
  xpEarned: number;
  coinsEarned: number;
  duration: number;
  difficulty: GameDifficulty;
}
