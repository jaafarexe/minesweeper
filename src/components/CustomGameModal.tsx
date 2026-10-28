import React, { useState } from 'react';
import { DifficultyConfig } from '../types/minesweeper';
import { X, SlidersHorizontal, AlertCircle } from 'lucide-react';

interface CustomGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig: DifficultyConfig;
  onSave: (config: DifficultyConfig) => void;
}

export const CustomGameModal: React.FC<CustomGameModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  onSave,
}) => {
  const [rows, setRows] = useState(initialConfig.rows);
  const [cols, setCols] = useState(initialConfig.cols);
  const [mines, setMines] = useState(initialConfig.mines);

  if (!isOpen) return null;

  const totalCells = rows * cols;
  const maxMines = Math.max(1, totalCells - 9);
  const density = totalCells > 0 ? Math.round((mines / totalCells) * 100) : 0;

  const handleRowsChange = (val: number) => {
    const clamped = Math.max(8, Math.min(30, val));
    setRows(clamped);
    const newTotal = clamped * cols;
    const newMaxMines = Math.max(1, newTotal - 9);
    if (mines > newMaxMines) {
      setMines(newMaxMines);
    }
  };

  const handleColsChange = (val: number) => {
    const clamped = Math.max(8, Math.min(40, val));
    setCols(clamped);
    const newTotal = rows * clamped;
    const newMaxMines = Math.max(1, newTotal - 9);
    if (mines > newMaxMines) {
      setMines(newMaxMines);
    }
  };

  const handleMinesChange = (val: number) => {
    const clamped = Math.max(1, Math.min(maxMines, val));
    setMines(clamped);
  };

  const handleApplyPreset = (pRows: number, pCols: number, pMines: number) => {
    setRows(pRows);
    setCols(pCols);
    setMines(pMines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: 'Custom',
      rows,
      cols,
      mines,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold tracking-tight text-white">Custom Board Setup</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset(12, 12, 20)}
                className="p-2 bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-xs rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                Compact (12×12)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(20, 24, 75)}
                className="p-2 bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-xs rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                Wide (24×20)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(24, 30, 150)}
                className="p-2 bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-xs rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                Challenging (30×24)
              </button>
            </div>
          </div>

          {/* Width / Columns */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1">
              <span>Columns (Width): <strong className="text-amber-400 font-mono">{cols}</strong></span>
              <span className="text-slate-400">8 to 40</span>
            </div>
            <input
              type="range"
              min={8}
              max={40}
              value={cols}
              onChange={(e) => handleColsChange(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Height / Rows */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1">
              <span>Rows (Height): <strong className="text-amber-400 font-mono">{rows}</strong></span>
              <span className="text-slate-400">8 to 30</span>
            </div>
            <input
              type="range"
              min={8}
              max={30}
              value={rows}
              onChange={(e) => handleRowsChange(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Mines */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1">
              <span>Mines: <strong className="text-red-400 font-mono">{mines}</strong></span>
              <span className="text-slate-400">1 to {maxMines}</span>
            </div>
            <input
              type="range"
              min={1}
              max={maxMines}
              value={mines}
              onChange={(e) => handleMinesChange(Number(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>

          {/* Board Specs summary */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-400">
            <div>
              Total Cells: <strong className="text-slate-200 font-mono">{totalCells}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Mine Density:</span>
              <strong className={`font-mono ${density > 25 ? 'text-orange-400' : 'text-emerald-400'}`}>
                {density}%
              </strong>
            </div>
          </div>

          {density > 30 && (
            <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>High mine density may require guessing!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Start Custom Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
