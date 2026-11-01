import React from 'react';
import { Target, Trophy, Heart, Users, Wrench } from 'lucide-react';
import type { GainsSection } from '../../types/profile.ts';

interface GainsTabProps {
  gains: GainsSection;
}

export const GainsTab: React.FC<GainsTabProps> = ({ gains }) => {
  const cards = [
    {
      letter: 'G',
      title: 'Goal（目標）',
      subtitle: '事業目標・ビジョン',
      icon: <Target className="w-4 h-4 text-rose-500" />,
      content: gains.goal,
      border: 'border-rose-100 dark:border-rose-950/60',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    },
    {
      letter: 'A',
      title: 'Accomplishments（実績）',
      subtitle: '経験とこれまでの成果',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
      content: gains.accomplishments,
      border: 'border-amber-100 dark:border-amber-950/60',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    },
    {
      letter: 'I',
      title: 'Interests（興味・趣味）',
      subtitle: '関心事・情熱を注いでいること',
      icon: <Heart className="w-4 h-4 text-pink-500" />,
      content: gains.interests,
      border: 'border-pink-100 dark:border-pink-950/60',
      badge: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
    },
    {
      letter: 'N',
      title: 'Networks（人脈）',
      subtitle: 'つながりのある業界・専門職',
      icon: <Users className="w-4 h-4 text-blue-500" />,
      content: gains.networks,
      border: 'border-blue-100 dark:border-blue-950/60',
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
    {
      letter: 'S',
      title: 'Skills（保有スキル）',
      subtitle: '専門能力・強み',
      icon: <Wrench className="w-4 h-4 text-emerald-500" />,
      content: gains.skills,
      tags: gains.skillTags,
      border: 'border-emerald-100 dark:border-emerald-950/60',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Intro header */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
          GAINS プロフィール
        </h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400">
          目標、実績、興味、人脈、スキルを一覧で把握できます。
        </p>
      </div>

      {cards.map((card, idx) => {
        if (!card.content && (!card.tags || card.tags.length === 0)) return null;

        return (
          <div
            key={idx}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-4 border ${card.border} shadow-2xs`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${card.badge}`}>
                  {card.letter}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                    {card.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {card.subtitle}
                  </span>
                </div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                {card.icon}
              </div>
            </div>

            {/* If tags are available for Skills */}
            {card.tags && card.tags.length > 0 ? (
              <div className="space-y-2 mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {card.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
