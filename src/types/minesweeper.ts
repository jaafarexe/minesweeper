export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface DifficultyConfig {
  name: string;
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTY_PRESETS: Record<Exclude<Difficulty, 'custom'>, DifficultyConfig> = {
  beginner: {
    name: 'Beginner',
    rows: 9,
    cols: 9,
    mines: 10,
  },
  intermediate: {
    name: 'Intermediate',
    rows: 16,
    cols: 16,
    mines: 40,
  },
  expert: {
    name: 'Expert',
    rows: 16,
    cols: 30,
    mines: 99,
  },
};

export type CellState = 'hidden' | 'revealed' | 'flagged' | 'question';

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  neighborMines: number;
  state: CellState;
  isExploded?: boolean;
  isMisflagged?: boolean;
}

export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

export type SmileyState = 'idle' | 'pressed' | 'won' | 'lost';

export interface DifficultyStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number | null; // seconds
  currentStreak: number;
  bestStreak: number;
}

export type GameStats = Record<Difficulty, DifficultyStats>;

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  questionMarks: boolean;
  quickChording: boolean;
  theme: 'modern' | 'classic';
}
