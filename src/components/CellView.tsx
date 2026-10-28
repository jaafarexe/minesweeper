import React, { useRef } from 'react';
import { CellData } from '../types/minesweeper';
import { Bomb, Flag, HelpCircle, X } from 'lucide-react';

interface CellViewProps {
  cell: CellData;
  theme: 'modern' | 'classic';
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
  onChordClick: (row: number, col: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const NUMBER_COLOR_CLASSES: Record<number, string> = {
  1: 'text-blue-400 font-extrabold',
  2: 'text-emerald-400 font-extrabold',
  3: 'text-red-400 font-extrabold',
  4: 'text-indigo-300 font-extrabold',
  5: 'text-amber-500 font-extrabold',
  6: 'text-teal-300 font-extrabold',
  7: 'text-slate-200 font-extrabold',
  8: 'text-slate-400 font-extrabold',
};

export const CellView: React.FC<CellViewProps> = ({
  cell,
  theme,
  onClick,
  onRightClick,
  onChordClick,
  onMouseDown,
  onMouseUp,
}) => {
  const longPressTimer = useRef<number | null>(null);
  const isLongPressTriggered = useRef(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(cell.row, cell.col);
  };

  const handleTouchStart = () => {
    isLongPressTriggered.current = false;
    longPressTimer.current = window.setTimeout(() => {
      isLongPressTriggered.current = true;
      onRightClick(cell.row, cell.col);
    }, 380);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isLongPressTriggered.current) {
      e.preventDefault();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPressTriggered.current) {
      isLongPressTriggered.current = false;
      return;
    }

    if (cell.state === 'revealed') {
      if (cell.neighborMines > 0) {
        onChordClick(cell.row, cell.col);
      }
    } else {
      onClick(cell.row, cell.col);
    }
  };

  // Determine appearance based on cell state
  const isRevealed = cell.state === 'revealed';
  const isHidden = cell.state === 'hidden';
  const isFlagged = cell.state === 'flagged';
  const isQuestion = cell.state === 'question';

  // Modern styling vs Classic styling
  let containerClasses = 'relative select-none flex items-center justify-center font-mono font-bold transition-transform ';

  if (theme === 'classic') {
    // Retro Windows 95/98 styling
    if (isRevealed) {
      if (cell.isExploded) {
        containerClasses += 'bg-red-600 border border-slate-700 ';
      } else {
        containerClasses += 'bg-[#bdbdbd] border border-[#7b7b7b] border-t-[#7b7b7b] border-l-[#7b7b7b] border-r-slate-300 border-b-slate-300 ';
      }
    } else {
      containerClasses += 'bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-b-2 border-t-white border-l-white border-r-[#7b7b7b] border-b-[#7b7b7b] active:border-[#7b7b7b] ';
    }
  } else {
    // Modern sleek dark styling
    if (isRevealed) {
      if (cell.isExploded) {
        containerClasses += 'bg-red-600/90 text-white shadow-[inset_0_0_12px_rgba(239,68,68,0.8)] border border-red-500 animate-pulse ';
      } else if (cell.isMine) {
        containerClasses += 'bg-slate-900 border border-slate-800 text-slate-300 ';
      } else {
        containerClasses += 'bg-slate-900/90 border border-slate-800/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-slate-800/60 ';
      }
    } else {
      containerClasses += 'bg-slate-700/80 hover:bg-slate-600/90 active:bg-slate-800 border-t border-l border-slate-500/50 border-r border-b border-slate-950/70 shadow-sm cursor-pointer ';
    }
  }

  return (
    <button
      type="button"
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onMouseDown={(e) => {
        if (e.button === 0) onMouseDown();
      }}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm ${containerClasses}`}
      aria-label={`Cell at row ${cell.row + 1}, column ${cell.col + 1}`}
    >
      {/* Revealed content */}
      {isRevealed && (
        <>
          {cell.isMine ? (
            <Bomb
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                cell.isExploded
                  ? 'text-white fill-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : 'text-slate-300 fill-slate-300'
              }`}
            />
          ) : cell.neighborMines > 0 ? (
            <span className={NUMBER_COLOR_CLASSES[cell.neighborMines] || 'text-slate-200'}>
              {cell.neighborMines}
            </span>
          ) : null}
        </>
      )}

      {/* Flagged */}
      {isFlagged && (
        <div className="flex items-center justify-center">
          {cell.isMisflagged ? (
            <div className="relative">
              <Bomb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <X className="w-5 h-5 text-red-500 absolute -top-0.5 -left-0.5 stroke-[3]" />
            </div>
          ) : (
            <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
          )}
        </div>
      )}

      {/* Question mark */}
      {isQuestion && (
        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300/30 font-bold" />
      )}
    </button>
  );
};
