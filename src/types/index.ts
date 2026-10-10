export type Language = 'bn' | 'en';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
}

export interface CategoryItem {
  id: string;
  name: string; // Bengali name
  nameEn: string; // English name
  type: TransactionType;
  iconName: string;
  color: string;
  bgLight: string;
}

export type DateFilterType = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'this_year' | 'custom';

export interface FilterState {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateRange: DateFilterType;
  startDate: string;
  endDate: string;
  searchQuery: string;
}

export type SummaryTabType = 'overview' | 'daily' | 'monthly' | 'yearly';
