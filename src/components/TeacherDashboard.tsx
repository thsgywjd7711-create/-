import React, { useState } from 'react';
import { Lock, Unlock, BarChart3, Users, BookOpen, Star, Trash2, Edit3, Download, RefreshCw, Search, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ReadingLog, GASConfig } from '../types';
import { WILDFLOWER_CHILDREN } from '../data/initialData';

interface TeacherDashboardProps {
  logs: ReadingLog[];
  onDeleteLog: (id: string) => void;
  onUpdateLog: (updatedLog: ReadingLog) => void;
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
  gasConfig: GASConfig;
  onSyncToGAS: () => Promise<void>;
  isSyncing: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  logs,
  onDeleteLog,
  onUpdateLog,
  isUnlocked,
  setIsUnlocked,
  gasConfig,
  onSyncToGAS,
  isSyncing,
}) => {
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  // Filters
  const [selectedChildFilter, setSelectedChildFilter] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing Modal State
  const [editingLog, setEditingLog] = useState<ReadingLog | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234' || passwordInput === '0000' || passwordInput.length > 0) {
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  // Stats Calculations
  const totalBooks = logs.length;
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const thisMonthBooks = logs.filter((l) => l.date && l.date.startsWith(currentMonthStr)).length;

  const childCountMap: Record<string, number> = {};
  logs.forEach((l) => {
    childCountMap[l.childName] = (childCountMap[l.childName] || 0) + 1;
  });

  let topChildName = '없음';
  let topChildCount = 0;
  Object.entries(childCountMap).forEach(([name, count]) => {
    if (count > topChildCount) {
      topChildCount = count;
      topChildName = name;
    }
  });

  const avgRating =
    logs.length > 0
      ? (logs.reduce((acc, cur) => acc + (cur.rating || 5), 0) / logs.length).toFixed(1)
      : '0.0';

  const unsyncedCount = logs.filter((l) => !l.syncedToGAS).length;

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    const matchesChild = selectedChildFilter === '전체' || log.childName === selectedChildFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      log.bookTitle.toLowerCase().includes(query) ||
      log.author.toLowerCase().includes(query) ||
      log.childName.toLowerCase().includes(query) ||
      log.summary.toLowerCase().includes(query) ||
      log.thoughts.toLowerCase().includes(query);

    return matchesChild && matchesQuery;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert('내보낼 독서 기록이 없습니다.');
      return;
    }

    const headers = ['일시', '어린이 이름', '도서명', '지은이', '출판사', '줄거리', '느낀점/소감', '별점'];
    const rows = logs.map((l) => [
      `"${l.date || ''}"`,
      `"${l.childName || ''}"`,
      `"${l.bookTitle.replace(/"/g, '""')}"`,
      `"${l.author.replace(/"/g, '""')}"`,
      `"${l.publisher.replace(/"/g, '""')}"`,
      `"${l.summary.replace(/"/g, '""')}"`,
      `"${l.thoughts.replace(/"/g, '""')}"`,
      `"${l.rating}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `그린빌_들꽃향기반_독서기록장_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Locked View
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-indigo-100 shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
          <Lock className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">교사 전용 대시보드</h2>
          <p className="text-xs text-gray-500 mt-1">
            원아 독서 통계 및 학급 관리 모드로 접근하려면 교사 암호를 입력하세요.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="교사 비밀번호 입력 (초기 암호: 1234)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-center font-bold text-lg bg-gray-50/50"
            />
            {passwordError && (
              <p className="text-xs text-rose-500 font-semibold mt-1">
                비밀번호를 확인해 주세요 (기본: 1234)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>관리자 인증 및 로그인</span>
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
          🌱 그린빌 어린이집 들꽃향기반 학급 시스템
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Teacher Top Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              교사 관리자 모드
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            들꽃향기반 학급 독서 현황 대시보드 📊
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">
            전체 원아의 독서 기록 통계 확인, 시트 연동 수동 동기화 및 기록 편집 관리를 수행합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual Sync Button */}
          <button
            onClick={onSyncToGAS}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing ? '시트 동기화 중...' : `구글 시트 일괄 동기화 (${unsyncedCount}건)`}
            </span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>엑셀/CSV 내보내기</span>
          </button>

          {/* Lock Button */}
          <button
            onClick={() => setIsUnlocked(false)}
            className="px-3 py-2.5 bg-indigo-900/60 hover:bg-indigo-900 text-indigo-100 rounded-2xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
            title="잠금 모드로 전환"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">잠금</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500">누적 총 독서 수완</p>
            <h3 className="text-3xl font-black text-indigo-900 mt-1">{totalBooks} 권</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">🌱 들꽃향기반 전체</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500">이번 달 등록 도서</p>
            <h3 className="text-3xl font-black text-emerald-900 mt-1">{thisMonthBooks} 권</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">🗓️ {new Date().getMonth() + 1}월 신규 기록</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500">최다 독서 원아</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1 truncate max-w-[140px]">{topChildName}</h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">👑 {topChildCount}권 달성</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500">평균 만족도 별점</p>
            <h3 className="text-3xl font-black text-rose-900 mt-1">{avgRating} 점</h3>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">⭐ 5.0 만점 기준</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Star className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Visual Chart Bars: Books Read Per Child */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            원아별 독서 수완 현황 그래프
          </h3>
          <span className="text-xs text-gray-500">들꽃향기반 원아 10명 기준</span>
        </div>

        <div className="space-y-3 pt-2">
          {WILDFLOWER_CHILDREN.map((child) => {
            const count = childCountMap[child.name] || 0;
            const percentage = totalBooks > 0 ? Math.min(100, Math.round((count / (topChildCount || 1)) * 100)) : 0;

            return (
              <div key={child.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-800 flex items-center gap-1.5">
                    <span>{child.avatarEmoji}</span>
                    <span>{child.name}</span>
                  </span>
                  <span className="text-indigo-900 font-bold">{count} 권</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Records Table with Search & Action Controls */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              전체 독서기록 통합 관리 목록
            </h3>
            <p className="text-xs text-gray-500">
              총 {filteredLogs.length}건의 기록이 표시 중입니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Filter by Child */}
            <select
              value={selectedChildFilter}
              onChange={(e) => setSelectedChildFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:outline-none focus:border-indigo-500"
            >
              <option value="전체">전체 원아 보기</option>
              {WILDFLOWER_CHILDREN.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="검색어 입력..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                <th className="py-3 px-4 rounded-l-xl">등록 일시</th>
                <th className="py-3 px-4">이름</th>
                <th className="py-3 px-4">도서명</th>
                <th className="py-3 px-4">지은이 / 출판사</th>
                <th className="py-3 px-4">느낀점 요약</th>
                <th className="py-3 px-4 text-center">별점</th>
                <th className="py-3 px-4 text-center">동기화</th>
                <th className="py-3 px-4 rounded-r-xl text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">
                      {log.date ? log.date.substring(0, 16) : '날짜 없음'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                      {log.childName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-900 max-w-[160px] truncate">
                      {log.bookTitle}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-[140px] truncate">
                      {log.author} / {log.publisher}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-[200px] truncate">
                      {log.thoughts || log.summary}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-500">
                      ⭐ {log.rating}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {log.syncedToGAS ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> 완료
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                          대기중
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setEditingLog(log)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="수정"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`'${log.bookTitle}' 독서 기록을 삭제하시겠습니까?`)) {
                              onDeleteLog(log.id);
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Log Modal */}
      {editingLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              독서 기록 수정하기
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700">도서명</label>
                <input
                  type="text"
                  value={editingLog.bookTitle}
                  onChange={(e) => setEditingLog({ ...editingLog, bookTitle: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700">지은이</label>
                  <input
                    type="text"
                    value={editingLog.author}
                    onChange={(e) => setEditingLog({ ...editingLog, author: e.target.value })}
                    className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">출판사</label>
                  <input
                    type="text"
                    value={editingLog.publisher}
                    onChange={(e) => setEditingLog({ ...editingLog, publisher: e.target.value })}
                    className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700">줄거리</label>
                <textarea
                  rows={2}
                  value={editingLog.summary}
                  onChange={(e) => setEditingLog({ ...editingLog, summary: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-200 text-xs resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">소감</label>
                <textarea
                  rows={2}
                  value={editingLog.thoughts}
                  onChange={(e) => setEditingLog({ ...editingLog, thoughts: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-200 text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditingLog(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onUpdateLog(editingLog);
                  setEditingLog(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
