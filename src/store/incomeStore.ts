import { create } from 'zustand';
import { Transaction } from '../types';
import { useTransactionsStore } from './transactionsStore';

interface IncomeState {
  incomeTransactions: Transaction[];
  totalIncome: number;
}

export const useIncomeStore = create<IncomeState>(() => {
  const initialTransactions = useTransactionsStore.getState().transactions;
  const initialIncome = initialTransactions.filter(t => t.type === 'income');
  const initialTotal = initialIncome.reduce((acc, current) => acc + current.amount, 0);

  return {
    incomeTransactions: initialIncome,
    totalIncome: initialTotal,
  };
});

// Reactively synchronize whenever transactionsStore changes
useTransactionsStore.subscribe((state) => {
  const incomes = state.transactions.filter(t => t.type === 'income');
  const total = incomes.reduce((acc, current) => acc + current.amount, 0);
  useIncomeStore.setState({
    incomeTransactions: incomes,
    totalIncome: total,
  });
});
