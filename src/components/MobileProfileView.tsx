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
} from 'lucide-react';
import type { ParsedProfile } from '../types/profile.ts';
import { DigitalBusinessCard } from './DigitalBusinessCard.tsx';
import { OneToOneTab } from './tabs/OneToOneTab.tsx';
import { GainsTab } from './tabs/GainsTab.tsx';
import { BusinessAndPersonalTab } from './tabs/BusinessAndPersonalTab.tsx';
import { ReferralAndContactTab } from './tabs/ReferralAndContactTab.tsx';

interface MobileProfileViewProps {
  profile: ParsedProfile;
  onOpenQrModal: () => void;
  onOpenImageModal: (url: string, title: string) => void;
  isSimulator?: boolean;
}

type TabType = 'one_to_one' | 'gains' | 'business' | 'referral';

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  profile,
  onOpenQrModal,
  onOpenImageModal,
  isSimulator = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('one_to_one');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { memberInfo, businessInfo, gains, mr, oneToOne, contactCircle, customerList } =
    profile;

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

  // Search filter
  const q = searchQuery.toLowerCase().trim();
  const searchResults: Array<{ section: string; title: string; text: string }> = [];

  if (q) {
    oneToOne.forEach((item) => {
      if (item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)) {
        searchResults.push({
          section: '1to1シート',
          title: item.question,
          text: item.answer,
        });
      }
    });

    if (gains.skills.toLowerCase().includes(q)) {
      searchResults.push({
        section: 'GAINS - 保有スキル',
        title: 'スキル',
        text: gains.skills,
      });
    }
    if (gains.goal.toLowerCase().includes(q)) {
      searchResults.push({
        section: 'GAINS - 目標',
        title: 'Goal',
        text: gains.goal,
      });
    }
    if (gains.networks.toLowerCase().includes(q)) {
      searchResults.push({
        section: 'GAINS - 人脈',
        title: 'Networks',
        text: gains.networks,
      });
    }

    contactCircle.list.forEach((item) => {
      if (item.name.toLowerCase().includes(q)) {
        searchResults.push({
          section: 'コンタクトサークル',
          title: `協業業種 #${item.index}`,
          text: item.name,
        });
      }
    });

    customerList.recentCustomers.forEach((item) => {
      if (item.name.toLowerCase().includes(q)) {
        searchResults.push({
          section: '顧客層・実績',
          title: `顧客実績 #${item.index}`,
          text: item.name,
        });
      }
    });

    mr.others.forEach((item) => {
      if (item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)) {
        searchResults.push({
          section: '人柄・成功の鍵',
          title: item.label,
          text: item.value,
        });
      }
    });
  }

  return (
    <div className={`w-full bg-slate-50 dark:bg-slate-950 min-h-full pb-28 text-slate-900 dark:text-slate-100 font-sans`}>
      {/* Top Hero Section */}
      <div className="relative bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-indigo-200 uppercase">
              BNI Member Card
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearching(!isSearching)}
              className="p-2 text-indigo-200 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="キーワード検索"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenQrModal}
              className="p-2 text-indigo-200 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
              title="QRコード・共有"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar Input (toggled) */}
        {isSearching && (
          <div className="relative mb-4 z-10 animate-in fade-in duration-150">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードで検索 (例: 音楽, Web, 広告, クリニック)..."
              className="w-full h-10 pl-9 pr-8 text-xs bg-white/15 backdrop-blur-md rounded-xl text-white placeholder-indigo-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              autoFocus
            />
            <Search className="w-4 h-4 text-indigo-200 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 p-1 text-indigo-200 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Member Profile Avatar & Main Info */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar with Ring */}
          <div className="relative mb-3 group">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-400 shadow-xl">
              {profile.photoUrl ? (
                <img
                  src={getProxiedImage(profile.photoUrl)}
                  alt={memberInfo.name}
                  onClick={() =>
                    onOpenImageModal(profile.photoUrl!, `${memberInfo.name} 様 プロフィール写真`)
                  }
                  className="w-full h-full object-cover rounded-full cursor-pointer hover:opacity-95 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = profile.photoUrl!;
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
                  {memberInfo.name.slice(0, 2)}
                </div>
              )}
            </div>

            {profile.photoUrl && (
              <button
                onClick={() =>
                  onOpenImageModal(profile.photoUrl!, `${memberInfo.name} 様 プロフィール写真`)
                }
                className="absolute bottom-0 right-0 p-1.5 bg-slate-900 border border-slate-700 text-white rounded-full shadow-md text-[10px]"
                title="拡大表示"
              >
                <Search className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Furigana */}
          {memberInfo.furigana && (
            <span className="text-[11px] text-indigo-200 tracking-wider">
              {memberInfo.furigana}
            </span>
          )}

          {/* Full Name */}
          <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
            {memberInfo.name}
          </h1>

          {/* Romaji */}
          {memberInfo.romaji && (
            <span className="text-[10px] font-semibold text-indigo-300/80 tracking-widest uppercase mt-0.5">
              {memberInfo.romaji}
            </span>
          )}

          {/* Company & Title */}
          <div className="mt-2 text-sm font-semibold text-slate-100 flex items-center justify-center gap-1.5 flex-wrap">
            <span>{businessInfo.company}</span>
            {businessInfo.title && (
              <>
                <span className="text-indigo-400">/</span>
                <span className="text-indigo-200 font-normal">{businessInfo.title}</span>
              </>
            )}
          </div>

          {/* Category Tag */}
          {memberInfo.category && (
            <div className="mt-2.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 max-w-[95%]">
              <span className="text-xs font-medium text-indigo-100 line-clamp-1">
                {memberInfo.category}
              </span>
            </div>
          )}

          {/* Category English if available */}
          {memberInfo.categoryEn && (
            <span className="text-[10px] text-indigo-300/70 mt-1 max-w-[90%] truncate">
              {memberInfo.categoryEn}
            </span>
          )}

          {/* Membership metadata */}
          {(memberInfo.joinedDate || memberInfo.role) && (
            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-indigo-200/90 flex-wrap">
              {memberInfo.role && (
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-medium">
                  {memberInfo.role}
                </span>
              )}
              {memberInfo.joinedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  <span>入会: {memberInfo.joinedDate}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons (Thumb zone natural reach) */}
      <div className="px-4 -mt-5 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-lg border border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2 text-center">
          {/* Call button */}
          {businessInfo.phone ? (
            <a
              href={`tel:${businessInfo.phone}`}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition-colors active:scale-95 min-h-[58px]"
            >
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-bold">電話</span>
            </a>
          ) : (
            <div className="opacity-40 flex flex-col items-center justify-center p-2 min-h-[58px]">
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-[11px]">電話</span>
            </div>
          )}

          {/* Email button */}
          {businessInfo.email ? (
            <a
              href={`mailto:${businessInfo.email}?subject=BNIのご縁にて`}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 transition-colors active:scale-95 min-h-[58px]"
            >
              <Mail className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-bold">メール</span>
            </a>
          ) : (
            <div className="opacity-40 flex flex-col items-center justify-center p-2 min-h-[58px]">
              <Mail className="w-5 h-5 mb-1" />
              <span className="text-[11px]">メール</span>
            </div>
          )}

          {/* Website / Maps button */}
          {businessInfo.website ? (
            <a
              href={businessInfo.website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 transition-colors active:scale-95 min-h-[58px]"
            >
              <Globe className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-bold">WEB</span>
            </a>
          ) : businessInfo.address ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                businessInfo.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors active:scale-95 min-h-[58px]"
            >
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-bold">マップ</span>
            </a>
          ) : (
            <div className="opacity-40 flex flex-col items-center justify-center p-2 min-h-[58px]">
              <Globe className="w-5 h-5 mb-1" />
              <span className="text-[11px]">WEB</span>
            </div>
          )}

          {/* Save to contacts (vCard) */}
          <a
            href={vcardUrl}
            download={`${memberInfo.name}.vcf`}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 transition-colors active:scale-95 min-h-[58px]"
          >
            <Download className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-bold">連絡先保存</span>
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-4 mt-4 space-y-4">
        {/* Search Results Display if active */}
        {searchQuery && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                「{searchQuery}」の検索結果 ({searchResults.length}件)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                クリア
              </button>
            </div>

            {searchResults.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                該当する情報が見つかりませんでした
              </p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((res, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {res.section}
                    </span>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {res.title}
                    </h5>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-3">
                      {res.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Digital Business Card (Front & Back) */}
        {(profile.meishiOmoteUrl || profile.meishiUraUrl) && (
          <DigitalBusinessCard
            omoteUrl={profile.meishiOmoteUrl}
            uraUrl={profile.meishiUraUrl}
            memberName={memberInfo.name}
            companyName={businessInfo.company}
            onOpenImageModal={onOpenImageModal}
          />
        )}

        {/* Segmented Navigation Tab Controls */}
        <div className="p-1 bg-slate-200/80 dark:bg-slate-900 rounded-2xl grid grid-cols-4 gap-1 text-center shadow-inner">
          <button
            onClick={() => setActiveTab('one_to_one')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'one_to_one'
                ? 'bg-white dark:bg-indigo-600 text-indigo-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[11px] leading-tight">1to1シート</span>
          </button>

          <button
            onClick={() => setActiveTab('gains')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'gains'
                ? 'bg-white dark:bg-indigo-600 text-indigo-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] leading-tight">GAINS</span>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'business'
                ? 'bg-white dark:bg-indigo-600 text-indigo-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span className="text-[11px] leading-tight">基本・経歴</span>
          </button>

          <button
            onClick={() => setActiveTab('referral')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'referral'
                ? 'bg-white dark:bg-indigo-600 text-indigo-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[11px] leading-tight">協業・紹介</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-1">
          {activeTab === 'one_to_one' && (
            <OneToOneTab items={oneToOne} memberName={memberInfo.name} />
          )}

          {activeTab === 'gains' && <GainsTab gains={gains} />}

          {activeTab === 'business' && (
            <BusinessAndPersonalTab mr={mr} businessInfo={businessInfo} />
          )}

          {activeTab === 'referral' && (
            <ReferralAndContactTab
              contactCircle={contactCircle}
              customerList={customerList}
            />
          )}
        </div>
      </div>

      {/* Floating Bottom Quick Dock (Thumb Zone anchor) */}
      <div
        className={`${
          isSimulator ? 'absolute' : 'fixed'
        } bottom-0 left-0 right-0 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 flex items-center justify-between gap-3 shadow-lg`}
      >
        <button
          onClick={onOpenQrModal}
          className="flex-1 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <QrCode className="w-4 h-4" />
          <span>QR・共有</span>
        </button>

        <a
          href={vcardUrl}
          download={`${memberInfo.name}.vcf`}
          className="flex-1 h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>連絡先追加</span>
        </a>

        {businessInfo.phone && (
          <a
            href={`tel:${businessInfo.phone}`}
            className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
            title="電話をかける"
          >
            <Phone className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
};
