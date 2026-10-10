// ==========================================
// HB UNIVERSE — CINEMA LOCAL PERSISTENCE
// ==========================================

const FAVORITES_KEY = 'HB_UNIVERSE_CINEMA_FAVORITES_V7';
const HISTORY_KEY = 'HB_UNIVERSE_CINEMA_HISTORY_V7';
const REWARDS_KEY = 'HB_UNIVERSE_CINEMA_REWARDS_V7';

export interface WatchProgress {
  mediaId: string;
  progressSeconds: number;
  durationSeconds: number;
  percent: number;
  timestamp: number;
}

export function getCinemaFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['pushpawathi'];
  } catch {
    return ['pushpawathi'];
  }
}

export function toggleCinemaFavorite(mediaId: string): boolean {
  const favs = getCinemaFavorites();
  const exists = favs.includes(mediaId);
  const updated = exists ? favs.filter((id) => id !== mediaId) : [...favs, mediaId];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return !exists;
}

export function isCinemaFavorite(mediaId: string): boolean {
  return getCinemaFavorites().includes(mediaId);
}

export function getWatchHistory(): Record<string, WatchProgress> {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveWatchProgress(mediaId: string, progressSeconds: number, durationSeconds: number) {
  if (durationSeconds <= 0) return;
  const history = getWatchHistory();
  const percent = Math.min(100, Math.round((progressSeconds / durationSeconds) * 100));
  history[mediaId] = {
    mediaId,
    progressSeconds,
    durationSeconds,
    percent,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function getWatchProgress(mediaId: string): WatchProgress | null {
  const history = getWatchHistory();
  return history[mediaId] || null;
}

export function getRewardedMedia(): string[] {
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function canClaimCinemaReward(mediaId: string): boolean {
  return !getRewardedMedia().includes(mediaId);
}

export function markCinemaRewarded(mediaId: string) {
  const rewards = getRewardedMedia();
  if (!rewards.includes(mediaId)) {
    rewards.push(mediaId);
    try {
      localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
    } catch {
      // ignore
    }
  }
}
