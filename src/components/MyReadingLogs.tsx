import React, { useState } from 'react';
import { Search, Star, BookOpen, User, Calendar, Award, Sparkles, Filter, Printer } from 'lucide-react';
import { ReadingLog } from '../types';
import { WILDFLOWER_CHILDREN } from '../data/initialData';

interface MyReadingLogsProps {
  logs: ReadingLog[];
}

export const MyReadingLogs: React.FC<MyReadingLogsProps> = ({ logs }) => {
  const [selectedChild, setSelectedChild] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesChild = selectedChild === '전체' || log.childName === selectedChild;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      log.bookTitle.toLowerCase().includes(query) ||
      log.author.toLowerCase().includes(query) ||
      log.childName.toLowerCase().includes(query) ||
      log.summary.toLowerCase().includes(query) ||
      log.thoughts.toLowerCase().includes(query);

    return matchesChild && matchesSearch;
  });

  const getChildStats = (name: string) => {
    const childLogs = logs.filter((l) => l.childName === name);
    return childLogs.length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              들꽃향기반 개인별 책 보물창고
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              내가 읽은 상상 보물상자 📚✨
            </h2>
            <p className="text-teal-100 text-sm mt-1">
              이름을 선택하거나 도서명을 검색해서 나의 독서 추억을 모아보세요!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <p className="text-xs text-teal-100 font-medium">조회된 총 독서 기록</p>
              <p className="text-2xl font-bold text-white">{filteredLogs.length} 권</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Child Quick Select Buttons */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-md p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Child Select Dropdown or All */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> 원아 선택:
            </span>

            <button
              onClick={() => setSelectedChild('전체')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedChild === '전체'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              전체 보기 ({logs.length})
            </button>

            {WILDFLOWER_CHILDREN.map((child) => {
              const count = getChildStats(child.name);
              const isSelected = selectedChild === child.name;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.name)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50/60 text-emerald-900 border border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  <span>{child.avatarEmoji}</span>
                  <span>{child.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/30 text-white' : 'bg-emerald-200/60 text-emerald-800'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="도서명, 지은이, 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs bg-gray-50/50"
            />
          </div>
        </div>
      </div>

      {/* Selected Child Showcase Banner */}
      {selectedChild !== '전체' && (
        <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shadow-xs">
              {WILDFLOWER_CHILDREN.find((c) => c.name === selectedChild)?.avatarEmoji || '👶🏻'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">{selectedChild} 어린이의 책장</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-800">
                  {WILDFLOWER_CHILDREN.find((c) => c.name === selectedChild)?.badge || '독서가'}
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                지금까지 총 <strong className="text-amber-900 font-extrabold">{filteredLogs.length}권</strong>의 소중한 도서를 읽고 생각 스티커를 쌓았어요! 🌟
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4 text-amber-700" />
            <span>독서 카드 인쇄하기</span>
          </button>
        </div>
      )}

      {/* Reading Log Cards Grid */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl">
            📖
          </div>
          <h4 className="text-lg font-bold text-gray-800">등록된 독서기록이 없습니다</h4>
          <p className="text-xs text-gray-500">
            [독서기록 작성] 탭에서 책을 읽고 감상을 적어 첫 번째 기록을 남겨보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => {
            const childInfo = WILDFLOWER_CHILDREN.find((c) => c.name === log.childName);

            return (
              <div
                key={log.id}
                className="bg-white rounded-3xl border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Card Header Accent */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 border-b border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl">{childInfo?.avatarEmoji || '👦'}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{log.childName}</p>
                      <p className="text-[10px] text-emerald-700 font-medium">들꽃향기반 어린이</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center space-x-0.5 bg-white px-2.5 py-1 rounded-full border border-emerald-100 shadow-2xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= log.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Book Title & Meta */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5 line-clamp-1">
                        <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                        {log.bookTitle}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>저자: {log.author || '미상'}</span>
                        <span>•</span>
                        <span>출판사: {log.publisher || '미상'}</span>
                      </p>
                    </div>

                    {/* Summary */}
                    {log.summary && (
                      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-xs text-gray-700 space-y-1">
                        <p className="font-semibold text-gray-900 text-[11px]">📖 기억나는 이야기:</p>
                        <p className="leading-relaxed text-gray-600 italic">"{log.summary}"</p>
                      </div>
                    )}

                    {/* Thoughts */}
                    {log.thoughts && (
                      <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                        <p className="font-semibold text-emerald-900 text-[11px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          나의 느낌과 소감:
                        </p>
                        <p className="leading-relaxed font-medium">"{log.thoughts}"</p>
                      </div>
                    )}
                  </div>

                  {/* Date Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {log.date ? log.date.substring(0, 10) : '날짜 없음'}
                    </span>

                    {log.syncedToGAS && (
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ 시트 동기화됨
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
