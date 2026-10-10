import { audioManager } from '../../audio/audioManager';

export class GameAudioService {
  static click(): void {
    try { audioManager.playClick(); } catch {}
  }

  static countdown(): void {
    try { audioManager.playHover(); } catch {}
  }

  static start(): void {
    try { audioManager.playPortalOpen(); } catch {}
  }

  static score(): void {
    try { audioManager.playCoin(); } catch {}
  }

  static victory(): void {
    try { audioManager.playVictory(); } catch {}
  }

  static gameOver(): void {
    try { audioManager.playGameOver(); } catch {}
  }

  static gameover(): void {
    try { audioManager.playGameOver(); } catch {}
  }
}

export const gameAudio = GameAudioService;
