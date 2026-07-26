import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReadingForm } from './components/ReadingForm';
import { MyReadingLogs } from './components/MyReadingLogs';
import { ReadingKing } from './components/ReadingKing';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GASSetup } from './components/GASSetup';
import { ReadingLog, GASConfig } from './types';
import { INITIAL_LOGS } from './data/initialData';

const LOCAL_STORAGE_KEY_LOGS = 'greenville_wildflower_reading_logs_v1';
const LOCAL_STORAGE_KEY_GAS = 'greenville_wildflower_gas_config_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('write');

  // Logs State
  const [logs, setLogs] = useState<ReadingLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load logs from localStorage:', e);
    }
    return INITIAL_LOGS;
  });

  // GAS Config State
  const [gasConfig, setGasConfig] = useState<GASConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GAS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load GAS config:', e);
    }
    return {
      webAppUrl: '',
      isAutoSync: true,
      lastSyncedAt: null,
    };
  });

  // Teacher Mode Unlock State
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState<boolean>(false);

  // Submitting / Syncing Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync logs to LocalStorage whenever logs change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage:', e);
    }
  }, [logs]);

  // Save GAS config to LocalStorage
  const handleSaveGasConfig = (config: GASConfig) => {
    setGasConfig(config);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_GAS, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save GAS config:', e);
    }
  };

  // Send single record to GAS
  const sendToGAS = async (logData: Omit<ReadingLog, 'id' | 'createdAt' | 'syncedToGAS'>): Promise<boolean> => {
    if (!gasConfig.webAppUrl || gasConfig.webAppUrl.trim().length < 10) {
      return false;
    }

    try {
      // GAS Web App works smoothly with text/plain JSON payload or no-cors
      await fetch(gasConfig.webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(logData),
      });
      return true;
    } catch (error) {
      console.warn('Failed to send log to GAS Web App URL:', error);
      return false;
    }
  };

  // Test GAS URL Ping
  const handleTestConnection = async (url: string): Promise<boolean> => {
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'ping' }),
      });
      return true;
    } catch (err) {
      console.error('GAS Test Connection Error:', err);
      return false;
    }
  };

  // Add Log Handler
  const handleAddLog = async (
    newLogData: Omit<ReadingLog, 'id' | 'createdAt' | 'date'>
  ): Promise<boolean> => {
    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: ReadingLog = {
      ...newLogData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      date: formattedDate,
      createdAt: Date.now(),
      syncedToGAS: false,
    };

    // Send to GAS if URL configured
    let synced = false;
    if (gasConfig.webAppUrl) {
      synced = await sendToGAS({
        childName: newLog.childName,
        bookTitle: newLog.bookTitle,
        author: newLog.author,
        publisher: newLog.publisher,
        summary: newLog.summary,
        thoughts: newLog.thoughts,
        rating: newLog.rating,
        date: newLog.date,
      });
    }

    newLog.syncedToGAS = synced;

    // Save locally
    setLogs((prev) => [newLog, ...prev]);
    setIsSubmitting(false);

    return true;
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  // Update Log
  const handleUpdateLog = (updatedLog: ReadingLog) => {
    setLogs((prev) => prev.map((item) => (item.id === updatedLog.id ? updatedLog : item)));
  };

  // Batch Sync to GAS
  const handleSyncToGAS = async () => {
    if (!gasConfig.webAppUrl) {
      alert('구글 시트 연동 URL이 설정되지 않았습니다. [구글 시트 연동 설정] 탭에서 URL을 먼저 등록해 주세요.');
      setActiveTab('gas-setup');
      return;
    }

    setIsSyncing(true);

    const updatedLogs = [...logs];
    let successCount = 0;

    for (let i = 0; i < updatedLogs.length; i++) {
      if (!updatedLogs[i].syncedToGAS) {
        const ok = await sendToGAS({
          childName: updatedLogs[i].childName,
          bookTitle: updatedLogs[i].bookTitle,
          author: updatedLogs[i].author,
          publisher: updatedLogs[i].publisher,
          summary: updatedLogs[i].summary,
          thoughts: updatedLogs[i].thoughts,
          rating: updatedLogs[i].rating,
          date: updatedLogs[i].date,
        });

        if (ok) {
          updatedLogs[i].syncedToGAS = true;
          successCount++;
        }
      }
    }

    setLogs(updatedLogs);
    setIsSyncing(false);

    alert(`총 ${successCount}건의 독서 기록이 구글 시트와 동기화되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans flex flex-col">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gasConfig={gasConfig}
        totalLogsCount={logs.length}
        isTeacherUnlocked={isTeacherUnlocked}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'write' && (
          <ReadingForm onAddLog={handleAddLog} isSubmitting={isSubmitting} />
        )}

        {activeTab === 'my-logs' && <MyReadingLogs logs={logs} />}

        {activeTab === 'reading-king' && <ReadingKing logs={logs} />}

        {activeTab === 'dashboard' && (
          <TeacherDashboard
            logs={logs}
            onDeleteLog={handleDeleteLog}
            onUpdateLog={handleUpdateLog}
            isUnlocked={isTeacherUnlocked}
            setIsUnlocked={setIsTeacherUnlocked}
            gasConfig={gasConfig}
            onSyncToGAS={handleSyncToGAS}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'gas-setup' && (
          <GASSetup
            gasConfig={gasConfig}
            onSaveGasConfig={handleSaveGasConfig}
            onTestConnection={handleTestConnection}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 py-6 text-center text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-emerald-800">🌱 그린빌 어린이집 들꽃향기반 전자 독서기록장</p>
          <p className="text-[11px] text-gray-400">
            어린이들의 독서 습관과 지혜를 가꾸는 공간 • 구글 스크립트 연동 & 로컬 백업 지원
          </p>
        </div>
      </footer>
    </div>
  );
}
