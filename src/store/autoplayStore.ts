import { create } from 'zustand';
import { AutoplayRule, CategoryType, AutoplayType, Transaction } from '../types';
import { useExpensesStore } from './expensesStore';
import { useGoalsStore } from './goalsStore';

interface AutoplayState {
  autoplayRules: AutoplayRule[];
  addAutoplayRule: (rule: Omit<AutoplayRule, 'id' | 'isActive'>) => void;
  updateAutoplayRule: (id: string, updated: Partial<AutoplayRule>) => void;
  deleteAutoplayRule: (id: string) => void;
  toggleAutoplayActive: (id: string) => void;
  processDueAutoplays: () => void;
  resetAll: () => void;
}

const getInitialRules = (): AutoplayRule[] => {
  try {
    const stored = localStorage.getItem('vq_autoplays');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Calculates list of dates when an event occurs between start date and target date representation
const getOccurrences = (
  startDateStr: string,
  lastProcessedStr: string | undefined,
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
): string[] => {
  const occurrences: string[] = [];
  const start = new Date(startDateStr);
  const now = new Date(); // Current date today (May 20, 2026)
  
  // Start calculating from either start date or the day after last processed date
  let current = new Date(start);
  if (lastProcessedStr) {
    const lastProcessed = new Date(lastProcessedStr);
    if (lastProcessed >= current) {
      current = new Date(lastProcessed);
      current.setDate(current.getDate() + 1);
    }
  }

  // Cap at today's calendar date so we don't schedule future transactions
  const todayCap = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  while (current <= todayCap) {
    occurrences.push(current.toISOString().split('T')[0]);
    
    if (frequency === 'Daily') {
      current.setDate(current.getDate() + 1);
    } else if (frequency === 'Weekly') {
      current.setDate(current.getDate() + 7);
    } else if (frequency === 'Monthly') {
      current.setMonth(current.getMonth() + 1);
    } else if (frequency === 'Yearly') {
      current.setFullYear(current.getFullYear() + 1);
    } else {
      break;
    }
  }

  return occurrences;
};

export const useAutoplayStore = create<AutoplayState>((set, get) => ({
  autoplayRules: getInitialRules(),

  addAutoplayRule: (rawRule) => set((state) => {
    const newRule: AutoplayRule = {
      ...rawRule,
      id: `autoplay-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      isActive: true,
      lastProcessedDate: undefined
    };
    const newRules = [newRule, ...state.autoplayRules];
    localStorage.setItem('vq_autoplays', JSON.stringify(newRules));
    
    // Auto process on create
    setTimeout(() => {
      get().processDueAutoplays();
    }, 50);

    return { autoplayRules: newRules };
  }),

  updateAutoplayRule: (id, updated) => set((state) => {
    const newRules = state.autoplayRules.map((rule) => 
      rule.id === id ? { ...rule, ...updated } : rule
    );
    localStorage.setItem('vq_autoplays', JSON.stringify(newRules));
    return { autoplayRules: newRules };
  }),

  deleteAutoplayRule: (id) => set((state) => {
    const newRules = state.autoplayRules.filter((rule) => rule.id !== id);
    localStorage.setItem('vq_autoplays', JSON.stringify(newRules));
    return { autoplayRules: newRules };
  }),

  toggleAutoplayActive: (id) => set((state) => {
    const newRules = state.autoplayRules.map((rule) => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    );
    localStorage.setItem('vq_autoplays', JSON.stringify(newRules));
    return { autoplayRules: newRules };
  }),

  processDueAutoplays: () => {
    const { autoplayRules } = get();
    if (autoplayRules.length === 0) return;

    let rulesUpdated = false;
    const nextRules = autoplayRules.map((rule) => {
      if (!rule.isActive) return rule;

      // Find due dates
      const datesToProcess = getOccurrences(rule.startDate, rule.lastProcessedDate, rule.frequency);
      if (datesToProcess.length === 0) return rule;

      rulesUpdated = true;
      const expensesStore = useExpensesStore.getState();
      const goalsStore = useGoalsStore.getState();

      datesToProcess.forEach((dateStr) => {
        // Add actual transaction to the ledger
        const transactionType = rule.type === 'income' ? 'income' : 'expense';
        expensesStore.addTransaction({
          amount: rule.amount,
          category: rule.category,
          notes: `[Autoplay: ${rule.title}]`,
          date: dateStr,
          paymentMethod: 'Bank Transfer',
          type: transactionType
        });

        // If it is regular systematic savings goals, find a goal to credit
        if (rule.type === 'savings') {
          // Look for any goal that matches the rule title or is active
          const activeGoals = goalsStore.goals;
          if (activeGoals.length > 0) {
            // Find a goal whose name matches or is similar, or just credit the first available goal
            const matchingGoal = activeGoals.find(g => g.name.toLowerCase().includes(rule.title.toLowerCase())) || activeGoals[0];
            if (matchingGoal) {
              goalsStore.updateGoalSavedAmount(matchingGoal.id, matchingGoal.savedAmount + rule.amount);
            }
          }
        }
      });

      return {
        ...rule,
        lastProcessedDate: datesToProcess[datesToProcess.length - 1]
      };
    });

    if (rulesUpdated) {
      localStorage.setItem('vq_autoplays', JSON.stringify(nextRules));
      set({ autoplayRules: nextRules });
    }
  },

  resetAll: () => {
    localStorage.setItem('vq_autoplays', JSON.stringify([]));
    set({ autoplayRules: [] });
  }
}));
