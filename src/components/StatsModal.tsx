import React, { useState } from 'react';
import { GameStats, Difficulty } from '../types/minesweeper';
import { X, Trophy, Flame, Percent, Clock, RotateCcw } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  const [activeTab, setActiveTab] = useState<Difficulty>('beginner');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const currentStats = stats[activeTab];
  const winRate =
    currentStats.gamesPlayed > 0
      ? Math.round((currentStats.gamesWon / currentStats.gamesPlayed) * 100)
      : 0;

  const formatBestTime = (time: number | null) => {
    if (time === null) return 'None';
    if (time < 60) return `${time}s`;
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold tracking-tight text-white">High Scores & Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex p-1 bg-slate-950 rounded-xl my-4 border border-slate-800">
          {(['beginner', 'intermediate', 'expert', 'custom'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-2">
          {/* Best Time Card */}
          <div className="col-span-2 p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Best Time</div>
                <div className="text-xl font-mono font-bold text-amber-300">
                  {formatBestTime(currentStats.bestTime)}
                </div>
              </div>
            </div>
            {currentStats.bestTime !== null && (
              <span className="text-xs text-emerald-400 font-medium">Record set!</span>
            )}
          </div>

          {/* Games Played */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="text-xs text-slate-400">Games Played</div>
            <div className="text-xl font-mono font-bold text-slate-100 mt-1">
              {currentStats.gamesPlayed}
            </div>
          </div>

          {/* Games Won */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="text-xs text-slate-400">Games Won</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              {currentStats.gamesWon}
            </div>
          </div>

          {/* Win Rate */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Percent className="w-3.5 h-3.5 text-cyan-400" />
              <span>Win Rate</span>
            </div>
            <div className="text-xl font-mono font-bold text-cyan-300 mt-1">
              {winRate}%
            </div>
          </div>

          {/* Streaks */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Streak</span>
            </div>
            <div className="text-sm font-mono text-slate-200 mt-1">
              Current: <strong className="text-orange-400">{currentStats.currentStreak}</strong>
              <span className="text-slate-600 mx-1">·</span>
              Best: <strong className="text-slate-100">{currentStats.bestStreak}</strong>
            </div>
          </div>
        </div>

        {/* Reset / Actions */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetStats();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all stats</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
