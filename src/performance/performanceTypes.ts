export type QualityTier = 'ULTRA' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MOBILE';

export interface PerformanceMetrics {
  fps: number;
  dpr: number;
  tier: QualityTier;
  particleBudget: number;
  shadowsEnabled: boolean;
  postProcessingEnabled: boolean;
  isLowEnd: boolean;
}
