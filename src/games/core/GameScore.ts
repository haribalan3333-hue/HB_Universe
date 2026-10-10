import { ArcadeHighScores, getHighScores, saveHighScore } from '../../data/highScores';

export function getGameHighScore(gameId: string): number {
  const scores = getHighScores();
  return scores[gameId as keyof ArcadeHighScores] || 0;
}

export function recordGameScore(gameId: string, score: number): boolean {
  return saveHighScore(gameId as keyof ArcadeHighScores, score);
}