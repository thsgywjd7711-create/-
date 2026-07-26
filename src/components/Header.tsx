import React from 'react';
import { BookOpen, Award, BarChart3, Settings, Sparkles, CheckCircle2, AlertCircle, Flower2, Search } from 'lucide-react';
import { GASConfig } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gasConfig: GASConfig;
  totalLogsCount: number;
  isTeacherUnlocked: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gasConfig,
  totalLogsCount,
  isTeacherUnlocked,
}) => {
  const isGasConnected = Boolean(gasConfig.webAppUrl && gasConfig.webAppUrl.trim().length > 10);

  return (
    <header className="bg-white border-b border-emerald-100 shadow-xs sticky top-0 z-30">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 h-2 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Class Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs shrink-0">
              <Flower2 className="w-7 h-7 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  🌱 그린빌 어린이집
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  🌼 들꽃향기반
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-0.5 flex items-center gap-2">
                전자 독서기록장
                <span className="text-xs font-normal text-gray-500 hidden sm:inline-block">
                  (총 {totalLogsCount}권의 추억)
                </span>
              </h1>
            </div>
          </div>

          {/* Right Status Badges & Quick Action */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* GAS Sync Status */}
            <button
              onClick={() => setActiveTab('gas-setup')}
              title="구글 시트 연동 설정으로 이동"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                isGasConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {isGasConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>구글 시트 연동중</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                  <span>로컬 모드 (시트 연결하기)</span>
                </>
              )}
            </button>

            {/* Teacher Status Pill */}
            {isTeacherUnlocked && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                🔒 교사 관리 인증됨
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-gray-100 overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'write'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>독서기록 작성</span>
          </button>

          <button
            onClick={() => setActiveTab('my-logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'my-logs'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>내 독서기록 보기</span>
          </button>

          <button
            onClick={() => setActiveTab('reading-king')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reading-king'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>이달의 독서왕 🏆</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>교사 대시보드</span>
          </button>

          <button
            onClick={() => setActiveTab('gas-setup')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'gas-setup'
                ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-800/20'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>구글 시트 연동 설정</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
