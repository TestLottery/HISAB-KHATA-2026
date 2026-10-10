import { Language, Transaction } from '../types';
import { getCategoryById, getCategoryDisplayName } from './categories';

// Bengali digit map
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(strOrNum: string | number): string {
  const str = String(strOrNum);
  return str.replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)] || d);
}

// Format currency in Indian Rupees
export function formatCurrency(amount: number, inBengaliDigits = false): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  if (inBengaliDigits) {
    return `₹ ${toBengaliDigits(formatted)}`;
  }
  return `₹ ${formatted}`;
}

const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const BENGALI_DAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

const ENGLISH_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function formatDateLocale(dateStr: string, lang: Language = 'bn'): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);

  const todayStr = getTodayDateStr();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (lang === 'en') {
    if (dateStr === todayStr) {
      return `Today (${d} ${ENGLISH_MONTHS[m - 1]?.slice(0, 3)})`;
    }
    if (dateStr === yesterdayStr) {
      return `Yesterday (${d} ${ENGLISH_MONTHS[m - 1]?.slice(0, 3)})`;
    }
    const dayName = ENGLISH_DAYS[date.getDay()];
    return `${d} ${ENGLISH_MONTHS[m - 1]}, ${y} (${dayName})`;
  }

  // Bengali default
  if (dateStr === todayStr) {
    return `আজ (${d} ${BENGALI_MONTHS[m - 1]})`;
  }
  if (dateStr === yesterdayStr) {
    return `গতকাল (${d} ${BENGALI_MONTHS[m - 1]})`;
  }

  const dayName = BENGALI_DAYS[date.getDay()];
  return `${d} ${BENGALI_MONTHS[m - 1]}, ${y} (${dayName})`;
}

export function formatShortDate(dateStr: string, lang: Language = 'bn'): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (lang === 'en') {
    return `${d} ${ENGLISH_MONTHS[m - 1]?.slice(0, 3)}, ${y}`;
  }
  return `${d} ${BENGALI_MONTHS[m - 1]?.slice(0, 3)}, ${y}`;
}

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Export transactions to CSV formatted for Excel
export function exportToCSV(
  transactions: Transaction[],
  lang: Language = 'bn',
  filename = lang === 'en' ? 'hisab_khata_transactions.csv' : 'হিসাব_খাতা_লেনদেন.csv'
): void {
  // UTF-8 BOM to make Bengali Unicode characters render properly in Microsoft Excel
  const BOM = '\uFEFF';
  
  const headers =
    lang === 'en'
      ? ['SL', 'Date', 'Type', 'Category', 'Amount (₹)', 'Note / Description']
      : ['ক্রমিক', 'তারিখ', 'ধরণ', 'ক্যাটাগরি', 'পরিমাণ (₹)', 'নোট / বিবরণ'];
  
  const rows = transactions.map((t, idx) => {
    const category = getCategoryById(t.category);
    const categoryName = getCategoryDisplayName(category, lang);
    const typeLabel =
      lang === 'en'
        ? t.type === 'income' ? 'Income' : 'Expense'
        : t.type === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)';
    const cleanNote = (t.note || '').replace(/"/g, '""');
    const amountVal = t.amount;

    return [
      idx + 1,
      `"${t.date}"`,
      `"${typeLabel}"`,
      `"${categoryName}"`,
      amountVal,
      `"${cleanNote}"`,
    ].join(',');
  });

  const csvContent = BOM + [headers.join(','), ...rows].join('\r\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
