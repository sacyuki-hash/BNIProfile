import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Target, Sparkles, User, Award, HelpCircle } from 'lucide-react';
import type { OneToOneItem } from '../../types/profile.ts';

interface OneToOneTabProps {
  items: OneToOneItem[];
  memberName: string;
}

export const OneToOneTab: React.FC<OneToOneTabProps> = ({ items, memberName }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
        1to1シートの情報は登録されていません
      </div>
    );
  }

  const handleCopyTalk = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  // Helper icons for 1to1 questions
  const getIconForIndex = (index: number) => {
    switch (index) {
      case 0:
        return <User className="w-4 h-4 text-indigo-500" />;
      case 1:
        return <Award className="w-4 h-4 text-blue-500" />;
      case 2:
        return <Target className="w-4 h-4 text-emerald-500" />;
      case 3:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 4:
        return <Target className="w-4 h-4 text-rose-500" />;
      case 5:
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1to1 Concept Banner */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 p-4 rounded-3xl border border-indigo-100 dark:border-indigo-900/40">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          <h3 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
            1 to 1 ミーティングシート
          </h3>
        </div>
        <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
          {memberName} 様との1to1や、他の方へ紹介する際の要点です。
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isReferralTarget = index === 4 || item.question.includes('お客様');
          const isTalkScript = index === 5 || item.question.includes('切り出し');

          return (
            <div
              key={index}
              className={`p-4 rounded-3xl border transition-all ${
                isTalkScript
                  ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-sm'
                  : isReferralTarget
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getIconForIndex(index)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      QUESTION {item.number || index + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h4>
                  </div>
                </div>

                {/* Copy Talk Script Button */}
                {isTalkScript && (
                  <button
                    onClick={() => handleCopyTalk(item.answer, index)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl shrink-0 transition-colors shadow-2xs"
                    title="切り出しトークをコピー"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>コピー完了</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>トークをコピー</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Answer Content */}
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-1">
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
