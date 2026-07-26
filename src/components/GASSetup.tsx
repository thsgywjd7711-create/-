import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Settings, CheckCircle2, AlertCircle, RefreshCw, Code2, Database, Send, Play } from 'lucide-react';
import { GASConfig } from '../types';

interface GASSetupProps {
  gasConfig: GASConfig;
  onSaveGasConfig: (config: GASConfig) => void;
  onTestConnection: (url: string) => Promise<boolean>;
}

export const CODE_GS_SCRIPT = `// ==========================================
// 그린빌 어린이집 들꽃향기반 구글 앱스 스크립트 (Code.gs)
// ==========================================

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 헤더가 없으면 첫 행에 컬럼명 설정
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["일시", "이름", "도서명", "지은이", "출판사", "줄거리", "소감", "별점"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#E8F5E9");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 핑/연동 테스트 확인
    if (data.action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "연동 성공!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 전체 데이터 조회 요청인 경우 (read)
    if (data.action === "read") {
      var rows = sheet.getDataRange().getValues();
      var result = [];
      for (var i = 1; i < rows.length; i++) {
        result.push({
          date: rows[i][0],
          childName: rows[i][1],
          bookTitle: rows[i][2],
          author: rows[i][3],
          publisher: rows[i][4],
          summary: rows[i][5],
          thoughts: rows[i][6],
          rating: rows[i][7]
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 독서 기록 실시간 행 추가
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-DD HH:mm:ss");

    var childName = data.childName || "";
    var bookTitle = data.bookTitle || "";
    var author = data.author || "";
    var publisher = data.publisher || "";
    var summary = data.summary || "";
    var thoughts = data.thoughts || "";
    var rating = data.rating || 5;

    sheet.appendRow([formattedDate, childName, bookTitle, author, publisher, summary, thoughts, rating]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "구글 시트에 성공적으로 저장되었습니다." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

export const GASSetup: React.FC<GASSetupProps> = ({
  gasConfig,
  onSaveGasConfig,
  onTestConnection,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(gasConfig.webAppUrl || '');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_GS_SCRIPT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();

    onSaveGasConfig({
      ...gasConfig,
      webAppUrl: cleanUrl,
    });

    if (cleanUrl) {
      setTestStatus('testing');
      setTestMessage('구글 시트 연동 테스트 중...');
      const success = await onTestConnection(cleanUrl);
      if (success) {
        setTestStatus('success');
        setTestMessage('구글 시트와 성공적으로 연결되었습니다! 🎉');
      } else {
        setTestStatus('failed');
        setTestMessage('연동 실패: URL을 다시 확인하거나 배포 권한(모든 사용자 Access)을 확인해 주세요.');
      }
    } else {
      setTestStatus('idle');
      setTestMessage('URL이 비어있어 로컬 저장 모드로 동작합니다.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Database className="w-3.5 h-3.5" />
              구글 스프레드시트 무제한 데이터 백업
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              구글 시트 실시간 자동 연동 설정 📊
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">
              구글 앱스 스크립트(GAS)를 연결하면 원아가 입력한 모든 독서 기록이 본인의 구글 시트에 실시간 자동 누적됩니다.
            </p>
          </div>

          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${gasConfig.webAppUrl ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <div>
              <p className="text-[11px] text-gray-300 font-medium">현재 연동 상태</p>
              <p className="text-sm font-bold">
                {gasConfig.webAppUrl ? '구글 시트 연동 활성화' : '로컬 저장 모드'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Code.gs Copy Block */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              STEP 1
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2">
              구글 앱스 스크립트 소스코드 (Code.gs)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              아래 소스코드를 전체 복사하여 구글 시트의 [확장 프로그램] → [Apps Script] 창에 붙여넣어 주세요.
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs shrink-0 ${
              isCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-600" />
                <span>전체 코드 복사하기</span>
              </>
            )}
          </button>
        </div>

        {/* Code Box */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 text-xs text-gray-200 font-mono p-4 max-h-72 overflow-y-auto">
          <pre>{CODE_GS_SCRIPT}</pre>
        </div>
      </div>

      {/* Step 2: Deployment Guide & Web App URL Input */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            STEP 2
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-2">
            배포한 구글 웹 앱 URL 저장하기
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            [배포] → [새 배포]에서 액세스 권한을 <strong className="text-indigo-900 font-bold">'모든 사용자(Anyone)'</strong>로 설정한 후 발급받은 URL을 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSaveUrl} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-emerald-600" />
              구글 앱스 스크립트 Web App URL
            </label>
            <input
              type="url"
              required
              placeholder="https://script.google.com/macros/s/.../exec"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm bg-gray-50/50 font-mono"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={testStatus === 'testing'}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {testStatus === 'testing' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>연동 테스트 진행 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>URL 저장 및 연결 테스트</span>
                </>
              )}
            </button>

            {testStatus === 'success' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {testMessage}
              </span>
            )}

            {testStatus === 'failed' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                {testMessage}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Visual Guide Accordion / Steps */}
      <div className="bg-emerald-50/60 rounded-3xl border border-emerald-100 p-6 sm:p-8 space-y-4">
        <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
          💡 처음 세팅하시나요? 3분 완성 세팅 방법
        </h4>

        <ol className="space-y-3 text-xs text-emerald-950 leading-relaxed list-decimal list-inside font-medium">
          <li>새 구글 스프레드시트(Google Sheets)를 하나 만듭니다.</li>
          <li>상단 메뉴의 <strong>[확장 프로그램] → [Apps Script]</strong>를 누릅니다.</li>
          <li>편집기에 위 STEP 1의 <code>Code.gs</code> 소스코드를 그대로 전체 붙여넣기합니다.</li>
          <li>우측 상단 <strong>[배포] → [새 배포]</strong> 버튼을 누릅니다.</li>
          <li>
            유형에서 <strong>'웹 앱(Web App)'</strong> 선택 후, <u>다음 사용자로 실행</u>: '나(Me)', 
            <u>액세스 권한 있는 사용자</u>: <strong>'모든 사용자(Anyone)'</strong>로 변경 후 [배포]를 누릅니다.
          </li>
          <li>발급되는 <code>https://script.google.com/macros/s/.../exec</code> 주소를 복사하여 위 세팅 창에 입력하면 완료!</li>
        </ol>
      </div>
    </div>
  );
};
