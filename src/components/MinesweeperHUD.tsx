import React from 'react';
import { SmileyState } from '../types/minesweeper';
import { Shovel, Flag, Volume2, VolumeX, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MinesweeperHUDProps {
  remainingMines: number;
  time: number;
  smileyState: SmileyState;
  flagMode: boolean;
  onToggleFlagMode: () => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const MinesweeperHUD: React.FC<MinesweeperHUDProps> = ({
  remainingMines,
  time,
  smileyState,
  flagMode,
  onToggleFlagMode,
  onReset,
  soundEnabled,
  onToggleSound,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  // Format numbers to 3 digits (e.g. 010, -05, 099)
  const formatNumber = (num: number): string => {
    if (num < 0) {
      const absStr = Math.abs(num).toString().padStart(2, '0');
      return `-${absStr.slice(-2)}`;
    }
    const clamped = Math.min(999, Math.max(0, num));
    return clamped.toString().padStart(3, '0');
  };

  const getSmileyEmoji = (state: SmileyState) => {
    switch (state) {
      case 'pressed':
        return '😮';
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      case 'idle':
      default:
        return '🙂';
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-md">
      {/* Top Bar: Digital Displays & Smiley */}
      <div className="flex items-center justify-between gap-4">
        {/* Mine Counter LCD */}
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Mines
          </span>
          <div
            className="flex items-center justify-center bg-black/90 border border-red-950/80 rounded-md px-2.5 py-1 min-w-[70px] shadow-inner"
            title="Remaining Mines (Total - Flagged)"
          >
            <span className="font-lcd text-2xl font-bold tracking-widest text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
              {formatNumber(remainingMines)}
            </span>
          </div>
        </div>

        {/* Central Smiley Face Restart Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={onReset}
            className="w-12 h-12 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:translate-y-0.5 border border-slate-600/60 shadow-md flex items-center justify-center text-2xl transition-all cursor-pointer group"
            title="Restart Game (Click to Reset)"
          >
            <span className="group-hover:scale-110 transition-transform select-none">
              {getSmileyEmoji(smileyState)}
            </span>
          </button>
          <span className="text-[10px] text-slate-400 mt-1">Restart</span>
        </div>

        {/* Timer LCD */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Time
          </span>
          <div
            className="flex items-center justify-center bg-black/90 border border-red-950/80 rounded-md px-2.5 py-1 min-w-[70px] shadow-inner"
            title="Time Elapsed in Seconds"
          >
            <span className="font-lcd text-2xl font-bold tracking-widest text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
              {formatNumber(time)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar: Flag/Dig Mode & Tooling */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Dig vs Flag Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              if (flagMode) onToggleFlagMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              !flagMode
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shovel className="w-3.5 h-3.5" />
            <span>Dig Mode</span>
          </button>

          <button
            onClick={() => {
              if (!flagMode) onToggleFlagMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              flagMode
                ? 'bg-red-500 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Flag Mode</span>
          </button>
        </div>

        {/* Quick Utilities: Sound Toggle & Zoom */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer ${
              soundEnabled ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={onZoomOut}
              disabled={zoom <= 0.75}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={onResetZoom}
              className="px-2 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
              title="Reset Zoom to 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              disabled={zoom >= 1.6}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
