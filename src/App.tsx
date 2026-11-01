import React, { useEffect, useState } from 'react';
import type { ParsedProfile } from './types/profile.ts';
import { HeaderNav } from './components/HeaderNav.tsx';
import { UrlInputBar } from './components/UrlInputBar.tsx';
import { MobileProfileView } from './components/MobileProfileView.tsx';
import { PhoneSimulatorWrapper } from './components/PhoneSimulatorWrapper.tsx';
import { ImageModal } from './components/ImageModal.tsx';
import { QrCodeModal } from './components/QrCodeModal.tsx';
import { generateQrDataUrl } from './utils/qrcode.ts';
import {
  Smartphone,
  CheckCircle,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Loader2,
  CreditCard,
  PhoneCall,
  UserCheck,
  Target,
  Sparkles,
} from 'lucide-react';

const SAMPLE_URL =
  'https://ne101.ncas.jp/bni_meibo/share?id=eyJpdiI6ImhWVDFuWDlxUTAxNDhnODZJdE1EQmc9PSIsInZhbHVlIjoiZytqT0JrQVFlSnAzeWl6ZEdobFY2dz09IiwibWFjIjoiZmI1NDg2NTNhOGQxYTFkZjlmYTM2NWVkOTY0MzExOTA0NjEzMDBkMzQ0NThjODZmZWYyN2EzZjMyOTcyNDVmYiIsInRhZyI6IiJ9';

interface RecentItem {
  id: string;
  name: string;
  company: string;
  category: string;
  url: string;
  timestamp: number;
}

export default function App() {
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [recentProfiles, setRecentProfiles] = useState<RecentItem[]>([]);

  // Modals state
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);

  // Desktop side QR code
  const [desktopQrUrl, setDesktopQrUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Setup theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Load recent profiles from localStorage
    try {
      const stored = localStorage.getItem('recent_bni_profiles');
      if (stored) {
        setRecentProfiles(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Profile Loader function
  const loadProfile = async (targetUrlOrId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `/api/parse-profile?url=${encodeURIComponent(targetUrlOrId.trim())}`;
      const res = await fetch(endpoint);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `データの取得に失敗しました (${res.status})`);
      }

      const data: ParsedProfile = await res.json();
      setProfile(data);

      // Save to recent profiles
      if (data.memberInfo.name) {
        const newItem: RecentItem = {
          id: data.id,
          name: data.memberInfo.name,
          company: data.businessInfo.company,
          category: data.memberInfo.category,
          url: targetUrlOrId,
          timestamp: Date.now(),
        };

        setRecentProfiles((prev) => {
          const filtered = prev.filter((p) => p.id !== data.id && p.name !== data.memberInfo.name);
          const updated = [newItem, ...filtered].slice(0, 10);
          try {
            localStorage.setItem('recent_bni_profiles', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }

      // Sync browser URL parameter without reloading page
      if (data.id) {
        const url = new URL(window.location.href);
        url.searchParams.set('id', data.id);
        window.history.replaceState({}, '', url.toString());
      }

      setIsInputModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'プロフィールの取得・解析に失敗しました。URLをご確認ください。');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialId = params.get('id');
    const initialUrl = params.get('url');

    if (initialId) {
      loadProfile(initialId);
    } else if (initialUrl) {
      loadProfile(initialUrl);
    } else {
      // Default to sample URL
      loadProfile(SAMPLE_URL);
    }
  }, []);

  // Compute shareable profile URL
  const currentShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}${
        profile?.id ? `?id=${encodeURIComponent(profile.id)}` : ''
      }`
    : '';

  // Generate desktop QR code when share URL changes
  useEffect(() => {
    if (currentShareUrl) {
      generateQrDataUrl(currentShareUrl).then(setDesktopQrUrl);
    }
  }, [currentShareUrl, profile]);

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Contract compliant navigation */}
      <HeaderNav
        onOpenInputModal={() => setIsInputModalOpen(true)}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
        onSelectSample={() => loadProfile(SAMPLE_URL)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Generator Controls & Desktop Hub (Hidden on small mobile when viewing card directly) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden border border-indigo-800/40">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/15 mb-3">
                スマートフォン最適化ジェネレーター
              </span>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
                BNI名簿シェアURLから、
                <br />
                美しいスマホ名刺＆1to1ページを自動生成
              </h1>

              <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-lg mb-4">
                PC専用の固定幅テーブル表示（横幅1200px）の名簿シェアURLから、顔写真・デジタル名刺・GAINS・1to1シート・連絡先情報を自動抽出し、スマホ片手で快適に閲覧できるデジタルカードを生成します。
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-3 border-t border-white/10 text-indigo-200">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>名刺表裏ビュー</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1to1事前シート</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-rose-400" />
                  <span>GAINS全項目</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <span>1タップ発信・保存</span>
                </div>
              </div>
            </div>

            {/* URL Input Form */}
            <UrlInputBar
              onLoadProfile={loadProfile}
              isLoading={isLoading}
              sampleUrl={SAMPLE_URL}
              recentProfiles={recentProfiles}
              onSelectRecent={loadProfile}
              currentError={error}
            />

            {/* Smartphone Live Preview & Instant QR Box for Desktop Users */}
            {profile && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      生成されたスマホページを実機で試す
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {profile.id ? profile.id.slice(0, 10) + '...' : 'loaded'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  {/* Desktop QR Display */}
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                    {desktopQrUrl ? (
                      <img
                        src={desktopQrUrl}
                        alt="QR Code"
                        className="w-28 h-28 object-contain"
                      />
                    ) : (
                      <div className="w-28 h-28 flex items-center justify-center text-[10px] text-slate-400">
                        QR生成中...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      スマホのカメラでかざして即アクセス
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      このQRコードまたは共有リンクを使えば、スマートフォン上でそのまま名刺の保存（vCard）や1to1シートの確認が可能です。
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap justify-center sm:justify-start">
                      <button
                        onClick={handleCopyShareLink}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>コピー完了！</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>共有リンクをコピー</span>
                          </>
                        )}
                      </button>

                      <a
                        href={currentShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>別タブで開く</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Direct Source Info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <span className="truncate max-w-[80%]">
                    元データ: {profile.pageTitle}
                  </span>
                  <a
                    href={profile.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 underline"
                  >
                    <span>公式元ページ</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Phone Simulator / Mobile Profile Viewer */}
          <div className="lg:col-span-6 w-full flex flex-col items-center">
            {isLoading ? (
              <div className="w-full max-w-[410px] h-[700px] rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center shadow-xl">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  プロフィール解析中...
                </h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  名簿サーバーからメンバー情報、写真、名刺画像、1to1シート、GAINSを最適化フォーマットに変換しています。
                </p>
              </div>
            ) : profile ? (
              <PhoneSimulatorWrapper
                isSimulatorMode={isSimulatorMode}
                onToggleSimulatorMode={setIsSimulatorMode}
              >
                <MobileProfileView
                  profile={profile}
                  onOpenQrModal={() => setIsQrModalOpen(true)}
                  onOpenImageModal={(url, title) =>
                    setImageModal({ isOpen: true, url, title })
                  }
                  isSimulator={isSimulatorMode}
                />
              </PhoneSimulatorWrapper>
            ) : (
              <div className="w-full max-w-[410px] h-[600px] rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center shadow-md">
                <Smartphone className="w-12 h-12 text-slate-400 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  URLを入力してください
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  左の入力欄に名簿シェアURLを入力するか、「サンプルで試す」をクリックするとスマホ最適化ページが生成されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile when scrolling */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsInputModalOpen(true)}
          className="h-12 px-4 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-xl hover:bg-indigo-500 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>別のURLを入力</span>
        </button>
      </div>

      {/* Input Modal for Mobile */}
      {isInputModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsInputModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <UrlInputBar
              onLoadProfile={loadProfile}
              isLoading={isLoading}
              sampleUrl={SAMPLE_URL}
              recentProfiles={recentProfiles}
              onSelectRecent={loadProfile}
              currentError={error}
            />
            <div className="mt-3 text-center">
              <button
                onClick={() => setIsInputModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-1"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {profile && (
        <QrCodeModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          url={currentShareUrl}
          memberName={profile.memberInfo.name}
          companyName={profile.businessInfo.company}
        />
      )}

      {/* Full-screen Image Preview Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal({ ...imageModal, isOpen: false })}
        imageUrl={imageModal.url}
        title={imageModal.title}
      />
    </div>
  );
}
