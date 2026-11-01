import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  QrCode,
  Download,
  Share2,
  Calendar,
  Search,
  X,
  CreditCard,
  MessageSquare,
  Sparkles,
  Users,
  UserCheck,
  FileText,
  ChevronDown,
  Copy,
  Check,
  Target,
  Trophy,
  Heart,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import type { ParsedProfile } from '../types/profile.ts';

interface MobileProfileViewProps {
  profile: ParsedProfile;
  onOpenQrModal: () => void;
  onOpenSlideModal: () => void;
  onOpenImageModal: (url: string, title: string) => void;
  onNewProfile: () => void;
}

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  profile,
  onOpenQrModal,
  onOpenSlideModal,
  onOpenImageModal,
  onNewProfile,
}) => {
  const { memberInfo, businessInfo, gains, mr, oneToOne, contactCircle, customerList } =
    profile;

  // Business card 3D flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTalkIndex, setCopiedTalkIndex] = useState<number | null>(null);

  // Active accordion sections (default: 1to1 and Gains open)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    intro: true,
    oneToOne: true,
    gains: true,
    contact: false,
    customers: false,
    businessDetail: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // vCard download URL
  const vcardUrl = `/api/vcard?name=${encodeURIComponent(
    memberInfo.name
  )}&furigana=${encodeURIComponent(
    memberInfo.furigana
  )}&company=${encodeURIComponent(
    businessInfo.company
  )}&title=${encodeURIComponent(businessInfo.title)}&phone=${encodeURIComponent(
    businessInfo.phone
  )}&email=${encodeURIComponent(
    businessInfo.email
  )}&url=${encodeURIComponent(
    businessInfo.website?.url || ''
  )}&address=${encodeURIComponent(businessInfo.address || '')}`;

  // Image proxy helper
  const getProxiedImage = (url?: string) =>
    url ? `/api/proxy-image?url=${encodeURIComponent(url)}` : undefined;

  // Share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}${
        profile.id ? `?id=${encodeURIComponent(profile.id)}` : ''
      }`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // ignore
    }
  };

  const handleCopyTalk = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTalkIndex(idx);
      setTimeout(() => setCopiedTalkIndex(null), 2000);
    } catch {
      // ignore
    }
  };

  const currentCardUrl = isCardFlipped && profile.meishiUraUrl ? profile.meishiUraUrl : profile.meishiOmoteUrl;
  const currentCardTitle = `${memberInfo.name} 様 名刺 (${isCardFlipped ? '裏面' : '表面'})`;

  return (
    <div className="w-full min-h-screen bg-[#0b0a0d] text-[#f5eff5] font-sans selection:bg-[#f4addb] selection:text-[#17121b] pb-24">
      {/* Standalone Minimal Header (No tool chrome) */}
      <header className="sticky top-0 z-40 w-full bg-[#0e0c12]/85 backdrop-blur-md border-b border-[#251d2c] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
          <span>reframe</span>
          <span className="text-[#f4addb]">.</span>
          <span className="text-[9px] font-mono tracking-widest text-[#9a89a0] ml-1 uppercase">
            PROFILE
          </span>
        </a>

        {/* Quick Actions in Header */}
        <div className="flex items-center gap-2">
          {/* Slide PDF Trigger Button */}
          <button
            onClick={onOpenSlideModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#20182b] hover:bg-[#2c213b] border border-[#483656] text-xs font-semibold text-[#f5eff5] transition-colors"
            title="プレゼンテーションスライド型PDFを表示・保存"
          >
            <FileText className="w-3.5 h-3.5 text-[#f4addb]" />
            <span className="hidden sm:inline">スライド型PDF</span>
            <span className="sm:hidden">スライド</span>
          </button>

          {/* QR Share Button */}
          <button
            onClick={onOpenQrModal}
            className="p-2 rounded-full bg-[#20182b] hover:bg-[#2c213b] border border-[#483656] text-[#dec5dc] hover:text-white transition-colors"
            title="QRコード・共有"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* New Profile / Input Switcher (Discreet Escape Hatch) */}
          <button
            onClick={onNewProfile}
            className="text-[11px] font-mono text-[#8d7c94] hover:text-[#f4addb] px-2 py-1 transition-colors"
            title="別のBNIプロフィールを作成"
          >
            ＋ 別のURL
          </button>
        </div>
      </header>

      {/* Main Profile Canvas (Max-width 3xl centered on desktop, 100% on mobile) */}
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {/* Eyebrow Topline */}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#dec5dc] uppercase">
          <span className="text-[#f4addb]">✳</span>
          <span>YOUR STORY, REIMAGINED.</span>
          <span className="w-5 h-[1px] bg-[#3e2e48]" />
          <span className="text-[#8e7e94]">01 / BNI MEMBER</span>
        </div>

        {/* Profile Hero Layout */}
        <div className="bg-gradient-to-b from-[#16111f] to-[#100d16] border border-[#2e2336] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Pink Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#d946ef]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            {/* Portrait Photo */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="relative group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full sm:rounded-3xl p-1 bg-gradient-to-tr from-[#f4addb] via-[#d946ef] to-[#8b5cf6] shadow-xl overflow-hidden cursor-pointer">
                  {profile.photoUrl ? (
                    <img
                      src={getProxiedImage(profile.photoUrl)}
                      alt={memberInfo.name}
                      onClick={() =>
                        onOpenImageModal(profile.photoUrl!, `${memberInfo.name} 様 プロフィール写真`)
                      }
                      className="w-full h-full object-cover rounded-full sm:rounded-3xl transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = profile.photoUrl!;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full sm:rounded-3xl bg-[#1d1627] flex items-center justify-center text-4xl font-bold text-white">
                      {memberInfo.name.slice(0, 2)}
                    </div>
                  )}
                </div>

                {profile.photoUrl && (
                  <button
                    onClick={() =>
                      onOpenImageModal(profile.photoUrl!, `${memberInfo.name} 様 プロフィール写真`)
                    }
                    className="absolute bottom-1 right-1 p-2 bg-[#0b0a0d]/80 backdrop-blur-md border border-[#3b2d45] text-white rounded-full shadow-lg"
                    title="拡大表示"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Membership badges */}
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#9a89a0] flex-wrap">
                {memberInfo.role && (
                  <span className="px-2 py-0.5 rounded-full bg-[#f4addb]/15 text-[#f4addb] font-medium border border-[#f4addb]/30">
                    {memberInfo.role}
                  </span>
                )}
                {memberInfo.joinedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#f4addb]" />
                    <span>入会: {memberInfo.joinedDate}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Member Details */}
            <div className="sm:col-span-7 space-y-3 text-center sm:text-left">
              {/* Romaji */}
              {memberInfo.romaji && (
                <span className="text-[11px] font-mono tracking-widest text-[#f4addb] uppercase block">
                  {memberInfo.romaji}
                </span>
              )}

              {/* Japanese Name */}
              <div className="space-y-0.5">
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {memberInfo.name}
                </h1>
                {memberInfo.furigana && (
                  <div className="text-xs text-[#dec5dc] tracking-wider">
                    {memberInfo.furigana}
                  </div>
                )}
              </div>

              {/* Company & Title */}
              <div className="text-lg sm:text-xl font-bold text-[#f5eff5] flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-white">{businessInfo.company}</span>
                {businessInfo.title && (
                  <>
                    <span className="text-[#64526b]">/</span>
                    <span className="text-[#dec5dc] font-medium text-base">
                      {businessInfo.title}
                    </span>
                  </>
                )}
              </div>

              {/* Category */}
              {memberInfo.category && (
                <div className="p-3 rounded-2xl bg-[#1b1525] border border-[#34263f] text-xs text-[#dec5dc] leading-relaxed">
                  <span className="text-[10px] font-mono text-[#f4addb] uppercase block mb-0.5">
                    CATEGORY
                  </span>
                  <div className="font-medium text-white">{memberInfo.category}</div>
                  {memberInfo.categoryEn && (
                    <div className="text-[10px] text-[#9a89a0] mt-0.5">
                      {memberInfo.categoryEn}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Contact & Action Buttons (Thumb zone friendly) */}
          <div className="mt-6 pt-6 border-t border-[#291f31] grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {businessInfo.phone && (
              <a
                href={`tel:${businessInfo.phone}`}
                className="h-12 rounded-2xl bg-white hover:bg-slate-100 text-[#17121b] font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
              >
                <Phone className="w-4 h-4 text-[#17121b]" />
                <span>電話をかける</span>
              </a>
            )}

            {businessInfo.email && (
              <a
                href={`mailto:${businessInfo.email}?subject=BNIのご縁にて`}
                className="h-12 rounded-2xl bg-[#20182b] hover:bg-[#2c203b] border border-[#433150] text-[#f5eff5] font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <Mail className="w-4 h-4 text-[#f4addb]" />
                <span>メール送信</span>
              </a>
            )}

            {businessInfo.website ? (
              <a
                href={businessInfo.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 rounded-2xl bg-[#20182b] hover:bg-[#2c203b] border border-[#433150] text-[#f5eff5] font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 truncate px-3"
              >
                <Globe className="w-4 h-4 text-[#f4addb] shrink-0" />
                <span className="truncate">Webサイト ↗</span>
              </a>
            ) : businessInfo.address ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  businessInfo.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 rounded-2xl bg-[#20182b] hover:bg-[#2c203b] border border-[#433150] text-[#f5eff5] font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 truncate px-3"
              >
                <MapPin className="w-4 h-4 text-[#f4addb] shrink-0" />
                <span>マップで開く ↗</span>
              </a>
            ) : null}

            {/* Save to Phone Contacts (vCard) */}
            <a
              href={vcardUrl}
              download={`${memberInfo.name}.vcf`}
              className="h-12 rounded-2xl bg-gradient-to-r from-[#d946ef] to-[#a855f7] hover:from-[#ec4899] hover:to-[#9333ea] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#d946ef]/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>連絡先に保存</span>
            </a>
          </div>
        </div>

        {/* Share Strip (Clean link copy bar) */}
        <div className="bg-[#14101c] border border-[#2c2135] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
            <span className="text-xs font-mono text-[#f4addb]">SHARE</span>
            <span className="text-xs text-[#dec5dc] truncate font-mono bg-[#0c0a0e] px-2.5 py-1.5 rounded-lg border border-[#2b1f34] flex-1 sm:max-w-md">
              {shareUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white text-[#17121b] text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>共有URLをコピーしました ✳</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>URLをコピー</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenQrModal}
              className="p-2 rounded-xl bg-[#231b2e] border border-[#3e2e4b] text-[#dec5dc] hover:text-white transition-colors"
              title="QRコードを表示"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Digital Business Card (名刺表裏 3Dビュー) */}
        {(profile.meishiOmoteUrl || profile.meishiUraUrl) && (
          <div className="bg-[#14101b] border border-[#2d2235] rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#f4addb]" />
                <h3 className="text-sm font-bold text-white">デジタル名刺</h3>
                <span className="text-xs text-[#8e7e94]">
                  ({isCardFlipped ? '裏面' : '表面'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {profile.meishiUraUrl && (
                  <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#231a2e] hover:bg-[#322342] text-xs text-[#f4addb] border border-[#433152] transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>裏表を切替</span>
                  </button>
                )}

                {currentCardUrl && (
                  <button
                    onClick={() => onOpenImageModal(currentCardUrl, currentCardTitle)}
                    className="p-1.5 rounded-lg bg-[#231a2e] text-[#dec5dc] hover:text-white"
                    title="拡大表示"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Card Preview Box */}
            <div
              onClick={() =>
                currentCardUrl && onOpenImageModal(currentCardUrl, currentCardTitle)
              }
              className="relative group cursor-pointer overflow-hidden rounded-2xl border border-[#392947] bg-[#0c0a0e] aspect-[91/55] flex items-center justify-center shadow-inner"
            >
              {currentCardUrl ? (
                <img
                  src={getProxiedImage(currentCardUrl)}
                  alt={currentCardTitle}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = currentCardUrl;
                  }}
                />
              ) : (
                <div className="text-xs text-[#786980]">名刺画像はありません</div>
              )}
            </div>
            <p className="text-[11px] text-[#7d6d84] text-center">
              タップで名刺を高解像度拡大・ダウンロードできます
            </p>
          </div>
        )}

        {/* =========================================================
            SECTION ACCORDIONS (Styled with Reframe dark luxury detail)
            ========================================================= */}
        <div className="space-y-4">
          {/* Section 01: 1to1 ミーティングシート (Most Essential) */}
          <div className="bg-[#14101c] border border-[#2d2236] rounded-3xl overflow-hidden shadow-xl">
            <button
              onClick={() => toggleSection('oneToOne')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#1a1524] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#f4addb] font-bold">01</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>1 to 1 ミーティングシート</span>
                    <span className="text-[10px] font-mono tracking-wider text-[#9a89a0] uppercase border-l border-[#3a2d42] pl-2">
                      CORE STRATEGY
                    </span>
                  </h3>
                  <p className="text-xs text-[#8e7e94]">
                    専門分野・他社にない強み・理想のお客様・紹介トーク
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#f4addb] transition-transform duration-200 ${
                  openSections.oneToOne ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.oneToOne && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#251b2e] space-y-4">
                {oneToOne.map((item, idx) => {
                  const isCustomerTarget = idx === 4 || item.question.includes('お客様');
                  const isTalkScript = idx === 5 || item.question.includes('切り出し');

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${
                        isTalkScript
                          ? 'bg-gradient-to-br from-[#1a1426] to-[#251733] border-[#d946ef]/60'
                          : isCustomerTarget
                          ? 'bg-[#121c15] border-emerald-800/80'
                          : 'bg-[#181322] border-[#31253a]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#f4addb] font-bold block mb-0.5">
                            QUESTION {item.number || idx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {item.question}
                          </h4>
                        </div>

                        {/* Talk script copy button */}
                        {isTalkScript && (
                          <button
                            onClick={() => handleCopyTalk(item.answer, idx)}
                            className="px-3 py-1 bg-white hover:bg-slate-200 text-[#17121b] text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                            title="トークスクリプトをコピー"
                          >
                            {copiedTalkIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>コピー完了 ✳</span>
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

                      <div className="text-xs sm:text-sm text-[#f5eff5] leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 02: GAINS シート */}
          <div className="bg-[#14101c] border border-[#2d2236] rounded-3xl overflow-hidden shadow-xl">
            <button
              onClick={() => toggleSection('gains')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#1a1524] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#f4addb] font-bold">02</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>GAINS プロフィール</span>
                    <span className="text-[10px] font-mono tracking-wider text-[#9a89a0] uppercase border-l border-[#3a2d42] pl-2">
                      PROFILE MATRIX
                    </span>
                  </h3>
                  <p className="text-xs text-[#8e7e94]">
                    Goal・Accomplishments・Interests・Networks・Skills
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#f4addb] transition-transform duration-200 ${
                  openSections.gains ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.gains && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#251b2e] space-y-3">
                {/* G */}
                {gains.goal && (
                  <div className="p-4 rounded-2xl bg-[#191323] border border-[#372a42]">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">
                      G ─ GOAL（目標）
                    </span>
                    <p className="text-xs sm:text-sm text-[#f5eff5] leading-relaxed whitespace-pre-line">
                      {gains.goal}
                    </p>
                  </div>
                )}

                {/* A */}
                {gains.accomplishments && (
                  <div className="p-4 rounded-2xl bg-[#191323] border border-[#372a42]">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
                      A ─ ACCOMPLISHMENTS（実績）
                    </span>
                    <p className="text-xs sm:text-sm text-[#f5eff5] leading-relaxed whitespace-pre-line">
                      {gains.accomplishments}
                    </p>
                  </div>
                )}

                {/* I */}
                {gains.interests && (
                  <div className="p-4 rounded-2xl bg-[#191323] border border-[#372a42]">
                    <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block mb-1">
                      I ─ INTERESTS（興味・関心）
                    </span>
                    <p className="text-xs sm:text-sm text-[#f5eff5] leading-relaxed whitespace-pre-line">
                      {gains.interests}
                    </p>
                  </div>
                )}

                {/* N */}
                {gains.networks && (
                  <div className="p-4 rounded-2xl bg-[#191323] border border-[#372a42]">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                      N ─ NETWORKS（人脈）
                    </span>
                    <p className="text-xs sm:text-sm text-[#f5eff5] leading-relaxed whitespace-pre-line">
                      {gains.networks}
                    </p>
                  </div>
                )}

                {/* S */}
                {gains.skills && (
                  <div className="p-4 rounded-2xl bg-[#191323] border border-[#372a42]">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">
                      S ─ SKILLS（保有スキル）
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {gains.skillTags && gains.skillTags.length > 0 ? (
                        gains.skillTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 text-xs bg-[#241a33] text-[#dec5dc] rounded-lg border border-[#3c2b4e]"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-[#f5eff5] leading-relaxed">
                          {gains.skills}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 03: 協業希望パートナー ＆ コンタクトサークル */}
          <div className="bg-[#14101c] border border-[#2d2236] rounded-3xl overflow-hidden shadow-xl">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#1a1524] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#f4addb] font-bold">03</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>協業パートナー ＆ コンタクトサークル</span>
                    <span className="text-[10px] font-mono tracking-wider text-[#9a89a0] uppercase border-l border-[#3a2d42] pl-2">
                      COLLABORATION
                    </span>
                  </h3>
                  <p className="text-xs text-[#8e7e94]">
                    Top3協業希望・コンタクトサークル10業種
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#f4addb] transition-transform duration-200 ${
                  openSections.contact ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.contact && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#251b2e] space-y-4">
                {contactCircle.top3 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#251733] to-[#1c1228] border border-[#523369]">
                    <span className="text-[10px] font-mono text-[#f4addb] font-bold block mb-1">
                      TOP 3 協業希望パートナー
                    </span>
                    <p className="text-xs sm:text-sm text-white font-semibold leading-relaxed">
                      {contactCircle.top3}
                    </p>
                  </div>
                )}

                {contactCircle.list.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#dec5dc] block mb-2">
                      コンタクトサークル（協業業種リスト）
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {contactCircle.list.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#1a1424] border border-[#30233b] text-xs text-[#dec5dc] flex items-center gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-md bg-[#2b1e3b] text-[#f4addb] font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {item.index}
                          </span>
                          <span className="leading-snug">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 04: 顧客層 ＆ リファーラル指針 */}
          <div className="bg-[#14101c] border border-[#2d2236] rounded-3xl overflow-hidden shadow-xl">
            <button
              onClick={() => toggleSection('customers')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#1a1524] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#f4addb] font-bold">04</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>顧客実績 ＆ リファーラル指針</span>
                    <span className="text-[10px] font-mono tracking-wider text-[#9a89a0] uppercase border-l border-[#3a2d42] pl-2">
                      CLIENTS & POLICY
                    </span>
                  </h3>
                  <p className="text-xs text-[#8e7e94]">
                    直近10件の顧客層・質の高いリファーラル・ご遠慮案件
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#f4addb] transition-transform duration-200 ${
                  openSections.customers ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.customers && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#251b2e] space-y-4">
                {/* Referrals dos & donts */}
                {customerList.aboutReferrals.map((r, i) => {
                  const isHighQuality = r.label.includes('質の高い');
                  const isAvoid = r.label.includes('不適切');

                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border ${
                        isHighQuality
                          ? 'bg-[#121c15] border-emerald-800/80 text-[#d6ede0]'
                          : isAvoid
                          ? 'bg-[#221317] border-rose-900/70 text-[#f5d0d6]'
                          : 'bg-[#181322] border-[#31253a] text-[#dec5dc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 font-bold text-xs sm:text-sm text-white">
                        {isHighQuality && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isAvoid && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                        <span>{r.label}</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {r.value}
                      </p>
                    </div>
                  );
                })}

                {/* Recent customers */}
                {customerList.recentCustomers.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-bold text-[#dec5dc] block mb-2">
                      直近10件の顧客層（紹介実績）
                    </span>
                    <div className="space-y-1.5">
                      {customerList.recentCustomers.map((c, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-[#191323] border border-[#30233b] text-xs text-[#dec5dc] flex items-center gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-md bg-[#2a1d3a] text-[#f4addb] font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {c.index}
                          </span>
                          <span className="leading-snug">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 05: ビジネス詳細 ＆ 人柄（MR） */}
          <div className="bg-[#14101c] border border-[#2d2236] rounded-3xl overflow-hidden shadow-xl">
            <button
              onClick={() => toggleSection('businessDetail')}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#1a1524] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#f4addb] font-bold">05</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>ビジネス詳細 ＆ 人柄（MR）</span>
                    <span className="text-[10px] font-mono tracking-wider text-[#9a89a0] uppercase border-l border-[#3a2d42] pl-2">
                      BACKGROUND
                    </span>
                  </h3>
                  <p className="text-xs text-[#8e7e94]">
                    所在地・経験年数・出身・趣味・成功の鍵
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#f4addb] transition-transform duration-200 ${
                  openSections.businessDetail ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.businessDetail && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#251b2e] space-y-4 text-xs">
                {/* Business MR */}
                <div className="space-y-2.5">
                  {mr.business.map((b, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#191323] border border-[#2e2238]">
                      <span className="font-mono text-[10px] text-[#f4addb] block mb-0.5">
                        {b.label}
                      </span>
                      <p className="text-[#f5eff5] leading-relaxed whitespace-pre-line">
                        {b.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Family & Personal */}
                <div className="space-y-2.5 pt-2">
                  {mr.family.map((f, i) => {
                    if (!f.value) return null;
                    return (
                      <div key={i} className="p-3 rounded-xl bg-[#191323] border border-[#2e2238]">
                        <span className="font-mono text-[10px] text-[#f4addb] block mb-0.5">
                          {f.label}
                        </span>
                        <p className="text-[#f5eff5] leading-relaxed whitespace-pre-line">
                          {f.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Others (Desire, secret, success key) */}
                <div className="space-y-2.5 pt-2">
                  {mr.others.map((o, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#20172e] border border-[#412e52]">
                      <span className="font-mono text-[10px] text-[#f4addb] font-bold block mb-0.5">
                        {o.label}
                      </span>
                      <p className="text-[#f5eff5] leading-relaxed whitespace-pre-line">
                        {o.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 pb-4 text-center text-xs text-[#786980] space-y-2">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onOpenSlideModal}
              className="text-[#f4addb] hover:underline font-medium"
            >
              スライド型PDFを保存・印刷 ↗
            </button>
            <span>·</span>
            <button
              onClick={onOpenQrModal}
              className="text-[#f4addb] hover:underline font-medium"
            >
              QRコードで共有 ↗
            </button>
          </div>
          <p className="text-[11px]">
            Generated via reframe. · スマートフォン最適化名刺＆1to1プロフィール
          </p>
        </div>
      </main>

      {/* Floating Bottom Quick Dock (Pinned at thumb zone on smartphone screens) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#0e0c13]/90 backdrop-blur-md border-t border-[#291f31] z-30 flex items-center justify-between gap-2.5 shadow-2xl max-w-3xl mx-auto">
        <button
          onClick={onOpenSlideModal}
          className="flex-1 h-11 rounded-2xl bg-[#231a2e] hover:bg-[#30223e] border border-[#433152] text-[#f4addb] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-4 h-4 text-[#f4addb]" />
          <span>スライドPDF</span>
        </button>

        <button
          onClick={onOpenQrModal}
          className="flex-1 h-11 rounded-2xl bg-[#231a2e] hover:bg-[#30223e] border border-[#433152] text-[#f5eff5] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <QrCode className="w-4 h-4 text-[#f4addb]" />
          <span>QR・共有</span>
        </button>

        <a
          href={vcardUrl}
          download={`${memberInfo.name}.vcf`}
          className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#d946ef] to-[#a855f7] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#d946ef]/20 transition-transform active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>連絡先保存</span>
        </a>

        {businessInfo.phone && (
          <a
            href={`tel:${businessInfo.phone}`}
            className="w-11 h-11 rounded-2xl bg-white text-[#17121b] flex items-center justify-center shrink-0 shadow-lg active:scale-95 transition-transform"
            title="発信"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
