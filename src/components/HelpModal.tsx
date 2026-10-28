import React from 'react';
import { X, HelpCircle, Shield, Flag, MousePointer, Keyboard, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold tracking-tight text-white">How to Play MineSweeper Pro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4 text-sm text-slate-300">
          {/* Objective */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" /> Objective
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Find and uncover every tile that doesn't contain a mine. Uncover a mine, and boom—game over! Reveal all safe tiles to claim victory.
            </p>
          </div>

          {/* First Click Safety */}
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">First-Click Safety</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Your first click is 100% safe! Mines are generated only after your first move, guaranteeing an immediate opening pocket.
              </p>
            </div>
          </div>

          {/* Reading Numbers */}
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 font-mono font-bold text-sm flex items-center justify-center w-8 h-8">
              1-8
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Tile Numbers</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Each revealed number tells you exactly how many mines are touching that tile across its 8 neighboring squares (horizontal, vertical, diagonal).
              </p>
            </div>
          </div>

          {/* Flagging & Mobile */}
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Flagging Mines</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Right-click any hidden cell to plant a flag. On touchscreens, toggle into <strong>Flag Mode</strong> or hold down for 350ms to plant/remove flags.
              </p>
            </div>
          </div>

          {/* Pro Chording */}
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <MousePointer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Pro Chording Shortcut</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Once you have flagged the correct number of mines around a revealed number, click that number to instantly reveal all other hidden neighbors!
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
              <Keyboard className="w-4 h-4 text-cyan-400" /> Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">Restart Game</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-amber-300">R</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">Toggle Flag Mode</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-amber-300">Space</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">Toggle Mute</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-amber-300">M</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400">Beginner / Inter / Expert</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-amber-300">1 / 2 / 3</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Got it, let's play!
          </button>
        </div>
      </div>
    </div>
  );
};
