import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, AlertCircle, Loader2, History } from 'lucide-react';

interface RecentProfileItem {
  id: string;
  name: string;
  company: string;
  category: string;
  url: string;
  timestamp: number;
}

interface LandingHeroProps {
  onConvert: (url: string) => void;
  isLoading: boolean;
  sampleUrl: string;
  error?: string | null;
  recentProfiles: RecentProfileItem[];
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onConvert,
  isLoading,
  sampleUrl,
  error,
  recentProfiles,
}) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onConvert(inputUrl.trim());
    }
  };

  const handleUseSample = () => {
    setInputUrl(sampleUrl);
    onConvert(sampleUrl);
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0a0d] text-[#f5eff5] flex flex-col justify-between selection:bg-[#f4addb] selection:text-[#17121b]">
      {/* Site Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
          <span>reframe</span>
          <span className="text-[#f4addb]">.</span>
          <span className="text-[10px] font-mono tracking-widest text-[#9a89a0] ml-2 uppercase">
            BY ELIXENCE
          </span>
        </a>

        <div className="flex items-center gap-4 text-xs font-medium text-[#dec5dc]">
          <span className="hidden sm:inline text-[#8a7a90]">
            アカウント登録・Googleログイン不要
          </span>
          <button
            onClick={handleUseSample}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full border border-[#4d3a58] hover:border-[#f4addb] text-[#f5eff5] transition-colors flex items-center gap-1.5 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f4addb]" />
            <span>サンプルを見る ↗</span>
          </button>
        </div>
      </header>

      {/* Main Landing Hero */}
      <main className="w-full max-w-4xl mx-auto px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#dec5dc] uppercase mb-4">
          <span className="text-[#f4addb]">✳</span>
          <span>YOUR STORY, REIMAGINED.</span>
          <span className="w-6 h-[1px] bg-[#4d3a58]" />
          <span className="text-[#9a89a0]">01 / CONNECT DIFFERENTLY</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] mb-6">
          その人らしさを、
          <br />
          <span className="text-gradient">もっと美しく。</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-xl text-[#dec5dc] leading-relaxed max-w-2xl mb-10 font-normal">
          見づらい名簿を、語りたくなるプロフィールへ。
          <br className="hidden sm:inline" />
          URLを貼るだけ。あなたの魅力が、ちゃんと伝わる。
        </p>

        {/* Convert Form */}
        <div className="w-full bg-[#15111c] border border-[#2f2436] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle backdrop wash */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#d946ef]/10 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="bni-url"
                className="text-xs font-mono tracking-widest text-[#dec5dc] uppercase"
              >
                YOUR BNI PROFILE URL
              </label>
              <span className="text-[11px] text-[#f4addb]">
                公開URLまたはIDを入力
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 bg-[#0b0a0d] border border-[#3b2e45] rounded-2xl focus-within:border-[#f4addb] transition-colors">
              <span className="hidden sm:flex items-center justify-center pl-3 text-[#f4addb] text-lg font-light">
                ↗
              </span>
              <input
                id="bni-url"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://ne101.ncas.jp/bni_meibo/share?id=… または viewsheets.php?id=…"
                className="flex-1 h-12 px-3 text-sm bg-transparent text-white placeholder-[#786980] focus:outline-none font-mono"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputUrl.trim()}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#a855f7] hover:from-[#ec4899] hover:to-[#9333ea] disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#d946ef]/20 shrink-0 cursor-pointer active:scale-98"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>読み取り中…</span>
                  </>
                ) : (
                  <>
                    <span>プロフィールを生成</span>
                    <span className="font-light text-base">↗</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-[#24131b] border border-rose-900/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Footer Note */}
            <div className="flex items-center justify-between text-[11px] text-[#8e7e94] pt-1 flex-wrap gap-2">
              <span>
                対応形式: BNI SHARE / VIEWSHEETS · Googleログイン不要 · アカウント登録不要
              </span>
              <button
                type="button"
                onClick={handleUseSample}
                disabled={isLoading}
                className="text-[#f4addb] hover:underline font-medium cursor-pointer"
              >
                横山 祐樹 様のサンプルで試す ↗
              </button>
            </div>
          </form>

          {/* Recent Profiles if any */}
          {recentProfiles && recentProfiles.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#291f30]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8a7b91] uppercase tracking-wider mb-2">
                <History className="w-3.5 h-3.5" />
                <span>RECENT PROFILES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentProfiles.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onConvert(item.url)}
                    className="px-3 py-1 rounded-xl bg-[#20182b] hover:bg-[#2e213e] text-xs text-[#dec5dc] hover:text-[#f4addb] border border-[#3b2c48] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="font-bold text-white">{item.name}</span>
                    {item.company && (
                      <span className="text-[10px] text-[#8e7e94]">
                        ({item.company})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3 Step Visual (The Experience) */}
        <div className="mt-16 sm:mt-24">
          <div className="mb-6">
            <span className="text-xs font-mono tracking-widest text-[#f4addb] uppercase">
              THE EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              少ない操作で、
              <br />
              <span className="italic font-serif text-[#dec5dc]">大きな第一印象を。</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#130f1a] border border-[#2b2033] space-y-2">
              <span className="text-xs font-mono text-[#f4addb]">01 ⌘</span>
              <h3 className="text-lg font-bold text-white">Paste.</h3>
              <p className="text-xs text-[#dec5dc] leading-relaxed">
                BNIの公開プロフィールURL（share または viewsheets.php）を貼り付ける。
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#130f1a] border border-[#2b2033] space-y-2">
              <span className="text-xs font-mono text-[#f4addb]">02 ✳</span>
              <h3 className="text-lg font-bold text-white">Reframe.</h3>
              <p className="text-xs text-[#dec5dc] leading-relaxed">
                写真、名刺、GAINS、1to1シートを整理し、スマホに最適化されたページを自動生成。
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#130f1a] border border-[#2b2033] space-y-2">
              <span className="text-xs font-mono text-[#f4addb]">03 ↗</span>
              <h3 className="text-lg font-bold text-white">Connect & Present.</h3>
              <p className="text-xs text-[#dec5dc] leading-relaxed">
                スマホで名刺交換・1to1シート活用。プレゼンスライド型PDFも瞬時にダウンロード可能。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-[#231a29] flex flex-col sm:flex-row items-center justify-between text-xs text-[#786980] gap-4">
        <a href="/" className="font-bold text-white tracking-tight">
          reframe<span className="text-[#f4addb]">.</span>
        </a>
        <div className="flex items-center gap-4 text-[11px]">
          <span>INDEPENDENT TOOL / NOT OFFICIAL BNI</span>
          <span>·</span>
          <span>A playful project, produced for BNI members</span>
        </div>
      </footer>
    </div>
  );
};
