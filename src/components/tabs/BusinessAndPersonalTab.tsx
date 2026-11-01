import React from 'react';
import { Briefcase, Home, Sparkles, MapPin, Phone, Mail, Globe, Share2 } from 'lucide-react';
import type { MRSection, BusinessInfo } from '../../types/profile.ts';

interface BusinessAndPersonalTabProps {
  mr: MRSection;
  businessInfo: BusinessInfo;
}

export const BusinessAndPersonalTab: React.FC<BusinessAndPersonalTabProps> = ({
  mr,
  businessInfo,
}) => {
  return (
    <div className="space-y-4">
      {/* Contact & Business Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            ビジネス連絡先・所在地
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {businessInfo.company && (
            <div className="flex items-start gap-2">
              <span className="w-20 text-slate-400 shrink-0 font-medium">会社名</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {businessInfo.company}
              </span>
            </div>
          )}

          {businessInfo.title && (
            <div className="flex items-start gap-2">
              <span className="w-20 text-slate-400 shrink-0 font-medium">役職</span>
              <span className="text-slate-800 dark:text-slate-200">
                {businessInfo.title}
              </span>
            </div>
          )}

          {businessInfo.phone && (
            <div className="flex items-center gap-2">
              <span className="w-20 text-slate-400 shrink-0 font-medium">電話番号</span>
              <a
                href={`tel:${businessInfo.phone}`}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{businessInfo.phone}</span>
              </a>
            </div>
          )}

          {businessInfo.email && (
            <div className="flex items-center gap-2">
              <span className="w-20 text-slate-400 shrink-0 font-medium">メール</span>
              <a
                href={`mailto:${businessInfo.email}`}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{businessInfo.email}</span>
              </a>
            </div>
          )}

          {businessInfo.address && (
            <div className="flex items-start gap-2">
              <span className="w-20 text-slate-400 shrink-0 font-medium">住所</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  businessInfo.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-start gap-1 leading-snug"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {businessInfo.postalCode ? `〒${businessInfo.postalCode} ` : ''}
                  {businessInfo.address}
                </span>
              </a>
            </div>
          )}

          {businessInfo.website && (
            <div className="flex items-center gap-2 pt-1">
              <span className="w-20 text-slate-400 shrink-0 font-medium">Webサイト</span>
              <a
                href={businessInfo.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate font-medium"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{businessInfo.website.text || businessInfo.website.url}</span>
              </a>
            </div>
          )}

          {businessInfo.facebook && (
            <div className="flex items-center gap-2">
              <span className="w-20 text-slate-400 shrink-0 font-medium">Facebook</span>
              <a
                href={businessInfo.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate font-medium"
              >
                <Share2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{businessInfo.facebook.text || 'Facebookプロフィール'}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Business Details (MR) */}
      {mr.business && mr.business.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              ビジネスについて
            </h3>
          </div>
          <div className="space-y-3">
            {mr.business.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400">
                  {item.label}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal / Family */}
      {mr.family && mr.family.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              出身・プライベート・趣味
            </h3>
          </div>
          <div className="space-y-3">
            {mr.family.map((item, idx) => {
              if (!item.value) return null;
              return (
                <div key={idx} className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400">
                    {item.label}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Others (Strong desire, Secret, Success Key) */}
      {mr.others && mr.others.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              人柄・想い・成功の鍵
            </h3>
          </div>
          <div className="space-y-3">
            {mr.others.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
                  {item.label}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
