import React, { useRef } from 'react';
import { CellData, GameStatus } from '../types/minesweeper';
import { CellView } from './CellView';

interface MinesweeperBoardProps {
  board: CellData[][];
  rows: number;
  cols: number;
  gameStatus: GameStatus;
  theme: 'modern' | 'classic';
  zoom: number;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellChordClick: (row: number, col: number) => void;
  onBoardMouseDown: () => void;
  onBoardMouseUp: () => void;
}

export const MinesweeperBoard: React.FC<MinesweeperBoardProps> = ({
  board,
  rows,
  cols,
  gameStatus,
  theme,
  zoom,
  onCellClick,
  onCellRightClick,
  onCellChordClick,
  onBoardMouseDown,
  onBoardMouseUp,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center">
      {/* Scrollable & Zoomable viewport */}
      <div
        ref={containerRef}
        className="w-full max-w-full overflow-auto p-4 sm:p-6 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-2xl min-h-[300px]"
        style={{
          touchAction: 'pan-x pan-y',
        }}
      >
        <div
          className="inline-block transition-transform duration-150 origin-top"
          style={{
            transform: `scale(${zoom})`,
          }}
          onMouseDown={(e) => {
            if (e.button === 0 && gameStatus !== 'lost' && gameStatus !== 'won') {
              onBoardMouseDown();
            }
          }}
          onMouseUp={onBoardMouseUp}
          onMouseLeave={onBoardMouseUp}
        >
          {/* Classic vs Modern Board Frame */}
          <div
            className={`p-2 rounded-lg shadow-inner ${
              theme === 'classic'
                ? 'bg-[#c0c0c0] border-t-4 border-l-4 border-r-4 border-b-4 border-t-[#7b7b7b] border-l-[#7b7b7b] border-r-white border-b-white'
                : 'bg-slate-900/90 border border-slate-800'
            }`}
          >
            <div
              className="grid gap-[2px] bg-slate-950/80 p-1 rounded"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {board.map((rowArr, r) =>
                rowArr.map((cell, c) => (
                  <CellView
                    key={`${r}-${c}`}
                    cell={cell}
                    theme={theme}
                    onClick={onCellClick}
                    onRightClick={onCellRightClick}
                    onChordClick={onCellChordClick}
                    onMouseDown={onBoardMouseDown}
                    onMouseUp={onBoardMouseUp}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
