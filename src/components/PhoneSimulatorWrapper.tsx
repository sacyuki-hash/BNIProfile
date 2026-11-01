import React, { ReactNode } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface PhoneSimulatorWrapperProps {
  children: ReactNode;
  isSimulatorMode: boolean;
  onToggleSimulatorMode: (val: boolean) => void;
}

export const PhoneSimulatorWrapper: React.FC<PhoneSimulatorWrapperProps> = ({
  children,
  isSimulatorMode,
  onToggleSimulatorMode,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Viewport Mode Switcher for Desktop */}
      <div className="hidden lg:flex items-center justify-center gap-2 mb-4 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => onToggleSimulatorMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSimulatorMode
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>スマホ実機ビュー (390px)</span>
        </button>

        <button
          onClick={() => onToggleSimulatorMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            !isSimulatorMode
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>ワイド表示</span>
        </button>
      </div>

      {/* Simulator Device Frame or Standard Responsive Container */}
      {isSimulatorMode ? (
        <div className="relative w-full max-w-[410px] mx-auto">
          {/* Outer Phone Mockup Chassis for Desktop */}
          <div className="hidden lg:block relative p-3 bg-slate-900 rounded-[50px] shadow-2xl ring-1 ring-slate-800 ring-offset-2">
            {/* Dynamic Island / Speaker Pill */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-end px-3">
              <div className="w-3 h-3 rounded-full bg-slate-900/80 border border-slate-700/60" />
            </div>

            {/* Screen Container */}
            <div className="relative w-full h-[820px] bg-slate-50 dark:bg-slate-950 rounded-[40px] overflow-hidden overflow-y-auto scroll-smooth">
              {children}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-40 pointer-events-none" />
          </div>

          {/* On Mobile / Small screens: 100% full native display with zero mock bezel */}
          <div className="lg:hidden w-full min-h-screen">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  );
};
