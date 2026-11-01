import React from 'react';
import { PlusCircle, Sparkles, Moon, Sun } from 'lucide-react';

interface HeaderNavProps {
  onOpenInputModal: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onSelectSample: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenInputModal,
  isDark,
  onToggleDark,
  onSelectSample,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
            B
          </span>
          <span>BNI SmartProfile</span>
        </a>
      </div>

      {/* Zone 2: Clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={onSelectSample}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>サンプル読込</span>
        </button>
        <a
          href="#features"
          className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          機能概要
        </a>
        <a
          href="#how-to"
          className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          使い方
        </a>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleDark}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'ライトモードに切替' : 'ダークモードに切替'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenInputModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>URLを入力</span>
        </button>
      </div>
    </header>
  );
};
