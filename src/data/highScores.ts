const HIGH_SCORES_KEY = 'HB_UNIVERSE_ARCADE_HIGH_SCORES_V6';

export interface ArcadeHighScores {
  xo: number;
  snake: number;
  racing: number;
  runner: number;
  memory: number;
  reaction: number;
}

const defaultScores: ArcadeHighScores = {
  xo: 450,
  snake: 720,
  racing: 3400,
  runner: 1850,
  memory: 680,
  reaction: 245, // ms
};

export function getHighScores(): ArcadeHighScores {
  try {
    const raw = localStorage.getItem(HIGH_SCORES_KEY);
    return raw ? { ...defaultScores, ...JSON.parse(raw) } : defaultScores;
  } catch {
    return defaultScores;
  }
}

export function saveHighScore(gameId: keyof ArcadeHighScores, newScore: number): boolean {
  try {
    const current = getHighScores();
    let isBetter = false;

    if (gameId === 'reaction') {
      // Lower reaction time is better
      if (newScore > 0 && (current.reaction === 0 || newScore < current.reaction)) {
        current.reaction = newScore;
        isBetter = true;
      }
    } else {
      if (newScore > current[gameId]) {
        current[gameId] = newScore;
        isBetter = true;
      }
    }

    if (isBetter) {
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(current));
    }
    return isBetter;
  } catch {
    return false;
  }
}
