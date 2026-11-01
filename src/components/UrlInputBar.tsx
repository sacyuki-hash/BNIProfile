import React, { useState } from 'react';
import { Sparkles, ArrowRight, History, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface RecentProfileItem {
  id: string;
  name: string;
  company: string;
  category: string;
  url: string;
  timestamp: number;
}

interface UrlInputBarProps {
  onLoadProfile: (urlOrId: string) => void;
  isLoading: boolean;
  sampleUrl: string;
  recentProfiles: RecentProfileItem[];
  onSelectRecent: (url: string) => void;
  currentError?: string | null;
}

export const UrlInputBar: React.FC<UrlInputBarProps> = ({
  onLoadProfile,
  isLoading,
  sampleUrl,
  recentProfiles,
  onSelectRecent,
  currentError,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLoadProfile(inputValue.trim());
    }
  };

  const handleUseSample = () => {
    setInputValue(sampleUrl);
    onLoadProfile(sampleUrl);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>BNI 名簿シェアURLを入力</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
            share?id=...
          </code>{' '}
          のパラメータごとに誰でもスマホ最適化されたプロフィールが自動生成されます。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://ne101.ncas.jp/bni_meibo/share?id=... または IDパラメータ"
            className="w-full h-12 pl-4 pr-32 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>解析中...</span>
              </>
            ) : (
              <>
                <span>作成</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Button */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
          <button
            type="button"
            onClick={handleUseSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>横山 祐樹 様の参考URLで今すぐ試す</span>
          </button>

          <span className="text-[11px] text-slate-400">
            画像・連絡先・GAINS・1to1シートを全自動抽出
          </span>
        </div>
      </form>

      {/* Error Message */}
      {currentError && (
        <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <div className="leading-snug">{currentError}</div>
        </div>
      )}

      {/* Recent History */}
      {recentProfiles && recentProfiles.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>最近作成したメンバー</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {recentProfiles.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectRecent(item.url)}
                className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span className="font-semibold">{item.name}</span>
                {item.company && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    ({item.company})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
