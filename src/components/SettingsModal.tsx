import React from 'react';
import { GameSettings } from '../types/minesweeper';
import { X, Settings2, Volume2, Smartphone, HelpCircle, Palette, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-300" />
            <h2 className="text-lg font-bold tracking-tight text-white">Game Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-4 pt-4">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Sound Effects</div>
                <div className="text-[11px] text-slate-400">Play click, flag, and explosion audio</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Haptic Vibration</div>
                <div className="text-[11px] text-slate-400">Subtle vibration on touch moves</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) => onUpdateSettings({ vibrationEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {/* Question Marks */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Question Marks (?)</div>
                <div className="text-[11px] text-slate-400">Allow cycling flag to question mark</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.questionMarks}
                onChange={(e) => onUpdateSettings({ questionMarks: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {/* Quick Chording */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Quick Number Chording</div>
                <div className="text-[11px] text-slate-400">Click revealed numbers to open neighbors</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.quickChording}
                onChange={(e) => onUpdateSettings({ quickChording: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {/* Visual Theme */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <div className="text-xs font-semibold text-white">Visual Style</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'modern' })}
                className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-left cursor-pointer ${
                  settings.theme === 'modern'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">Modern Sleek</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Dark, clean high-contrast</div>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'classic' })}
                className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-left cursor-pointer ${
                  settings.theme === 'classic'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white">Classic 90s</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Retro grey beveled tiles</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
