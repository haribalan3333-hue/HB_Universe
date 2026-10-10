import { QualityTier, PerformanceMetrics } from './performanceTypes';
import { TouchManager } from '../input/TouchManager';

export class QualityManager {
  private static currentTier: QualityTier = 'HIGH';
  private static fpsHistory: number[] = [];
  private static lastCheck: number = Date.now();

  static init(): QualityTier {
    TouchManager.init();
    const isMobile = TouchManager.isTouchDevice() || window.innerWidth < 768;
    const isUltra = window.innerWidth >= 1920;

    if (isMobile) {
      this.currentTier = 'MOBILE';
    } else if (isUltra) {
      this.currentTier = 'ULTRA';
    } else {
      this.currentTier = 'HIGH';
    }
    return this.currentTier;
  }

  static getMetrics(): PerformanceMetrics {
    const isMobile = this.currentTier === 'MOBILE' || this.currentTier === 'LOW';
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 2.0);

    const particleMap = {
      ULTRA: 1200,
      HIGH: 800,
      MEDIUM: 400,
      LOW: 150,
      MOBILE: 120
    };

    return {
      fps: this.getAverageFps(),
      dpr,
      tier: this.currentTier,
      particleBudget: particleMap[this.currentTier],
      shadowsEnabled: this.currentTier === 'ULTRA' || this.currentTier === 'HIGH',
      postProcessingEnabled: this.currentTier === 'ULTRA' || this.currentTier === 'HIGH',
      isLowEnd: isMobile
    };
  }

  static recordFrame(delta: number): void {
    const fps = Math.min(1 / Math.max(delta, 0.001), 60);
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > 60) this.fpsHistory.shift();

    // Check dynamic degradation every 5 seconds
    if (Date.now() - this.lastCheck > 5000) {
      this.lastCheck = Date.now();
      const avg = this.getAverageFps();
      if (avg < 28 && this.currentTier !== 'LOW' && this.currentTier !== 'MOBILE') {
        this.degrade();
      }
    }
  }

  static getAverageFps(): number {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  private static degrade(): void {
    if (this.currentTier === 'ULTRA') this.currentTier = 'HIGH';
    else if (this.currentTier === 'HIGH') this.currentTier = 'MEDIUM';
    else if (this.currentTier === 'MEDIUM') this.currentTier = 'LOW';
  }

  static setTier(tier: QualityTier): void {
    this.currentTier = tier;
  }
}
