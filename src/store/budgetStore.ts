import { create } from 'zustand';
import { Budget, CategoryType } from '../types';
import { useSettingsStore } from './settingsStore';

interface BudgetState {
  budgets: Budget[];
  updateBudget: (budget: Budget) => void;
  deleteBudget: (category: CategoryType) => void;
  setRawBudgets: (budgets: Budget[]) => void;
  resetAll: () => void;
}

const getInitialBudgets = (): Budget[] => {
  try {
    const stored = localStorage.getItem('vq_budgets');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: getInitialBudgets(),

  updateBudget: (budget) => set((state) => {
    const filtered = state.budgets.filter((b) => b.category !== budget.category);
    const newBudgets = budget.limit > 0 ? [...filtered, budget] : filtered;
    localStorage.setItem('vq_budgets', JSON.stringify(newBudgets));

    const currency = useSettingsStore.getState().profile.currency;
    useSettingsStore.getState().addNotification({
      title: 'Budget Configured',
      message: `Your budget limit for ${budget.category} was set to ${currency}${budget.limit}.`,
      type: 'success'
    });

    return { budgets: newBudgets };
  }),

  deleteBudget: (category) => set((state) => {
    const newBudgets = state.budgets.filter((b) => b.category !== category);
    localStorage.setItem('vq_budgets', JSON.stringify(newBudgets));
    return { budgets: newBudgets };
  }),

  setRawBudgets: (budgets) => {
    localStorage.setItem('vq_budgets', JSON.stringify(budgets));
    set({ budgets });
  },

  resetAll: () => {
    localStorage.setItem('vq_budgets', JSON.stringify([]));
    set({ budgets: [] });
  }
}));
