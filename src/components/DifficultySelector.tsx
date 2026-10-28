import React from 'react';
import { Difficulty, DIFFICULTY_PRESETS, DifficultyConfig } from '../types/minesweeper';
import { SlidersHorizontal } from 'lucide-react';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  customConfig: DifficultyConfig;
  onSelectDifficulty: (d: Difficulty) => void;
  onOpenCustomModal: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  customConfig,
  onSelectDifficulty,
  onOpenCustomModal,
}) => {
  const getSubtext = (key: Difficulty) => {
    if (key === 'custom') {
      return `${customConfig.cols}×${customConfig.rows} · ${customConfig.mines} mines`;
    }
    const preset = DIFFICULTY_PRESETS[key];
    return `${preset.cols}×${preset.rows} · ${preset.mines} mines`;
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-2xl px-2">
      {/* Segmented Control */}
      <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-full overflow-x-auto shadow-inner">
        {(['beginner', 'intermediate', 'expert'] as const).map((key) => {
          const isActive = difficulty === key;
          const config = DIFFICULTY_PRESETS[key];
          return (
            <button
              key={key}
              onClick={() => onSelectDifficulty(key)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{config.name}</span>
              <span className={`text-[11px] font-mono ${isActive ? 'text-slate-900/80 font-bold' : 'text-slate-500'}`}>
                {config.cols}×{config.rows}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => {
            if (difficulty === 'custom') {
              onOpenCustomModal();
            } else {
              onSelectDifficulty('custom');
            }
          }}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            difficulty === 'custom'
              ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Custom Board Dimensions & Mines"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Custom</span>
        </button>
      </div>

      {/* Clean Unboxed Metadata Line */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="font-medium text-slate-300 capitalize">{difficulty}</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="font-mono">{getSubtext(difficulty)}</span>
        {difficulty === 'custom' && (
          <>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              onClick={onOpenCustomModal}
              className="text-amber-400 hover:underline cursor-pointer font-medium"
            >
              Edit parameters
            </button>
          </>
        )}
      </div>
    </div>
  );
};
