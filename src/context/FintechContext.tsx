import React, { createContext, useContext, useEffect } from 'react';
import { 
  Transaction, 
  Budget, 
  SavingsGoal, 
  UserProfile, 
  NotificationItem, 
  CategoryType,
  AutoplayRule
} from '../types';
import { useTransactionsStore } from '../store/transactionsStore';
import { useExpensesStore } from '../store/expensesStore';
import { useBudgetStore } from '../store/budgetStore';
import { useGoalsStore } from '../store/goalsStore';
import { useSettingsStore } from '../store/settingsStore';
import { useReportsStore } from '../store/reportsStore';
import { useAutoplayStore } from '../store/autoplayStore';

interface FintechContextProps {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  notifications: NotificationItem[];
  autoplayRules: AutoplayRule[];
  isLoading: boolean;
  selectedPeriod: 'Monthly' | 'Weekly' | 'Yearly';
  customReportNotes: string;
  isAuthenticated: boolean;
  
  // Actions
  login: (name: string, email: string, avatar?: string) => void;
  logout: () => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'isSubscription' | 'subscriptionName'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (category: CategoryType) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => void;
  updateGoalSavedAmount: (id: string, savedAmount: number) => void;
  deleteGoal: (id: string) => void;
  addAutoplayRule: (rule: Omit<AutoplayRule, 'id' | 'isActive'>) => void;
  updateAutoplayRule: (id: string, updated: Partial<AutoplayRule>) => void;
  deleteAutoplayRule: (id: string) => void;
  toggleAutoplayActive: (id: string) => void;
  processDueAutoplays: () => void;
  updateProfile: (profile: UserProfile) => void;
  clearAllData: () => void;
  loadSimulationData: () => void;
  markNotificationsAsRead: () => void;
  setSelectedPeriod: (period: 'Monthly' | 'Weekly' | 'Yearly') => void;
  setCustomReportNotes: (notes: string) => void;
}

const FintechContext = createContext<FintechContextProps | undefined>(undefined);

export function FintechProvider({ children }: { children: React.ReactNode }) {
  // Read Zustand states reactively in the component tree
  const transactions = useTransactionsStore((state) => state.transactions);
  const budgets = useBudgetStore((state) => state.budgets);
  const goals = useGoalsStore((state) => state.goals);
  const profile = useSettingsStore((state) => state.profile);
  const notifications = useSettingsStore((state) => state.notifications);
  const isAuthenticated = useSettingsStore((state) => state.isAuthenticated);
  const selectedPeriod = useReportsStore((state) => state.selectedPeriod);
  const customReportNotes = useReportsStore((state) => state.customReportNotes);
  const autoplayRules = useAutoplayStore((state) => state.autoplayRules);

  const login = useSettingsStore((state) => state.login);
  const logout = useSettingsStore((state) => state.logout);
  const addTransaction = useTransactionsStore((state) => state.addTransaction);
  const deleteTransaction = useTransactionsStore((state) => state.deleteTransaction);
  const updateBudget = useBudgetStore((state) => state.updateBudget);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);
  const addGoal = useGoalsStore((state) => state.addGoal);
  const updateGoalSavedAmount = useGoalsStore((state) => state.updateGoalSavedAmount);
  const deleteGoal = useGoalsStore((state) => state.deleteGoal);
  const updateProfile = useSettingsStore((state) => state.updateProfile);
  const markNotificationsAsRead = useSettingsStore((state) => state.markNotificationsAsRead);
  const setSelectedPeriod = useReportsStore((state) => state.setSelectedPeriod);
  const setCustomReportNotes = useReportsStore((state) => state.setCustomReportNotes);

  const addAutoplayRule = useAutoplayStore((state) => state.addAutoplayRule);
  const updateAutoplayRule = useAutoplayStore((state) => state.updateAutoplayRule);
  const deleteAutoplayRule = useAutoplayStore((state) => state.deleteAutoplayRule);
  const toggleAutoplayActive = useAutoplayStore((state) => state.toggleAutoplayActive);
  const processDueAutoplays = useAutoplayStore((state) => state.processDueAutoplays);

  // Auto processing engine running securely offline
  useEffect(() => {
    if (isAuthenticated) {
      processDueAutoplays();
    }
  }, [isAuthenticated, transactions.length, processDueAutoplays]);

  // Dynamic automatic effect to compute overspending for budgets in real-time
  useEffect(() => {
    if (transactions.length === 0 || budgets.length === 0) return;

    // Aggregate category expenditures
    const totals: Record<string, number> = {};
    for (const tx of transactions) {
      if (tx.type === 'expense' || !tx.type) {
        totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
      }
    }

    // Check each budget limit
    for (const budget of budgets) {
      const spent = totals[budget.category] || 0;
      if (spent > budget.limit) {
        // If warning notification already exists with same name and is unread, do not duplicate
        const exists = notifications.some(
          n => n.type === 'warning' && n.title.includes(budget.category) && !n.read
        );

        if (!exists) {
          useSettingsStore.getState().addNotification({
            title: `Budget Exceeded: ${budget.category}`,
            message: `Your spending on ${budget.category} (${profile.currency}${spent.toFixed(2)}) is higher than your set budget limit of ${profile.currency}${budget.limit.toFixed(2)}.`,
            type: 'warning'
          });
        }
      }
    }
  }, [transactions, budgets, notifications, profile.currency]);

  // Clean wipe reset action
  const clearAllData = () => {
    // Preserve current profile and active session state
    const currentProfile = useSettingsStore.getState().profile;
    const loginFlag = localStorage.getItem('vq_logged_in');

    // Wipe localStorage entries
    localStorage.clear();

    // Restore login session so they are not kicked out of the workspace config
    if (loginFlag === 'true') {
      localStorage.setItem('vq_logged_in', 'true');
      localStorage.setItem('vq_profile', JSON.stringify(currentProfile));
    }

    // Reset stores to zero states securely
    useTransactionsStore.getState().resetAll();
    useExpensesStore.getState().resetAll();
    useBudgetStore.getState().resetAll();
    useGoalsStore.getState().resetAll();
    useAutoplayStore.getState().resetAll();
    useReportsStore.getState().resetAll();

    // Reset notifications array while keeping active Auth state in memory
    useSettingsStore.setState({
      notifications: [],
      profile: currentProfile,
      isAuthenticated: loginFlag === 'true'
    });
    localStorage.setItem('vq_notifications', JSON.stringify([]));

    // Push initial reset alert
    useSettingsStore.getState().addNotification({
      title: 'Database Reset',
      message: 'All local accounts and financial metrics have been returned to zero.',
      type: 'info'
    });
  };

  // Safe developer simulation load disabled entirely due to strict authentic guidelines
  const loadSimulationData = () => {
    useSettingsStore.getState().addNotification({
      title: 'Simulation Disallowed',
      message: 'Sandbox data seed is inactive in compliance with production database policies.',
      type: 'info'
    });
  };

  return (
    <FintechContext.Provider value={{
      profile,
      transactions,
      budgets,
      goals,
      notifications,
      autoplayRules,
      isLoading: false,
      selectedPeriod,
      customReportNotes,
      isAuthenticated,
      login,
      logout,
      addTransaction,
      deleteTransaction,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoalSavedAmount,
      deleteGoal,
      addAutoplayRule,
      updateAutoplayRule,
      deleteAutoplayRule,
      toggleAutoplayActive,
      processDueAutoplays,
      updateProfile,
      clearAllData,
      loadSimulationData,
      markNotificationsAsRead,
      setSelectedPeriod,
      setCustomReportNotes
    }}>
      {children}
    </FintechContext.Provider>
  );
}

export function useFintech() {
  const context = useContext(FintechContext);
  if (!context) {
    throw new Error('useFintech must be used within a FintechProvider');
  }
  return context;
}
