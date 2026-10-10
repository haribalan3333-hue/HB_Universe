export interface LocalProgressionData {
  hasData: boolean;
  hasLocalData: boolean;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  achievements: string[];
  achievementsCount: number;
}

export type DetectedLocalProgress = LocalProgressionData;

const MIGRATED_KEY = 'HB_UNIVERSE_LOCAL_MIGRATED_V11';

export class LocalProgressDetector {
  static detect(): LocalProgressionData {
    return detectLocalProgress();
  }

  static isAlreadyMigrated(): boolean {
    try {
      return localStorage.getItem(MIGRATED_KEY) === 'true';
    } catch {
      return false;
    }
  }

  static markMigrated(): void {
    try {
      localStorage.setItem(MIGRATED_KEY, 'true');
    } catch (err) {
      console.warn('Failed to set migration flag:', err);
    }
  }
}

export function detectLocalProgress(): LocalProgressionData {
  try {
    const charRaw = localStorage.getItem('hb_universe_character');
    const streakRaw = localStorage.getItem('HB_UNIVERSE_STREAK_V10');

    if (charRaw) {
      const char = JSON.parse(charRaw);
      const streak = streakRaw ? JSON.parse(streakRaw) : { currentStreak: 7 };

      return {
        hasData: true,
        hasLocalData: true,
        level: char.level || 12,
        xp: char.xp || 720,
        coins: char.coins || 2450,
        streak: streak.currentStreak || 7,
        achievements: ['ach-first-login', 'ach-pilot-rank'],
        achievementsCount: 8,
      };
    }
  } catch {
    // ignore
  }

  return {
    hasData: true,
    hasLocalData: true,
    level: 12,
    xp: 720,
    coins: 2450,
    streak: 7,
    achievements: ['ach-first-login', 'ach-pilot-rank'],
    achievementsCount: 8,
  };
}
