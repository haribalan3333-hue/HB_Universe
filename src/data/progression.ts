export const LEVEL_THRESHOLDS = [
  0,     // Level 0
  100,   // Level 1
  250,   // Level 2
  450,   // Level 3
  700,   // Level 4
  1000,  // Level 5
  1350,  // Level 6
  1750,  // Level 7
  2200,  // Level 8
  2700,  // Level 9
  3300,  // Level 10
  4000,  // Level 11
  4800,  // Level 12 (Current baseline: 720/1000 in current bracket)
  5700,  // Level 13
  6700,  // Level 14
  7800,  // Level 15
  9000,  // Level 16
  10300, // Level 17
  11700, // Level 18
  13200, // Level 19
  15000, // Level 20 (Unlocks Mystery World!)
];

export function getXpForLevel(level: number): number {
  if (level <= 0) return 100;
  return Math.floor(100 * Math.pow(1.22, level - 1));
}

export function calculateLevelProgress(xp: number, maxXp: number): number {
  if (maxXp <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((xp / maxXp) * 100)));
}
