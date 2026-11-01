import React, { useState } from 'react';
import { RotateCw, Maximize2, CreditCard } from 'lucide-react';

interface DigitalBusinessCardProps {
  omoteUrl?: string;
  uraUrl?: string;
  memberName: string;
  companyName: string;
  onOpenImageModal: (url: string, title: string) => void;
}

export const DigitalBusinessCard: React.FC<DigitalBusinessCardProps> = ({
  omoteUrl,
  uraUrl,
  memberName,
  companyName,
  onOpenImageModal,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!omoteUrl && !uraUrl) {
    return null;
  }

  const hasBothSides = !!(omoteUrl && uraUrl);
  const currentUrl = isFlipped && uraUrl ? uraUrl : omoteUrl || uraUrl;
  const currentTitle = `${memberName} 様 名刺 (${isFlipped ? '裏面' : '表面'})`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            デジタル名刺
          </h3>
          <span className="text-[11px] text-slate-500">
            {isFlipped ? '裏面' : '表面'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasBothSides && (
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>裏表を切替</span>
            </button>
          )}

          {currentUrl && (
            <button
              onClick={() => onOpenImageModal(currentUrl, currentTitle)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="拡大表示"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Preview Container */}
      <div className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md bg-slate-50 dark:bg-slate-950 aspect-[91/55] flex items-center justify-center">
        {currentUrl ? (
          <img
            src={`/api/proxy-image?url=${encodeURIComponent(currentUrl)}`}
            alt={currentTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onClick={() => onOpenImageModal(currentUrl, currentTitle)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = currentUrl;
            }}
          />
        ) : (
          <div className="text-center p-6">
            <p className="text-xs text-slate-400">名刺画像はありません</p>
          </div>
        )}

        {/* Hover / Tap Hint */}
        <div
          onClick={() => onOpenImageModal(currentUrl!, currentTitle)}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
        >
          <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1.5 shadow-lg">
            <Maximize2 className="w-3.5 h-3.5" />
            タップで拡大
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-[11px] text-slate-400">
          タップすると高画質で全画面表示・保存できます
        </p>
      </div>
    </div>
  );
};
