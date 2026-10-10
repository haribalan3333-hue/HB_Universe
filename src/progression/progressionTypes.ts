// ==========================================
// HB UNIVERSE — PROGRESSION TYPE SCHEMAS
// ==========================================

export type PlayerRankTier =
  | 'ROOKIE'
  | 'EXPLORER'
  | 'CHALLENGER'
  | 'PRO'
  | 'MASTER'
  | 'LEGEND'
  | 'HB LEGEND';

export interface RankInfo {
  tier: PlayerRankTier;
  title: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  badge: string;
  description: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  moviesWatched: number;
  tracksPlayed: number;
  aiInteractions: number;
  challengesCompleted: number;
  quizCorrectAnswers: number;
  totalChallengeScore: number;
  highestReactionTime: number;
  totalXP: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  achievementsUnlocked: number;
  daysActive: number;
}

export interface DailyStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  claimedDays: number[];    // 1-7
  lastRewardClaimDate: string;
}

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  category: 'ARCADE' | 'CINEMA' | 'MUSIC' | 'AI' | 'CHALLENGE' | 'STREAK';
  target: number;
  progress: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  claimed: boolean;
}

export interface WeeklyState {
  weekKey: string; // YYYY-WW
  missions: WeeklyMission[];
}
