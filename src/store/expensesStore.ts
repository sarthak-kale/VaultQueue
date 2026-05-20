import { create } from 'zustand';
import { Transaction } from '../types';
import { useTransactionsStore } from './transactionsStore';

interface ExpensesState {
  transactions: Transaction[]; // Exposed for backwards compatibility in existing views
  expenseTransactions: Transaction[];
  totalExpenses: number;
  addTransaction: (tx: Omit<Transaction, 'id' | 'isSubscription' | 'subscriptionName'>) => void;
  deleteTransaction: (id: string) => void;
  setRawTransactions: (txs: Transaction[]) => void;
  resetAll: () => void;
}

export const useExpensesStore = create<ExpensesState>(() => {
  const initialTransactions = useTransactionsStore.getState().transactions;
  const initialExpenses = initialTransactions.filter(t => t.type !== 'income');
  const initialTotal = initialExpenses.reduce((acc, current) => acc + current.amount, 0);

  return {
    transactions: initialTransactions,
    expenseTransactions: initialExpenses,
    totalExpenses: initialTotal,

    addTransaction: (rawTx) => {
      useTransactionsStore.getState().addTransaction(rawTx);
    },

    deleteTransaction: (id) => {
      useTransactionsStore.getState().deleteTransaction(id);
    },

    setRawTransactions: (txs) => {
      useTransactionsStore.getState().setRawTransactions(txs);
    },

    resetAll: () => {
      useTransactionsStore.getState().resetAll();
    }
  };
});

// Reactively synchronize whenever transactionsStore changes
useTransactionsStore.subscribe((state) => {
  const expenses = state.transactions.filter(t => t.type !== 'income');
  const total = expenses.reduce((acc, current) => acc + current.amount, 0);
  useExpensesStore.setState({
    transactions: state.transactions,
    expenseTransactions: expenses,
    totalExpenses: total,
  });
});
export default useExpensesStore;
