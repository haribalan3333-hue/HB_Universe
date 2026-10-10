import { GameStatus, GameDifficulty } from './GameState';
import { GameTimer } from './GameTimer';
import { getGameHighScore, recordGameScore } from './GameScore';
import { calculateGameRewards, GameRewardResult } from './GameRewards';
import { gameAudio } from './GameAudio';

export class GameSession {
  public readonly gameId: string;
  public difficulty: GameDifficulty = 'NORMAL';
  public status: GameStatus = 'MENU';
  public score: number = 0;
  public timer: GameTimer;

  constructor(gameId: string, difficulty: GameDifficulty = 'NORMAL') {
    this.gameId = gameId;
    this.difficulty = difficulty;
    this.timer = new GameTimer();
  }

  public get highScore(): number {
    return getGameHighScore(this.gameId);
  }

  public setDifficulty(diff: GameDifficulty) {
    this.difficulty = diff;
  }

  public startGame() {
    this.score = 0;
    this.timer.reset();
    this.timer.start();
    this.status = 'PLAYING';
    gameAudio.start();
  }

  public pause() {
    if (this.status !== 'PLAYING') return;
    this.timer.pause();
    this.status = 'PAUSED';
  }

  public resume() {
    if (this.status !== 'PAUSED') return;
    this.timer.resume();
    this.status = 'PLAYING';
  }

  public addScore(delta: number) {
    this.score = Math.max(0, this.score + delta);
    gameAudio.score();
  }

  public setScore(val: number) {
    this.score = Math.max(0, val);
  }

  public endGame(isVictory: boolean = false): GameRewardResult & { isNewHighScore: boolean } {
    this.timer.pause();
    const duration = this.timer.getElapsedSeconds();
    this.status = isVictory ? 'VICTORY' : 'GAMEOVER';

    if (isVictory) {
      gameAudio.victory();
    } else {
      gameAudio.gameOver();
    }

    const isNewHighScore = recordGameScore(this.gameId, this.score);
    const rewards = calculateGameRewards(this.gameId, this.score, duration, this.difficulty);
    rewards.isHighScore = isNewHighScore;

    return {
      ...rewards,
      isNewHighScore
    };
  }

  public reset() {
    this.timer.reset();
    this.score = 0;
    this.status = 'MENU';
  }
}
