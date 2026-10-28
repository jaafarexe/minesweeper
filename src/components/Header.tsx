import React from 'react';
import { Bomb, Trophy, HelpCircle, Settings2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onNewGame: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewGame,
  onOpenStats,
  onOpenHelp,
  onOpenSettings,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-sm shadow-amber-500/20 text-white font-bold">
          <Bomb className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
          MineSweeper <span className="text-amber-400 font-extrabold">PRO</span>
        </span>
      </div>

      {/* Zone 2: Navigation / Action Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 hover:text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>High Scores</span>
        </button>
        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1.5 hover:text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>How to Play</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 hover:text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Settings2 className="w-4 h-4 text-slate-300" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary CTA */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile Quick Action Buttons */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={onOpenStats}
            title="High Scores"
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Trophy className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenHelp}
            title="How to Play"
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onNewGame}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>
    </header>
  );
};
