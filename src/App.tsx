/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Difficulty,
  DIFFICULTY_PRESETS,
  DifficultyConfig,
  CellData,
  GameStatus,
  SmileyState,
  GameStats,
  GameSettings,
} from './types/minesweeper';
import {
  createEmptyBoard,
  populateMines,
  revealCell,
  chordCell,
  toggleCellFlag,
  isGameWon,
  revealAllMinesOnLoss,
  flagAllMinesOnWin,
} from './utils/minesweeper';
import { soundFx, triggerHaptic } from './utils/audio';
import {
  loadStats,
  saveSettings,
  loadSettings,
  loadCustomConfig,
  saveCustomConfig,
  recordGameResult,
  resetAllStats,
} from './utils/storage';
import { Header } from './components/Header';
import { DifficultySelector } from './components/DifficultySelector';
import { MinesweeperHUD } from './components/MinesweeperHUD';
import { MinesweeperBoard } from './components/MinesweeperBoard';
import { StatsModal } from './components/StatsModal';
import { CustomGameModal } from './components/CustomGameModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { Trophy, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';

export default function App() {
  // Settings & Storage State
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [customConfig, setCustomConfig] = useState<DifficultyConfig>(loadCustomConfig);

  // Difficulty & Dimensions State
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const activeConfig: DifficultyConfig =
    difficulty === 'custom' ? customConfig : DIFFICULTY_PRESETS[difficulty];

  // Game Engine State
  const [board, setBoard] = useState<CellData[][]>(() =>
    createEmptyBoard(activeConfig.rows, activeConfig.cols)
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [isFirstMove, setIsFirstMove] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(0);
  const [flagMode, setFlagMode] = useState<boolean>(false);
  const [isMouseDownOnBoard, setIsMouseDownOnBoard] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Modals State
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync audio enabled with settings
  useEffect(() => {
    soundFx.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Save settings on change
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  // Timer Effect
  useEffect(() => {
    let intervalId: number | null = null;
    if (gameStatus === 'playing') {
      intervalId = window.setInterval(() => {
        setTimer((t) => Math.min(999, t + 1));
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameStatus]);

  // Calculate flagged cells and remaining mines
  const flaggedCount = board.reduce(
    (acc, row) => acc + row.filter((c) => c.state === 'flagged').length,
    0
  );
  const remainingMines = activeConfig.mines - flaggedCount;

  // Smiley face state
  const getSmileyState = (): SmileyState => {
    if (gameStatus === 'won') return 'won';
    if (gameStatus === 'lost') return 'lost';
    if (isMouseDownOnBoard) return 'pressed';
    return 'idle';
  };

  // Start new game
  const handleNewGame = useCallback(
    (targetDifficulty: Difficulty = difficulty, targetConfig?: DifficultyConfig) => {
      const cfg =
        targetConfig ||
        (targetDifficulty === 'custom' ? customConfig : DIFFICULTY_PRESETS[targetDifficulty]);

      setDifficulty(targetDifficulty);
      setBoard(createEmptyBoard(cfg.rows, cfg.cols));
      setGameStatus('ready');
      setIsFirstMove(true);
      setTimer(0);
      setIsMouseDownOnBoard(false);
      setIsNewRecord(false);
    },
    [difficulty, customConfig]
  );

  // Switch difficulty
  const handleSelectDifficulty = (newDiff: Difficulty) => {
    if (newDiff === 'custom' && difficulty !== 'custom') {
      setIsCustomOpen(true);
    }
    handleNewGame(newDiff);
  };

  // Save custom config
  const handleSaveCustom = (newConfig: DifficultyConfig) => {
    setCustomConfig(newConfig);
    saveCustomConfig(newConfig);
    handleNewGame('custom', newConfig);
  };

  // Reset all stats
  const handleResetStats = () => {
    const fresh = resetAllStats();
    setStats(fresh);
  };

  // Handle cell left-click (reveal or flag in flag mode)
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    // If Flag Mode is active, perform flag action instead of digging
    if (flagMode) {
      handleCellRightClick(row, col);
      return;
    }

    let currentBoard = board;

    // First click: generate mines safely
    if (isFirstMove) {
      currentBoard = populateMines(
        board,
        activeConfig.rows,
        activeConfig.cols,
        activeConfig.mines,
        row,
        col
      );
      setIsFirstMove(false);
      setGameStatus('playing');
    }

    const cell = currentBoard[row][col];
    if (cell.state === 'flagged') return;

    // Reveal cell
    const revealResult = revealCell(
      currentBoard,
      row,
      col,
      activeConfig.rows,
      activeConfig.cols
    );

    if (revealResult.hitMine) {
      // Game Over: Lost
      soundFx.playExplosion();
      if (settings.vibrationEnabled) triggerHaptic('heavy');
      const lostBoard = revealAllMinesOnLoss(revealResult.newBoard, row, col);
      setBoard(lostBoard);
      setGameStatus('lost');

      const { updatedStats } = recordGameResult(stats, difficulty, false, timer);
      setStats(updatedStats);
    } else {
      // Safe reveal
      if (revealResult.cellsRevealedCount > 1) {
        soundFx.playChord();
      } else {
        soundFx.playDig();
      }
      if (settings.vibrationEnabled) triggerHaptic('light');

      // Check win condition
      const won = isGameWon(
        revealResult.newBoard,
        activeConfig.rows,
        activeConfig.cols,
        activeConfig.mines
      );

      if (won) {
        // Game Won!
        soundFx.playVictory();
        if (settings.vibrationEnabled) triggerHaptic('win');
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
        });

        const wonBoard = flagAllMinesOnWin(revealResult.newBoard);
        setBoard(wonBoard);
        setGameStatus('won');

        const { updatedStats, isNewBestTime } = recordGameResult(
          stats,
          difficulty,
          true,
          timer
        );
        setStats(updatedStats);
        setIsNewRecord(isNewBestTime);
      } else {
        setBoard(revealResult.newBoard);
      }
    }
  };

  // Handle cell right-click (flagging)
  const handleCellRightClick = (row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    const { newBoard, action } = toggleCellFlag(
      board,
      row,
      col,
      settings.questionMarks
    );

    if (action === 'flag') {
      soundFx.playFlag();
      if (settings.vibrationEnabled) triggerHaptic('medium');
    } else if (action === 'unflag') {
      soundFx.playUnflag();
      if (settings.vibrationEnabled) triggerHaptic('light');
    }

    setBoard(newBoard);
  };

  // Handle chord click on revealed numbered cell
  const handleCellChordClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || !settings.quickChording) return;

    const chordResult = chordCell(
      board,
      row,
      col,
      activeConfig.rows,
      activeConfig.cols
    );

    if (chordResult.cellsRevealedCount === 0 && !chordResult.hitMine) return;

    if (chordResult.hitMine) {
      // Lost on incorrect flag chord
      soundFx.playExplosion();
      if (settings.vibrationEnabled) triggerHaptic('heavy');
      const lostBoard = revealAllMinesOnLoss(chordResult.newBoard, row, col);
      setBoard(lostBoard);
      setGameStatus('lost');

      const { updatedStats } = recordGameResult(stats, difficulty, false, timer);
      setStats(updatedStats);
    } else {
      soundFx.playChord();
      if (settings.vibrationEnabled) triggerHaptic('light');

      const won = isGameWon(
        chordResult.newBoard,
        activeConfig.rows,
        activeConfig.cols,
        activeConfig.mines
      );

      if (won) {
        soundFx.playVictory();
        if (settings.vibrationEnabled) triggerHaptic('win');
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
        });
        const wonBoard = flagAllMinesOnWin(chordResult.newBoard);
        setBoard(wonBoard);
        setGameStatus('won');

        const { updatedStats, isNewBestTime } = recordGameResult(
          stats,
          difficulty,
          true,
          timer
        );
        setStats(updatedStats);
        setIsNewRecord(isNewBestTime);
      } else {
        setBoard(chordResult.newBoard);
      }
    }
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an open modal or input field
      if (
        isStatsOpen ||
        isCustomOpen ||
        isHelpOpen ||
        isSettingsOpen ||
        ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleNewGame();
      } else if (e.key === ' ') {
        e.preventDefault();
        setFlagMode((prev) => !prev);
        if (settings.vibrationEnabled) triggerHaptic('light');
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
      } else if (e.key === '1') {
        handleSelectDifficulty('beginner');
      } else if (e.key === '2') {
        handleSelectDifficulty('intermediate');
      } else if (e.key === '3') {
        handleSelectDifficulty('expert');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isStatsOpen,
    isCustomOpen,
    isHelpOpen,
    isSettingsOpen,
    settings.soundEnabled,
    settings.vibrationEnabled,
    handleNewGame,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        onNewGame={() => handleNewGame()}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 max-w-5xl mx-auto w-full gap-4">
        {/* Difficulty Selection */}
        <DifficultySelector
          difficulty={difficulty}
          customConfig={customConfig}
          onSelectDifficulty={handleSelectDifficulty}
          onOpenCustomModal={() => setIsCustomOpen(true)}
        />

        {/* Game Arena Container */}
        <div className="w-full max-w-3xl flex flex-col items-center gap-3">
          {/* Status Banners (Win / Loss) */}
          {gameStatus === 'won' && (
            <div className="w-full p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>Victory! Swept in {timer}s</span>
                    {isNewRecord && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                        New Record!
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-emerald-400/80">
                    All mines safely identified. Excellent deduction!
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleNewGame()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
            </div>
          )}

          {gameStatus === 'lost' && (
            <div className="w-full p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-300">Mine Detonated!</div>
                  <div className="text-xs text-rose-400/80">
                    Don't worry, even grandmasters hit mines. Press R or restart to retry!
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleNewGame()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry (R)</span>
              </button>
            </div>
          )}

          {/* Minesweeper HUD */}
          <MinesweeperHUD
            remainingMines={remainingMines}
            time={timer}
            smileyState={getSmileyState()}
            flagMode={flagMode}
            onToggleFlagMode={() => setFlagMode((prev) => !prev)}
            onReset={() => handleNewGame()}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() =>
              handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
            }
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
            onZoomOut={() => setZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
            onResetZoom={() => setZoom(1)}
          />

          {/* Minesweeper Board */}
          <MinesweeperBoard
            board={board}
            rows={activeConfig.rows}
            cols={activeConfig.cols}
            gameStatus={gameStatus}
            theme={settings.theme}
            zoom={zoom}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
            onCellChordClick={handleCellChordClick}
            onBoardMouseDown={() => setIsMouseDownOnBoard(true)}
            onBoardMouseUp={() => setIsMouseDownOnBoard(false)}
          />

          {/* Footer Instruction & Quick Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-2 pb-6">
            <span>Left-click: Dig</span>
            <span aria-hidden="true">·</span>
            <span>Right-click or Long-press: Flag</span>
            <span aria-hidden="true">·</span>
            <span>Click revealed numbers: Quick Chord</span>
            <span aria-hidden="true">·</span>
            <span>Space: Toggle Flag mode</span>
          </div>
        </div>
      </main>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

      <CustomGameModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        initialConfig={customConfig}
        onSave={handleSaveCustom}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
