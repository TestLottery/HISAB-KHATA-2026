import { CategoryItem, Language, TransactionType } from '../types';

export const CATEGORIES: CategoryItem[] = [
  // Income categories
  {
    id: 'salary',
    name: 'বেতন (Salary)',
    nameEn: 'Salary',
    type: 'income',
    iconName: 'Briefcase',
    color: '#10b981',
    bgLight: '#ecfdf5',
  },
  {
    id: 'business',
    name: 'ব্যবসা (Business)',
    nameEn: 'Business',
    type: 'income',
    iconName: 'Store',
    color: '#059669',
    bgLight: '#d1fae5',
  },
  {
    id: 'freelance',
    name: 'ফ্রিল্যান্সিং / পার্ট-টাইম',
    nameEn: 'Freelance / Part-time',
    type: 'income',
    iconName: 'Laptop',
    color: '#0d9488',
    bgLight: '#ccfbf1',
  },
  {
    id: 'investment',
    name: 'বিনিয়োগ / মুনাফা',
    nameEn: 'Investment / Profit',
    type: 'income',
    iconName: 'TrendingUp',
    color: '#0284c7',
    bgLight: '#e0f2fe',
  },
  {
    id: 'gift_income',
    name: 'উপহার / সাহায্য',
    nameEn: 'Gift / Help',
    type: 'income',
    iconName: 'Gift',
    color: '#8b5cf6',
    bgLight: '#f5f3ff',
  },
  {
    id: 'other_income',
    name: 'অন্যান্য আয়',
    nameEn: 'Other Income',
    type: 'income',
    iconName: 'PlusCircle',
    color: '#64748b',
    bgLight: '#f8fafc',
  },

  // Expense categories
  {
    id: 'food',
    name: 'খাবার ও বাজার (Food)',
    nameEn: 'Food & Groceries',
    type: 'expense',
    iconName: 'Utensils',
    color: '#ef4444',
    bgLight: '#fef2f2',
  },
  {
    id: 'travel',
    name: 'যাতায়াত / ভাড়া (Travel)',
    nameEn: 'Travel & Transport',
    type: 'expense',
    iconName: 'Bus',
    color: '#f97316',
    bgLight: '#fff7ed',
  },
  {
    id: 'shopping',
    name: 'কেনাকাটা (Shopping)',
    nameEn: 'Shopping',
    type: 'expense',
    iconName: 'ShoppingBag',
    color: '#ec4899',
    bgLight: '#fdf2f8',
  },
  {
    id: 'bills',
    name: 'বিল ও ইউটিলিটি (Bills)',
    nameEn: 'Bills & Utilities',
    type: 'expense',
    iconName: 'Receipt',
    color: '#eab308',
    bgLight: '#fefce8',
  },
  {
    id: 'medical',
    name: 'চিকিৎসা ও ওষুধ (Medical)',
    nameEn: 'Medical & Healthcare',
    type: 'expense',
    iconName: 'HeartPulse',
    color: '#dc2626',
    bgLight: '#fee2e2',
  },
  {
    id: 'education',
    name: 'শিক্ষা / বইপত্র',
    nameEn: 'Education & Books',
    type: 'expense',
    iconName: 'GraduationCap',
    color: '#6366f1',
    bgLight: '#eef2ff',
  },
  {
    id: 'rent',
    name: 'বাড়ি ভাড়া (House Rent)',
    nameEn: 'House Rent',
    type: 'expense',
    iconName: 'Home',
    color: '#b45309',
    bgLight: '#fef3c7',
  },
  {
    id: 'entertainment',
    name: 'বিনোদন ও আনন্দ',
    nameEn: 'Entertainment',
    type: 'expense',
    iconName: 'Film',
    color: '#a855f7',
    bgLight: '#faf5ff',
  },
  {
    id: 'other_expense',
    name: 'অন্যান্য খরচ',
    nameEn: 'Other Expense',
    type: 'expense',
    iconName: 'MinusCircle',
    color: '#64748b',
    bgLight: '#f1f5f9',
  },
];

export function getCategoryById(id: string): CategoryItem {
  const found = CATEGORIES.find((c) => c.id === id);
  if (found) return found;

  return {
    id,
    name: id,
    nameEn: id,
    type: 'expense',
    iconName: 'CircleDot',
    color: '#64748b',
    bgLight: '#f1f5f9',
  };
}

export function getCategoryDisplayName(category: CategoryItem, lang: Language): string {
  return lang === 'en' ? category.nameEn : category.name;
}

export function getCategoriesByType(type: TransactionType): CategoryItem[] {
  return CATEGORIES.filter((c) => c.type === type);
}
