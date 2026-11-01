import React from 'react';
import { Users, CheckCircle2, AlertTriangle, Building2, HelpCircle } from 'lucide-react';
import type { ContactCircleSection, CustomerListSection } from '../../types/profile.ts';

interface ReferralAndContactTabProps {
  contactCircle: ContactCircleSection;
  customerList: CustomerListSection;
}

export const ReferralAndContactTab: React.FC<ReferralAndContactTabProps> = ({
  contactCircle,
  customerList,
}) => {
  return (
    <div className="space-y-4">
      {/* Top 3 Collaboration Partners */}
      {contactCircle.top3 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 p-4 rounded-3xl border border-indigo-200 dark:border-indigo-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white uppercase tracking-wider">
              TOP 3
            </span>
            <h3 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
              協業希望パートナー
            </h3>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {contactCircle.top3}
          </p>
        </div>
      )}

      {/* Referral Quality Section (Most important for networking!) */}
      {customerList.aboutReferrals && customerList.aboutReferrals.length > 0 && (
        <div className="space-y-3">
          {customerList.aboutReferrals.map((item, idx) => {
            const isHighQuality = item.label.includes('質の高い');
            const isInappropriate = item.label.includes('不適切');

            return (
              <div
                key={idx}
                className={`p-4 rounded-3xl border ${
                  isHighQuality
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80'
                    : isInappropriate
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                } shadow-2xs`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isHighQuality && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isInappropriate && (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  )}
                  {!isHighQuality && !isInappropriate && (
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Circle List */}
      {contactCircle.list && contactCircle.list.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              コンタクトサークル（協業業種リスト）
            </h3>
          </div>
          <div className="space-y-1.5">
            {contactCircle.list.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {item.index}
                </span>
                <span className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Customers List */}
      {customerList.recentCustomers && customerList.recentCustomers.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              直近10件の顧客層・紹介実績
            </h3>
          </div>
          <div className="space-y-1.5">
            {customerList.recentCustomers.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {item.index}
                </span>
                <span className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Customers details */}
      {customerList.aboutCustomers && customerList.aboutCustomers.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            顧客について
          </h3>
          <div className="space-y-3">
            {customerList.aboutCustomers.map((item, idx) => (
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
    </div>
  );
};
