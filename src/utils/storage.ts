import { Difficulty, DifficultyConfig, GameSettings, GameStats } from '../types/minesweeper';

const STATS_KEY = 'minesweeper_pro_stats';
const SETTINGS_KEY = 'minesweeper_pro_settings';
const CUSTOM_CONFIG_KEY = 'minesweeper_pro_custom_config';

const defaultStats: GameStats = {
  beginner: { gamesPlayed: 0, gamesWon: 0, bestTime: null, currentStreak: 0, bestStreak: 0 },
  intermediate: { gamesPlayed: 0, gamesWon: 0, bestTime: null, currentStreak: 0, bestStreak: 0 },
  expert: { gamesPlayed: 0, gamesWon: 0, bestTime: null, currentStreak: 0, bestStreak: 0 },
  custom: { gamesPlayed: 0, gamesWon: 0, bestTime: null, currentStreak: 0, bestStreak: 0 },
};

const defaultSettings: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  questionMarks: false,
  quickChording: true,
  theme: 'modern',
};

const defaultCustomConfig: DifficultyConfig = {
  name: 'Custom',
  rows: 20,
  cols: 24,
  mines: 75,
};

export function loadStats(): GameStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    return {
      beginner: { ...defaultStats.beginner, ...(parsed.beginner || {}) },
      intermediate: { ...defaultStats.intermediate, ...(parsed.intermediate || {}) },
      expert: { ...defaultStats.expert, ...(parsed.expert || {}) },
      custom: { ...defaultStats.custom, ...(parsed.custom || {}) },
    };
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats: GameStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
}

export function recordGameResult(
  currentStats: GameStats,
  difficulty: Difficulty,
  won: boolean,
  timeInSeconds: number
): { updatedStats: GameStats; isNewBestTime: boolean } {
  const currentDiffStats = currentStats[difficulty] || {
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: null,
    currentStreak: 0,
    bestStreak: 0,
  };

  const newGamesPlayed = currentDiffStats.gamesPlayed + 1;
  const newGamesWon = won ? currentDiffStats.gamesWon + 1 : currentDiffStats.gamesWon;
  const newCurrentStreak = won ? currentDiffStats.currentStreak + 1 : 0;
  const newBestStreak = Math.max(currentDiffStats.bestStreak, newCurrentStreak);

  let isNewBestTime = false;
  let newBestTime = currentDiffStats.bestTime;

  if (won) {
    if (newBestTime === null || timeInSeconds < newBestTime) {
      newBestTime = timeInSeconds;
      isNewBestTime = true;
    }
  }

  const updatedDiffStats = {
    gamesPlayed: newGamesPlayed,
    gamesWon: newGamesWon,
    bestTime: newBestTime,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
  };

  const updatedStats: GameStats = {
    ...currentStats,
    [difficulty]: updatedDiffStats,
  };

  saveStats(updatedStats);
  return { updatedStats, isNewBestTime };
}

export function resetAllStats(): GameStats {
  saveStats(defaultStats);
  return defaultStats;
}

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: GameSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function loadCustomConfig(): DifficultyConfig {
  if (typeof window === 'undefined') return defaultCustomConfig;
  try {
    const raw = localStorage.getItem(CUSTOM_CONFIG_KEY);
    if (!raw) return defaultCustomConfig;
    return { ...defaultCustomConfig, ...JSON.parse(raw) };
  } catch {
    return defaultCustomConfig;
  }
}

export function saveCustomConfig(config: DifficultyConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // Ignore
  }
}
