export interface UserProfile {
  name: string;
  currency: string;
  occupation: string;
  email?: string;
  avatar?: string;
}

export type CategoryType =
  | 'Food'
  | 'Shopping'
  | 'Bills'
  | 'Transport'
  | 'Health'
  | 'Entertainment'
  | 'Education'
  | 'Travel'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  category: CategoryType;
  notes: string;
  date: string;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'Crypto';
  isSubscription: boolean;
  subscriptionName?: string;
  type?: 'expense' | 'income';
}

export interface Budget {
  category: CategoryType;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
}

export type ActiveTabType =
  | 'Landing'
  | 'Dashboard'
  | 'Transactions'
  | 'Budgets'
  | 'Goals'
  | 'Reports'
  | 'Autoplays'
  | 'Settings';

export type AutoplayType = 'income' | 'expense' | 'subscription' | 'savings';

export interface AutoplayRule {
  id: string;
  title: string;
  amount: number;
  category: CategoryType;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  startDate: string;
  type: AutoplayType;
  isActive: boolean;
  lastProcessedDate?: string;
}

