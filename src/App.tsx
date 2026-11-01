import React, { useEffect, useState } from 'react';
import type { ParsedProfile } from './types/profile.ts';
import { LandingHero } from './components/LandingHero.tsx';
import { MobileProfileView } from './components/MobileProfileView.tsx';
import { PresentationSlideDeck } from './components/PresentationSlideDeck.tsx';
import { ImageModal } from './components/ImageModal.tsx';
import { QrCodeModal } from './components/QrCodeModal.tsx';
import { generateQrDataUrl } from './utils/qrcode.ts';
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentProfiles, setRecentProfiles] = useState<RecentItem[]>([]);

  // Modals state
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // QR code data URL for profile
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Load recent profiles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_bni_profiles');
      if (stored) {
        setRecentProfiles(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute shareable profile URL
  const currentShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}${
        profile?.id ? `?id=${encodeURIComponent(profile.id)}` : ''
      }`
    : '';

  // Generate QR code data URL whenever currentShareUrl updates
  useEffect(() => {
    if (currentShareUrl && profile) {
      generateQrDataUrl(currentShareUrl).then(setQrCodeDataUrl);
    }
  }, [currentShareUrl, profile]);

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
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'プロフィールの取得・解析に失敗しました。URLをご確認ください。');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load check: if URL already has ?id=... or ?url=..., load it directly!
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialId = params.get('id');
    const initialUrl = params.get('url');

    if (initialId) {
      loadProfile(initialId);
    } else if (initialUrl) {
      loadProfile(initialUrl);
    }
    // If no parameter is present, we stay on LandingHero so user can paste their URL or test sample!
  }, []);

  // Return to landing page to input new profile
  const handleNewProfile = () => {
    setProfile(null);
    setError(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    url.searchParams.delete('url');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-[#0b0a0d] text-[#f5eff5] font-sans selection:bg-[#f4addb] selection:text-[#17121b]">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0a0d]/90 backdrop-blur-md p-6 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full border-2 border-[#f4addb] border-t-transparent animate-spin mb-4" />
          <h2 className="text-xl font-black text-white mb-2">
            プロフィールを最適化中…
          </h2>
          <p className="text-xs text-[#b8a7be] max-w-sm leading-relaxed">
            公開名簿から、顔写真・名刺表裏画像・1to1シート・GAINS・協業リストを抽出し、スマホ専用フォーマットへ変換しています。
          </p>
        </div>
      )}

      {/* Main View Switcher:
          If profile is loaded: render ONLY the pure, standalone smartphone-optimized profile page!
          If profile is not loaded: render the Reframe-inspired landing convert screen! */}
      {profile ? (
        <MobileProfileView
          profile={profile}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          onOpenSlideModal={() => setIsSlideModalOpen(true)}
          onOpenImageModal={(url, title) =>
            setImageModal({ isOpen: true, url, title })
          }
          onNewProfile={handleNewProfile}
        />
      ) : (
        <LandingHero
          onConvert={loadProfile}
          isLoading={isLoading}
          sampleUrl={SAMPLE_URL}
          error={error}
          recentProfiles={recentProfiles}
        />
      )}

      {/* Presentation Slide Deck Modal (16:9 Landscape Slides & PDF Vector Print) */}
      {profile && (
        <PresentationSlideDeck
          profile={profile}
          isOpen={isSlideModalOpen}
          onClose={() => setIsSlideModalOpen(false)}
          qrCodeUrl={qrCodeDataUrl}
        />
      )}

      {/* QR Code & Share Modal */}
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
