import { create } from 'zustand';

interface ReportsState {
  selectedPeriod: 'Monthly' | 'Weekly' | 'Yearly';
  customReportNotes: string;
  setSelectedPeriod: (period: 'Monthly' | 'Weekly' | 'Yearly') => void;
  setCustomReportNotes: (notes: string) => void;
  resetAll: () => void;
}

const getInitialPeriod = (): 'Monthly' | 'Weekly' | 'Yearly' => {
  try {
    const stored = localStorage.getItem('vq_reports_period');
    return (stored as any) || 'Monthly';
  } catch {
    return 'Monthly';
  }
};

const getInitialNotes = (): string => {
  try {
    const stored = localStorage.getItem('vq_reports_notes');
    return stored || '';
  } catch {
    return '';
  }
};

export const useReportsStore = create<ReportsState>((set) => ({
  selectedPeriod: getInitialPeriod(),
  customReportNotes: getInitialNotes(),

  setSelectedPeriod: (period) => {
    localStorage.setItem('vq_reports_period', period);
    set({ selectedPeriod: period });
  },

  setCustomReportNotes: (notes) => {
    localStorage.setItem('vq_reports_notes', notes);
    set({ customReportNotes: notes });
  },

  resetAll: () => {
    localStorage.removeItem('vq_reports_period');
    localStorage.removeItem('vq_reports_notes');
    set({ selectedPeriod: 'Monthly', customReportNotes: '' });
  }
}));
