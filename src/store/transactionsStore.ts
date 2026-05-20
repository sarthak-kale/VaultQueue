import { create } from 'zustand';
import { Transaction } from '../types';
import { detectSubscription } from '../utils/subscriptionHelper';
import { useSettingsStore } from './settingsStore';

interface TransactionsState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'isSubscription' | 'subscriptionName'>) => void;
  deleteTransaction: (id: string) => void;
  setRawTransactions: (txs: Transaction[]) => void;
  resetAll: () => void;
}

const getInitialTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem('vq_transactions');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: getInitialTransactions(),

  addTransaction: (rawTx) => set((state) => {
    const tempTx: Transaction = {
      ...rawTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isSubscription: false,
      type: rawTx.type || 'expense'
    };

    if (tempTx.type === 'expense') {
      const subDetect = detectSubscription(tempTx);
      if (subDetect.isSub) {
        tempTx.isSubscription = true;
        tempTx.subscriptionName = subDetect.subName;

        const currency = useSettingsStore.getState().profile.currency;
        useSettingsStore.getState().addNotification({
          title: 'Subscription Detected',
          message: `Recurring payment for ${subDetect.subName} (${currency}${tempTx.amount.toFixed(2)}) has been detected and logged.`,
          type: 'info'
        });
      }
    }

    const newTransactions = [tempTx, ...state.transactions];
    localStorage.setItem('vq_transactions', JSON.stringify(newTransactions));
    return { transactions: newTransactions };
  }),

  deleteTransaction: (id) => set((state) => {
    const newTransactions = state.transactions.filter((t) => t.id !== id);
    localStorage.setItem('vq_transactions', JSON.stringify(newTransactions));
    return { transactions: newTransactions };
  }),

  setRawTransactions: (txs) => {
    localStorage.setItem('vq_transactions', JSON.stringify(txs));
    set({ transactions: txs });
  },

  resetAll: () => {
    localStorage.setItem('vq_transactions', JSON.stringify([]));
    set({ transactions: [] });
  }
}));
