import React, { useState } from 'react';
import {
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Target,
  Users,
  Award,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileDown,
} from 'lucide-react';
import type { ParsedProfile } from '../types/profile.ts';

interface PresentationSlideDeckProps {
  profile: ParsedProfile;
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl?: string;
}

export const PresentationSlideDeck: React.FC<PresentationSlideDeckProps> = ({
  profile,
  isOpen,
  onClose,
  qrCodeUrl,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

  if (!isOpen) return null;

  const { memberInfo, businessInfo, gains, mr, oneToOne, contactCircle, customerList } = profile;

  const handlePrint = () => {
    window.print();
  };

  const getProxied = (url?: string) =>
    url ? `/api/proxy-image?url=${encodeURIComponent(url)}` : '';

  // Extract key 1to1 answers safely
  const get1to1 = (idx: number) => oneToOne[idx]?.answer || '';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0a0d] text-[#f5eff5] overflow-y-auto print:overflow-visible">
      {/* Top Controls Bar (Hidden during printing) */}
      <div className="no-print sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#120f18]/90 backdrop-blur-md border-b border-[#2d2434]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-widest text-[#f4addb] uppercase flex items-center gap-1.5">
            <span className="text-base leading-none">✳</span>
            <span>PRESENTATION SLIDES</span>
          </span>
          <span className="text-xs text-[#9a89a0] hidden sm:inline">
            1to1ミーティング＆プレゼン用スライド (全{totalSlides}スライド)
          </span>
        </div>

        {/* Slide navigation & print CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-[#1d1726] border border-[#3b2e45] rounded-xl px-2 py-1 text-xs">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="p-1 text-[#dec5dc] hover:text-white disabled:opacity-30 transition-colors"
              title="前のスライド"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[#f4addb]">
              {currentSlide + 1} / {totalSlides}
            </span>
            <button
              onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
              disabled={currentSlide === totalSlides - 1}
              className="p-1 text-[#dec5dc] hover:text-white disabled:opacity-30 transition-colors"
              title="次のスライド"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#d946ef] to-[#a855f7] hover:from-[#ec4899] hover:to-[#9333ea] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#d946ef]/20 active:scale-95"
            title="ブラウザ印刷からPDFとして保存できます"
          >
            <Printer className="w-4 h-4" />
            <span>PDF保存 / 印刷 (Landscape)</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-[#9a89a0] hover:text-white rounded-xl hover:bg-[#231b2e] transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Deck Container */}
      <div className="presentation-slide-deck flex-1 flex flex-col items-center justify-start p-4 sm:p-8 space-y-8 print:p-0 print:space-y-0">
        {/* =========================================================
            SLIDE 1: COVER SLIDE
            ========================================================= */}
        <div className="presentation-slide w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-[#120e17] via-[#16121f] to-[#0c0a0e] border border-[#312538] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#d946ef]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Bar */}
          <div className="flex items-center justify-between border-b border-[#2d2235] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                reframe<span className="text-[#f4addb]">.</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#9a89a0] uppercase border-l border-[#3a2d42] pl-2 ml-1">
                1to1 PRESENTATION DECK
              </span>
            </div>
            <div className="text-[11px] text-[#dec5dc] font-mono">
              SLIDE 01 / 06
            </div>
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-12 gap-8 items-center my-auto">
            {/* Left Photo & QR */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#f4addb] via-[#d946ef] to-[#8b5cf6] shadow-xl">
                  {profile.photoUrl ? (
                    <img
                      src={getProxied(profile.photoUrl)}
                      alt={memberInfo.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#20182a] flex items-center justify-center text-3xl font-bold text-white">
                      {memberInfo.name.slice(0, 2)}
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code small preview */}
              {qrCodeUrl && (
                <div className="mt-2 p-1.5 bg-white rounded-xl shadow-md inline-block">
                  <img src={qrCodeUrl} alt="QR" className="w-16 h-16 object-contain" />
                  <span className="block text-[8px] font-mono text-slate-900 mt-0.5">
                    スマホで確認
                  </span>
                </div>
              )}
            </div>

            {/* Right Details */}
            <div className="col-span-8 space-y-3">
              <div className="space-y-0.5">
                <span className="text-xs font-mono tracking-widest text-[#f4addb] uppercase">
                  {memberInfo.romaji || 'BNI MEMBER'}
                </span>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {memberInfo.name}
                  </h1>
                  {memberInfo.furigana && (
                    <span className="text-sm text-[#dec5dc]">
                      （{memberInfo.furigana}）
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xl font-bold text-[#f4addb] flex items-center gap-2">
                <span>{businessInfo.company}</span>
                {businessInfo.title && (
                  <>
                    <span className="text-[#6d5b74]">/</span>
                    <span className="text-white font-medium">{businessInfo.title}</span>
                  </>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-[#1d1627] border border-[#3b2e45] text-xs text-[#dec5dc] leading-relaxed">
                <div className="font-semibold text-white mb-0.5">専門カテゴリー</div>
                <div>{memberInfo.category}</div>
                {memberInfo.categoryEn && (
                  <div className="text-[10px] text-[#9a89a0] mt-0.5">{memberInfo.categoryEn}</div>
                )}
              </div>

              {/* Contact Icons */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-[#dec5dc]">
                {businessInfo.phone && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-[#f4addb] shrink-0" />
                    <span>{businessInfo.phone}</span>
                  </div>
                )}
                {businessInfo.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#f4addb] shrink-0" />
                    <span className="truncate">{businessInfo.email}</span>
                  </div>
                )}
                {businessInfo.website && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3.5 h-3.5 text-[#f4addb] shrink-0" />
                    <span className="truncate">{businessInfo.website.text || businessInfo.website.url}</span>
                  </div>
                )}
                {businessInfo.address && (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#f4addb] shrink-0" />
                    <span className="truncate">{businessInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-center justify-between border-t border-[#2d2235] pt-3 text-[10px] text-[#786980]">
            <span>BNI 1to1 ミーティングシート＆プロフィール</span>
            <span>Produced with reframe.</span>
          </div>
        </div>

        {/* =========================================================
            SLIDE 2: 1to1 SHEET & CORE STRENGTHS
            ========================================================= */}
        <div className="presentation-slide w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-[#120e17] via-[#16121f] to-[#0c0a0e] border border-[#312538] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2d2235] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#f4addb] uppercase">
                1 to 1 MEETING DECK ─ 02 / STRENGTHS & EXPERTISE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                専門分野と他社にない強み
              </h2>
            </div>
            <div className="text-[11px] text-[#dec5dc] font-mono">
              SLIDE 02 / 06
            </div>
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-2 gap-5 my-auto">
            {/* Question 3: 専門分野 */}
            <div className="p-5 rounded-2xl bg-[#1a1424] border border-[#372b42] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#f4addb]">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    3. 専門分野
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#f5eff5] leading-relaxed whitespace-pre-line">
                  {get1to1(2) || '企業の売れない・伝わらない・集客できないをワンストップで解決。'}
                </p>
              </div>
            </div>

            {/* Question 4: 他社にない強み */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1d162a] to-[#251a36] border border-[#4d365e] flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#f4addb]">
                  <Sparkles className="w-4 h-4 text-[#f4addb]" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    4. 他社にない独自の強み
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#f5eff5] leading-relaxed whitespace-pre-line">
                  {get1to1(3) || '戦略と制作の両方を横断し、数字と感情の両方を動かす。'}
                </p>
              </div>
            </div>

            {/* Question 1: 名前とプライベート情報 (Full Width) */}
            <div className="col-span-2 p-4 rounded-2xl bg-[#15101e] border border-[#2e2336]">
              <div className="text-[11px] font-bold text-[#dec5dc] mb-1">
                1. 人物像・背景ストーリー
              </div>
              <p className="text-xs text-[#b8a7be] leading-relaxed whitespace-pre-line line-clamp-3">
                {get1to1(0)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#2d2235] pt-3 text-[10px] text-[#786980]">
            <span>{memberInfo.name}（{businessInfo.company}）</span>
            <span>reframe. 1to1 Slide Deck</span>
          </div>
        </div>

        {/* =========================================================
            SLIDE 3: IDEAL REFERRAL & TALK SCRIPT (MOST CRITICAL FOR BNI)
            ========================================================= */}
        <div className="presentation-slide w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-[#120e17] via-[#16121f] to-[#0c0a0e] border border-[#312538] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2d2235] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#f4addb] uppercase">
                1 to 1 MEETING DECK ─ 03 / REFERRAL STRATEGY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                理想のお客様 ＆ 紹介の切り出しトーク
              </h2>
            </div>
            <div className="text-[11px] text-[#dec5dc] font-mono">
              SLIDE 03 / 06
            </div>
          </div>

          {/* 2-Column Split: Ideal Target vs Talk Script */}
          <div className="grid grid-cols-2 gap-5 my-auto">
            {/* Left: 理想のお客様 */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#171c19] to-[#121815] border border-emerald-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    5. こんな人・企業をご紹介ください
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] text-[#e2f0e6] leading-relaxed whitespace-pre-line">
                  {get1to1(4) || '売上や集客を伸ばしたいが、何から手をつけるべきかわからない経営者様。'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-900/40 text-[10px] text-emerald-400/80">
                ✓ 課題を抱える中小企業経営者様へのご紹介
              </div>
            </div>

            {/* Right: 切り出しトーク */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a162b] to-[#141224] border border-[#d946ef]/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#f4addb]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    6. 紹介の切り出しトーク
                  </span>
                </div>
                <div className="p-3 bg-[#0d0a14] rounded-xl border border-[#3b2d47] text-xs sm:text-[13px] text-[#f5eff5] leading-relaxed whitespace-pre-line font-medium">
                  {get1to1(5) || '「売上や集客のことで困っているなら、一度横山さんに相談してみたら？」'}
                </div>
              </div>
              <div className="mt-3 text-[10px] text-[#d8b4fe]">
                💡 このフレーズをそのままお使いいただくだけで、スムーズにご紹介いただけます。
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#2d2235] pt-3 text-[10px] text-[#786980]">
            <span>{memberInfo.name}（{businessInfo.company}）</span>
            <span>reframe. 1to1 Slide Deck</span>
          </div>
        </div>

        {/* =========================================================
            SLIDE 4: GAINS PROFILE
            ========================================================= */}
        <div className="presentation-slide w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-[#120e17] via-[#16121f] to-[#0c0a0e] border border-[#312538] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2d2235] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#f4addb] uppercase">
                1 to 1 MEETING DECK ─ 04 / GAINS PROFILE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                GAINS シート（目標・実績・興味・人脈・スキル）
              </h2>
            </div>
            <div className="text-[11px] text-[#dec5dc] font-mono">
              SLIDE 04 / 06
            </div>
          </div>

          {/* 5 Row / Card Grid */}
          <div className="grid grid-cols-2 gap-4 my-auto">
            <div className="p-3.5 rounded-xl bg-[#191323] border border-[#372a42]">
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">
                G ─ GOAL（目標）
              </span>
              <p className="text-xs text-[#f5eff5] leading-relaxed line-clamp-3">
                {gains.goal || '事業拡大と中小企業支援基盤の確立。'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#191323] border border-[#372a42]">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
                A ─ ACCOMPLISHMENTS（実績）
              </span>
              <p className="text-xs text-[#f5eff5] leading-relaxed line-clamp-3">
                {gains.accomplishments || '個人事業主から上場企業まで10年以上の支援実績。'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#191323] border border-[#372a42]">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block mb-1">
                I ─ INTERESTS（興味・関心）
              </span>
              <p className="text-xs text-[#f5eff5] leading-relaxed line-clamp-3">
                {gains.interests || '音楽、作曲、テクノロジー、新規事業、デザイン。'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#191323] border border-[#372a42]">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                N ─ NETWORKS（人脈）
              </span>
              <p className="text-xs text-[#f5eff5] leading-relaxed line-clamp-3">
                {gains.networks || '経営者、クリエイター、広告代理店、士業、メディア関係者。'}
              </p>
            </div>

            {/* Skills Tags */}
            <div className="col-span-2 p-3.5 rounded-xl bg-[#161120] border border-[#372a42]">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1.5">
                S ─ SKILLS（保有スキル）
              </span>
              <div className="flex flex-wrap gap-1.5">
                {gains.skillTags && gains.skillTags.length > 0 ? (
                  gains.skillTags.slice(0, 16).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 text-[11px] bg-[#241a33] text-[#dec5dc] rounded-md border border-[#3c2b4e]"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#dec5dc]">{gains.skills}</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#2d2235] pt-3 text-[10px] text-[#786980]">
            <span>{memberInfo.name}（{businessInfo.company}）</span>
            <span>reframe. 1to1 Slide Deck</span>
          </div>
        </div>

        {/* =========================================================
            SLIDE 5: COLLABORATION & CONTACT CIRCLE
            ========================================================= */}
        <div className="presentation-slide w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-[#120e17] via-[#16121f] to-[#0c0a0e] border border-[#312538] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2d2235] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#f4addb] uppercase">
                1 to 1 MEETING DECK ─ 05 / COLLABORATION & CUSTOMERS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                協業希望パートナー ＆ コンタクトサークル
              </h2>
            </div>
            <div className="text-[11px] text-[#dec5dc] font-mono">
              SLIDE 05 / 06
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 my-auto">
            {/* Left: Top 3 & Customers */}
            <div className="col-span-5 space-y-4">
              {contactCircle.top3 && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#251733] to-[#1d1229] border border-[#5a3673]">
                  <span className="text-[10px] font-black tracking-widest text-[#f4addb] uppercase block mb-1">
                    TOP 3 協業希望パートナー
                  </span>
                  <p className="text-xs sm:text-[13px] text-white font-semibold leading-relaxed">
                    {contactCircle.top3}
                  </p>
                </div>
              )}

              {customerList.recentCustomers && customerList.recentCustomers.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#181223] border border-[#362744]">
                  <span className="text-[10px] font-bold tracking-wider text-[#dec5dc] block mb-2">
                    直近の顧客層・紹介実績（一部）
                  </span>
                  <div className="space-y-1">
                    {customerList.recentCustomers.slice(0, 4).map((c, i) => (
                      <div key={i} className="text-xs text-[#dec5dc] flex items-center gap-1.5 truncate">
                        <span className="w-4 h-4 rounded-full bg-[#291c38] text-[9px] flex items-center justify-center text-[#f4addb] font-bold shrink-0">
                          {c.index}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Contact Circle 10 */}
            <div className="col-span-7 p-4 rounded-2xl bg-[#161121] border border-[#332442]">
              <span className="text-xs font-bold text-white block mb-2">
                コンタクトサークル（協業業種リスト）
              </span>
              <div className="grid grid-cols-2 gap-2">
                {contactCircle.list.slice(0, 10).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-lg bg-[#20172e] text-xs text-[#dec5dc] flex items-center gap-2 truncate"
                  >
                    <span className="w-4 h-4 rounded bg-[#332447] text-[10px] text-[#f4addb] font-bold flex items-center justify-center shrink-0">
                      {item.index}
                    </span>
                    <span className="truncate text-[11px]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#2d2235] pt-3 text-[10px] text-[#786980]">
            <span>{memberInfo.name}（{businessInfo.company}）</span>
            <span>reframe. 1to1 Slide Deck</span>
          </div>
        </div>

        {/* =========================================================
            SLIDE 6: REFERRAL ETIQUETTE & GUIDELINES
            ========================================================= */}
        <div className="presentation-slide w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-[#120e17] via-[#16121f] to-[#0c0a0e] border border-[#312538] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2d2235] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#f4addb] uppercase">
                1 to 1 MEETING DECK ─ 06 / REFERRAL POLICY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                リファーラル指針（質の高いリファーラル ＆ ご遠慮いただく案件）
              </h2>
            </div>
            <div className="text-[11px] text-[#dec5dc] font-mono">
              SLIDE 06 / 06
            </div>
          </div>

          {/* 2-Columns: Good vs Bad Referrals */}
          <div className="grid grid-cols-2 gap-5 my-auto">
            {/* Good */}
            <div className="p-5 rounded-2xl bg-[#121c15] border border-emerald-800/80">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="text-sm font-bold">
                  大歓迎の「質の高い」リファーラル
                </h3>
              </div>
              <p className="text-xs text-[#d2ecd7] leading-relaxed whitespace-pre-line">
                {customerList.aboutReferrals.find((r) => r.label.includes('質の高い'))?.value ||
                  '課題や目的が明確で、ご本人が相談を希望されている案件。予算の大小に関わらず、誠実に伴走いたします。'}
              </p>
            </div>

            {/* Avoid */}
            <div className="p-5 rounded-2xl bg-[#211417] border border-rose-900/60">
              <div className="flex items-center gap-2 mb-2 text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-sm font-bold">
                  ご遠慮いただきたい「不適切な」リファーラル
                </h3>
              </div>
              <p className="text-xs text-[#f5d0d6] leading-relaxed whitespace-pre-line">
                {customerList.aboutReferrals.find((r) => r.label.includes('不適切'))?.value ||
                  '本人の了承がない一方的な連絡先共有、成果保証や無償作業を前提としたご依頼は対応いたしかねます。'}
              </p>
            </div>
          </div>

          {/* Closing message */}
          <div className="p-4 rounded-2xl bg-[#191424] border border-[#3b2d47] text-center">
            <span className="text-xs font-bold text-white">
              「仕組みで数字を。共鳴で心を。」
            </span>
            <span className="text-xs text-[#dec5dc] ml-2">
              ─ お互いのビジネス発展に向けて、誠心誠意の1to1をよろしくお願いいたします。
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#2d2235] pt-3 text-[10px] text-[#786980]">
            <span>{memberInfo.name}（{businessInfo.company}）</span>
            <span>reframe. 1to1 Slide Deck</span>
          </div>
        </div>
      </div>
    </div>
  );
};
