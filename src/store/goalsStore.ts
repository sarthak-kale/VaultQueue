import { create } from 'zustand';
import { SavingsGoal } from '../types';
import { useSettingsStore } from './settingsStore';

interface GoalsState {
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => void;
  updateGoalSavedAmount: (id: string, savedAmount: number) => void;
  deleteGoal: (id: string) => void;
  setRawGoals: (goals: SavingsGoal[]) => void;
  resetAll: () => void;
}

const getInitialGoals = (): SavingsGoal[] => {
  try {
    const stored = localStorage.getItem('vq_goals');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: getInitialGoals(),

  addGoal: (goal) => set((state) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      savedAmount: 0
    };
    const newGoals = [...state.goals, newGoal];
    localStorage.setItem('vq_goals', JSON.stringify(newGoals));

    const currency = useSettingsStore.getState().profile.currency;
    useSettingsStore.getState().addNotification({
      title: 'Savings Goal Established',
      message: `New goal "${goal.name}" set with objective of ${currency}${goal.targetAmount}.`,
      type: 'success'
    });

    return { goals: newGoals };
  }),

  updateGoalSavedAmount: (id, savedAmount) => set((state) => {
    let triggeredCongrats = false;
    const newGoals = state.goals.map((g) => {
      if (g.id === id) {
        const updated = { ...g, savedAmount: Math.max(0, savedAmount) };
        if (updated.savedAmount >= updated.targetAmount && g.savedAmount < g.targetAmount) {
          triggeredCongrats = true;
        }
        return updated;
      }
      return g;
    });

    localStorage.setItem('vq_goals', JSON.stringify(newGoals));

    if (triggeredCongrats) {
      const g = state.goals.find((goal) => goal.id === id);
      if (g) {
        const currency = useSettingsStore.getState().profile.currency;
        useSettingsStore.getState().addNotification({
          title: `Goal Reached! 🥳`,
          message: `Incredible! You have fully raised ${currency}${g.targetAmount} for your "${g.name}" goal.`,
          type: 'success'
        });
      }
    }

    return { goals: newGoals };
  }),

  deleteGoal: (id) => set((state) => {
    const newGoals = state.goals.filter((g) => g.id !== id);
    localStorage.setItem('vq_goals', JSON.stringify(newGoals));
    return { goals: newGoals };
  }),

  setRawGoals: (goals) => {
    localStorage.setItem('vq_goals', JSON.stringify(goals));
    set({ goals });
  },

  resetAll: () => {
    localStorage.setItem('vq_goals', JSON.stringify([]));
    set({ goals: [] });
  }
}));
