export interface ReadingLog {
  id: string;
  childName: string;
  bookTitle: string;
  author: string;
  publisher: string;
  summary: string;
  thoughts: string;
  rating: number; // 1 ~ 5
  date: string; // YYYY-MM-DD HH:mm:ss
  createdAt: number; // timestamp
  syncedToGAS?: boolean;
}

export interface Child {
  id: string;
  name: string;
  avatarEmoji: string;
  badge: string;
  colorBg: string;
}

export interface GASConfig {
  webAppUrl: string;
  isAutoSync: boolean;
  lastSyncedAt: string | null;
}

export interface MonthlyStats {
  monthKey: string; // YYYY-MM
  monthName: string;
  topChildren: { childName: string; count: number }[];
  totalLogs: number;
}
