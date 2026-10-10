import { Language, Transaction } from '../types';
import { getTodayDateStr } from './formatters';

const STORAGE_KEY = 'hisab_khata_data_v1';
const PREFS_KEY = 'hisab_khata_prefs_v1';

export interface UserPrefs {
  language: Language;
  useBengaliDigits: boolean;
  privacyNoticeDismissed: boolean;
}

export const DEFAULT_PREFS: UserPrefs = {
  language: 'bn',
  useBengaliDigits: false,
  privacyNoticeDismissed: false,
};

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt);
    }
  } catch (err) {
    console.error('Failed to load transactions from localStorage:', err);
  }
  return [];
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to localStorage:', err);
  }
}

export function loadPrefs(): UserPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: UserPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences:', err);
  }
}

// Generate realistic sample transactions in Bengali
export function getSampleTransactions(): Transaction[] {
  const today = new Date();
  
  const formatDateOffset = (daysAgo: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const sampleList: Array<Omit<Transaction, 'id' | 'createdAt' | 'date'> & { daysAgo: number }> = [
    {
      daysAgo: 0,
      type: 'expense',
      amount: 450,
      category: 'food',
      note: 'সকালের বাজার ও তাজা সবজি',
    },
    {
      daysAgo: 0,
      type: 'expense',
      amount: 60,
      category: 'travel',
      note: 'অফিস যাতায়াত বাস ভাড়া',
    },
    {
      daysAgo: 1,
      type: 'income',
      amount: 3500,
      category: 'freelance',
      note: 'গ্রাফিক ডিজাইন প্রজেক্টের পেমেন্ট',
    },
    {
      daysAgo: 1,
      type: 'expense',
      amount: 180,
      category: 'food',
      note: 'বিকেলের চা ও হালকা নাস্তা',
    },
    {
      daysAgo: 3,
      type: 'expense',
      amount: 1250,
      category: 'bills',
      note: 'বিদ্যুৎ বিল ও ওয়াইফাই রিচার্জ',
    },
    {
      daysAgo: 5,
      type: 'expense',
      amount: 620,
      category: 'medical',
      note: 'জরুরি ওষুধ ও প্রেসক্রিপশন',
    },
    {
      daysAgo: 7,
      type: 'expense',
      amount: 1450,
      category: 'shopping',
      note: 'নতুন জামাকাপড় ও জুতো',
    },
    {
      daysAgo: 9,
      type: 'income',
      amount: 42000,
      category: 'salary',
      note: 'মাসিক বেতনের টাকা',
    },
    {
      daysAgo: 9,
      type: 'expense',
      amount: 12000,
      category: 'rent',
      note: 'চলতি মাসের বাড়ি ভাড়া',
    },
    {
      daysAgo: 12,
      type: 'income',
      amount: 2500,
      category: 'business',
      note: 'দোকানের লাভ ও কমিশন',
    },
    {
      daysAgo: 15,
      type: 'expense',
      amount: 850,
      category: 'education',
      note: 'বইপত্র ও খাতা কেনা',
    },
  ];

  return sampleList.map((item, index) => ({
    id: `sample-${Date.now()}-${index}`,
    type: item.type,
    amount: item.amount,
    category: item.category,
    date: formatDateOffset(item.daysAgo),
    note: item.note,
    createdAt: Date.now() - (item.daysAgo * 86400000) - (index * 1000),
  }));
}

// Export data as JSON file for full backup
export function downloadBackupJSON(transactions: Transaction[]): void {
  const data = {
    appName: 'হিসাব খাতা',
    version: '1.0',
    exportDate: new Date().toISOString(),
    totalCount: transactions.length,
    transactions,
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `হিসাব_খাতা_ব্যাকআপ_${getTodayDateStr()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Restore data from JSON file
export function parseBackupJSON(jsonStr: string): { success: boolean; data?: Transaction[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    let list: Transaction[] = [];

    if (Array.isArray(parsed)) {
      list = parsed;
    } else if (parsed && Array.isArray(parsed.transactions)) {
      list = parsed.transactions;
    } else {
      return { success: false, error: 'ফাইলে কোনো লেনদেনের তথ্য পাওয়া যায়নি।' };
    }

    // Validate entries
    const validTransactions: Transaction[] = [];
    for (const item of list) {
      if (item && typeof item.amount === 'number' && item.amount > 0 && item.date && item.type) {
        validTransactions.push({
          id: String(item.id || `restored-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
          type: item.type === 'income' ? 'income' : 'expense',
          amount: Number(item.amount),
          category: String(item.category || 'other_expense'),
          date: String(item.date),
          note: item.note ? String(item.note) : '',
          createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
        });
      }
    }

    if (validTransactions.length === 0) {
      return { success: false, error: 'ফাইলের তথ্যগুলো সঠিক ফরম্যাটে নেই।' };
    }

    return { success: true, data: validTransactions };
  } catch (err) {
    return { success: false, error: 'ফাইলটি পড়তে সমস্যা হয়েছে। সঠিক JSON ব্যাকআপ ফাইল নির্বাচন করুন।' };
  }
}

export function clearStoredData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
