import React, { useState } from 'react';
import { Star, Send, BookOpen, User, Building, MessageSquare, Sparkles, Plus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WILDFLOWER_CHILDREN, RECOMMENDED_BOOKS } from '../data/initialData';
import { ReadingLog } from '../types';

interface ReadingFormProps {
  onAddLog: (newLog: Omit<ReadingLog, 'id' | 'createdAt' | 'date'>) => Promise<boolean>;
  isSubmitting: boolean;
}

export const ReadingForm: React.FC<ReadingFormProps> = ({ onAddLog, isSubmitting }) => {
  const [selectedChild, setSelectedChild] = useState<string>('김민준');
  const [customChildName, setCustomChildName] = useState<string>('');
  const [isCustomChild, setIsCustomChild] = useState<boolean>(false);

  const [bookTitle, setBookTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [thoughts, setThoughts] = useState<string>('');
  const [rating, setRating] = useState<number>(5);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [lastSubmittedChild, setLastSubmittedChild] = useState<string>('');

  const handleSelectRecommendedBook = (book: { title: string; author: string; publisher: string }) => {
    setBookTitle(book.title);
    setAuthor(book.author);
    setPublisher(book.publisher);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalName = isCustomChild ? customChildName.trim() : selectedChild;
    if (!finalName) {
      alert('이름을 입력하거나 선택해 주세요.');
      return;
    }
    if (!bookTitle.trim()) {
      alert('도서명을 입력해 주세요.');
      return;
    }

    const success = await onAddLog({
      childName: finalName,
      bookTitle: bookTitle.trim(),
      author: author.trim() || '미상',
      publisher: publisher.trim() || '미상',
      summary: summary.trim() || '즐겁게 읽었어요.',
      thoughts: thoughts.trim() || '재밌었어요!',
      rating,
    });

    if (success) {
      // Fire confetti for celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'],
      });

      setLastSubmittedChild(finalName);
      setShowSuccessModal(true);

      // Reset book fields (keep child name for convenience)
      setBookTitle('');
      setAuthor('');
      setPublisher('');
      setSummary('');
      setThoughts('');
      setRating(5);
    }
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5:
        return '🌟 최고예요! 내 인생 최애책 (5점)';
      case 4:
        return '⭐ 너무 재밌어요! (4점)';
      case 3:
        return '🙂 좋았어요! (3점)';
      case 2:
        return '🤔 좀 아쉬웠어요 (2점)';
      case 1:
        return '😅 어려웠어요 (1점)';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              오늘 읽은 책을 기록해보아요
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              책을 읽고 마음을 느껴보아요 📚
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              들꽃향기반 어린이들의 생각과 느낌이 알록달록 자라나요!
            </p>
          </div>
          <div className="hidden sm:block text-5xl">
            📖✨
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-emerald-100 shadow-md p-6 sm:p-8 space-y-8">
        
        {/* Step 1: Child Selection */}
        <div className="space-y-3">
          <label className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">1</span>
            어린이 이름을 선택해 주세요
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {WILDFLOWER_CHILDREN.map((child) => {
              const isSelected = !isCustomChild && selectedChild === child.name;
              return (
                <button
                  type="button"
                  key={child.id}
                  onClick={() => {
                    setIsCustomChild(false);
                    setSelectedChild(child.name);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 font-bold shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-emerald-50/50 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-2xl">{child.avatarEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{child.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{child.badge}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}

            {/* Direct Input Option */}
            <button
              type="button"
              onClick={() => setIsCustomChild(true)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                isCustomChild
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-900 font-bold shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-amber-50/50 hover:border-amber-300'
              }`}
            >
              <Plus className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm">직접 입력</p>
                <p className="text-[10px] text-gray-500">새로운 이름</p>
              </div>
            </button>
          </div>

          {isCustomChild && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="어린이 이름을 작성해 주세요 (예: 강하린)"
                value={customChildName}
                onChange={(e) => setCustomChildName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-amber-50/30"
              />
            </div>
          )}
        </div>

        {/* Step 2: Book Info */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">2</span>
              어떤 책을 읽었나요?
            </label>
            <span className="text-xs text-gray-500">인기 추천도서를 누르면 자동 입력돼요</span>
          </div>

          {/* Quick Recommendation Chips */}
          <div className="flex flex-wrap gap-2">
            {RECOMMENDED_BOOKS.map((book, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectRecommendedBook(book)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>📘</span>
                <span>{book.title}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                도서명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 구름빵"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                지은이 (저자)
              </label>
              <input
                type="text"
                placeholder="예: 백희나"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                출판사
              </label>
              <input
                type="text"
                placeholder="예: 한솔수북"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Story Summary & Thoughts */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <label className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">3</span>
            어떤 내용이었고 느낌은 어땠나요?
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                줄거리 (이야기 내용)
              </label>
              <textarea
                rows={3}
                placeholder="책의 기억나는 재미있는 줄거리를 짧게 적어주세요!"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                느낀점 / 소감 (나만의 생각)
              </label>
              <textarea
                rows={3}
                placeholder="책을 읽고 느낀 점이나 마음에 남는 장면을 적어주세요!"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Rating */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">4</span>
            이 책은 몇 별인가요? (별점 평가)
          </label>

          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-gray-300 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-xs sm:text-sm font-semibold text-emerald-800 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-2xs">
              {getRatingLabel(rating)}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                구글 시트에 기록 저장 중...
              </span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>독서 기록장에 예쁘게 등록하기! 🎉</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl shadow-inner">
              🌱✨
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              독서 기록 등록 완료!
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong className="text-emerald-700">{lastSubmittedChild}</strong> 어린이의 독서기록이 소중히 저장되었습니다.<br />
              지혜의 나무에 소중한 사과가 하나 늘어났어요! 🍎
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                다른 책 계속 기록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
