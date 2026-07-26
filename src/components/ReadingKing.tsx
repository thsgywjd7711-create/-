import React, { useState } from 'react';
import { Award, Crown, Trophy, Medal, Sparkles, Heart, Flame, Star, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingLog } from '../types';
import { WILDFLOWER_CHILDREN } from '../data/initialData';

interface ReadingKingProps {
  logs: ReadingLog[];
}

export const ReadingKing: React.FC<ReadingKingProps> = ({ logs }) => {
  const [filterMode, setFilterMode] = useState<'this-month' | 'all-time'>('this-month');

  // Filter logs by month if filterMode is 'this-month'
  const currentYearMonth = new Date().toISOString().substring(0, 7); // e.g. "2026-07"

  const relevantLogs = logs.filter((log) => {
    if (filterMode === 'this-month') {
      return log.date && log.date.startsWith(currentYearMonth);
    }
    return true;
  });

  // Calculate count per child
  const countMap: Record<string, number> = {};
  WILDFLOWER_CHILDREN.forEach((c) => {
    countMap[c.name] = 0;
  });

  relevantLogs.forEach((log) => {
    countMap[log.childName] = (countMap[log.childName] || 0) + 1;
  });

  // Sort children by count descending
  const sortedRankings = Object.entries(countMap)
    .map(([name, count]) => ({
      name,
      count,
      childInfo: WILDFLOWER_CHILDREN.find((c) => c.name === name),
    }))
    .sort((a, b) => b.count - a.count);

  const top1 = sortedRankings[0];
  const top2 = sortedRankings[1];
  const top3 = sortedRankings[2];

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6'],
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Event Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
              <Crown className="w-4 h-4 text-yellow-300" />
              들꽃향기반 특별 이벤트
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2">
              🏆 이달의 독서왕 명예의 전당
            </h2>
            <p className="text-amber-100 text-sm max-w-xl leading-relaxed">
              책을 사랑하고 지혜를 넓혀가는 우리 들꽃향기반 어린이를 축하해 주세요!
              매달 가장 많은 책을 읽은 자랑스러운 독서왕입니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCelebrate}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-amber-900 font-bold text-sm shadow-lg hover:bg-amber-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PartyPopper className="w-5 h-5 text-amber-600 animate-bounce" />
              <span>축하 꽃가루 폭죽 터뜨리기!</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Filter: This Month vs All Time */}
      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl border border-amber-200 shadow-sm inline-flex gap-1">
          <button
            onClick={() => setFilterMode('this-month')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'this-month'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-amber-800'
            }`}
          >
            🗓️ 이번 달 ({new Date().getMonth() + 1}월) 독서왕
          </button>
          <button
            onClick={() => setFilterMode('all-time')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all-time'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-amber-800'
            }`}
          >
            ⭐ 누적 통산 독서왕
          </button>
        </div>
      </div>

      {/* TOP 3 Podium Section */}
      <div className="bg-gradient-to-b from-amber-50/80 to-orange-50/50 rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-md space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            HONOR ROLL TOP 3
          </span>
          <h3 className="text-2xl font-extrabold text-gray-900">
            자랑스러운 TOP 3 독서 주인공 👑
          </h3>
        </div>

        {/* Podium Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-4">
          {/* 2nd Place */}
          {top2 && (
            <div className="order-2 sm:order-1 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md text-center space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-slate-300">
                <Medal className="w-3.5 h-3.5 text-slate-600" /> 2위 (은빛 왕관)
              </div>
              <div className="pt-2 text-5xl">{top2.childInfo?.avatarEmoji || '👦🏻'}</div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{top2.name}</h4>
                <p className="text-xs text-slate-600 font-semibold">{top2.childInfo?.badge}</p>
              </div>
              <div className="bg-slate-50 py-2.5 px-4 rounded-2xl border border-slate-200">
                <p className="text-2xl font-extrabold text-slate-800">{top2.count} 권</p>
                <p className="text-[11px] text-slate-500">독서 기록 수완</p>
              </div>
              <p className="text-[11px] text-slate-600 font-medium italic">
                "매일 새로운 책을 탐험해요! 🥈"
              </p>
            </div>
          )}

          {/* 1st Place (Center Big) */}
          {top1 && (
            <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-100 via-amber-50 to-white rounded-3xl p-8 border-4 border-amber-400 shadow-xl text-center space-y-4 relative hover:-translate-y-2 transition-transform transform scale-105">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-md border border-amber-300">
                <Crown className="w-4 h-4 text-yellow-200 animate-pulse" /> 1위 이달의 독서왕!
              </div>
              <div className="pt-2 text-6xl relative inline-block">
                {top1.childInfo?.avatarEmoji || '👧🏻'}
                <span className="absolute -top-3 -right-2 text-2xl">✨</span>
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-gray-900">{top1.name}</h4>
                <p className="text-xs text-amber-800 font-bold bg-amber-200/60 px-3 py-0.5 rounded-full inline-block mt-1">
                  {top1.childInfo?.badge || '지혜의 왕관'}
                </p>
              </div>
              <div className="bg-amber-500 text-white py-3 px-5 rounded-2xl shadow-md border border-amber-600">
                <p className="text-3xl font-black">{top1.count} 권</p>
                <p className="text-xs text-amber-100">최고 독서왕 등극 🎉</p>
              </div>
              <p className="text-xs text-amber-900 font-bold italic">
                "책 속에 세상의 비밀이 가득해요! 🥇"
              </p>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="order-3 sm:order-3 bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md text-center space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-amber-300">
                <Trophy className="w-3.5 h-3.5 text-amber-700" /> 3위 (동빛 왕관)
              </div>
              <div className="pt-2 text-5xl">{top3.childInfo?.avatarEmoji || '👦🏽'}</div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{top3.name}</h4>
                <p className="text-xs text-amber-700 font-semibold">{top3.childInfo?.badge}</p>
              </div>
              <div className="bg-amber-50 py-2.5 px-4 rounded-2xl border border-amber-200">
                <p className="text-2xl font-extrabold text-amber-800">{top3.count} 권</p>
                <p className="text-[11px] text-amber-600">독서 기록 수완</p>
              </div>
              <p className="text-[11px] text-amber-700 font-medium italic">
                "생각의 싹이 쑥쑥 자라요! 🥉"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard Table & Encouragement Badges */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              들꽃향기반 전체 어린이 독서 순위
            </h3>
            <p className="text-xs text-gray-500">
              우리 모든 원아가 서로를 응원하며 차근차근 책을 읽고 있어요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedRankings.map((item, index) => {
            const isTop3 = index < 3;
            return (
              <div
                key={item.name}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  index === 0
                    ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                    : index === 1
                    ? 'bg-slate-50 border-slate-200'
                    : index === 2
                    ? 'bg-orange-50/60 border-orange-200'
                    : 'bg-gray-50/60 border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      index === 0
                        ? 'bg-amber-500 text-white shadow-xs'
                        : index === 1
                        ? 'bg-slate-400 text-white'
                        : index === 2
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="text-2xl">{item.childInfo?.avatarEmoji || '👦'}</div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                      {isTop3 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                          {index === 0 ? '🏆 독서왕' : index === 1 ? '🥈 2위' : '🥉 3위'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.childInfo?.badge || '들꽃향기 원아'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-emerald-800">{item.count} 권</p>
                  <p className="text-[10px] text-gray-400">누적 독서 기록</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
