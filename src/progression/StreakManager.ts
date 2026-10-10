import { DailyStreakState } from './progressionTypes';

const STREAK_STORAGE_KEY = 'HB_UNIVERSE_STREAK_V10';

export function getLocalDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadStreakState(): DailyStreakState {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    currentStreak: 7,
    longestStreak: 14,
    lastActivityDate: getLocalDateString(),
    claimedDays: [1, 2, 3, 4, 5, 6, 7],
    lastRewardClaimDate: getLocalDateString(),
  };
}

export function recordDailyActivity(): { streak: number; streakIncreased: boolean } {
  const state = loadStreakState();
  const today = getLocalDateString();

  if (state.lastActivityDate === today) {
    return { streak: state.currentStreak, streakIncreased: false };
  }

  // Calculate day difference
  const last = new Date(state.lastActivityDate).getTime();
  const current = new Date(today).getTime();
  const diffDays = Math.round((current - last) / (1000 * 60 * 60 * 24));

  let nextStreak = state.currentStreak;
  if (diffDays === 1) {
    nextStreak += 1;
  } else if (diffDays > 1) {
    nextStreak = 1; // reset streak if missed
  }

  const updated: DailyStreakState = {
    ...state,
    currentStreak: nextStreak,
    longestStreak: Math.max(state.longestStreak, nextStreak),
    lastActivityDate: today,
  };

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return { streak: nextStreak, streakIncreased: true };
}
