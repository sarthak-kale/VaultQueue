import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, Calendar, FileText, CreditCard, Layers } from 'lucide-react';
import { useFintech } from '../../context/FintechContext';
import { CategoryType } from '../../types';
import { CATEGORIES } from '../../utils/categories';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const { addTransaction, profile } = useFintech();

  // Form Fields
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Bank Transfer' | 'Crypto'>('Card');

  // Load today's date on active open
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setAmount('');
      setCategory('Food');
      setNotes('');
      setPaymentMethod('Card');
      setTransactionType('expense');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please state a valid positive numerical amount.');
      return;
    }
    if (!notes.trim()) {
      alert('Kindly supply brief transaction notes for context.');
      return;
    }

    addTransaction({
      amount: parsedAmount,
      category,
      notes: notes.trim(),
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod,
      type: transactionType
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Layer */}
          <motion.div
            id="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            id="modal-container"
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="relative w-full max-w-lg rounded-2xl border border-fin-border bg-fin-card p-6 shadow-2xl z-10 text-left overflow-hidden glow-blue"
          >
            {/* Top Close */}
            <div className="flex justify-between items-center pb-4 border-b border-fin-border/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-fin-accent animate-pulse" />
                <h3 className="font-display font-semibold text-base text-white">Record Transaction</h3>
              </div>
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="h-8 w-8 rounded-lg border border-fin-border flex items-center justify-center text-fin-text-secondary hover:text-white hover:bg-fin-border/40 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Transaction Type Segment Switch */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                  Flow Type
                </label>
                <div className="grid grid-cols-2 gap-2 bg-fin-bg p-1 rounded-xl border border-fin-border">
                  <button
                    id="type-select-expense"
                    type="button"
                    onClick={() => setTransactionType('expense')}
                    className={`py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition cursor-pointer text-center ${
                      transactionType === 'expense'
                        ? 'bg-fin-danger/25 border border-fin-danger/40 text-red-300'
                        : 'text-fin-text-secondary hover:text-white'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    id="type-select-income"
                    type="button"
                    onClick={() => setTransactionType('income')}
                    className={`py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition cursor-pointer text-center ${
                      transactionType === 'income'
                        ? 'bg-fin-success/25 border border-fin-success/40 text-emerald-300'
                        : 'text-fin-text-secondary hover:text-white'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                  Amount ({profile.currency})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-fin-text-secondary">
                    <span className="text-base font-medium">{profile.currency}</span>
                  </div>
                  <input
                    id="input-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-fin-bg border border-fin-border rounded-xl py-3 pl-9 pr-4 text-white text-base font-semibold focus:outline-none focus:border-fin-accent tracking-wide"
                  />
                </div>
              </div>

              {/* Grid Fields: Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Select */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                    Category
                  </label>
                  <select
                    id="select-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full bg-fin-bg border border-fin-border rounded-xl py-3 px-3 text-sm text-white focus:outline-none focus:border-fin-accent cursor-pointer"
                  >
                    {Object.keys(CATEGORIES).map((key) => (
                      <option key={key} value={key} className="bg-fin-card text-white">
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Select */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      id="input-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-fin-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Notes Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                  Notes / Merchant Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 pt-3 pointer-events-none text-fin-text-secondary">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="input-notes"
                    type="text"
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Netflix Premium, Whole Foods checkout"
                    className="w-full bg-fin-bg border border-fin-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fin-accent"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tip: Include <span className="text-orange-400">Netflix</span>, <span className="text-orange-400">Spotify</span>, <span className="text-orange-400">Prime</span>, or <span className="text-orange-400">YouTube</span> to trigger the Smart Subscription Detector.
                </p>
              </div>

              {/* Payment Method Group */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                  Settlement Pipeline
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Card', 'Cash', 'Bank Transfer', 'Crypto'] as const).map((method) => (
                    <button
                      id={`payment-method-selector-${method}`}
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-xl text-xs font-medium border transition cursor-pointer text-center ${
                        paymentMethod === method
                          ? 'border-fin-accent bg-fin-accent/10 text-white'
                          : 'border-fin-border bg-fin-bg hover:bg-fin-border/40 text-fin-text-secondary hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-fin-border/60">
                <button
                  id="modal-cancel-btn"
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-fin-border hover:bg-fin-border/40 text-sm text-fin-text-secondary hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="modal-submit-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-fin-accent hover:bg-blue-600 text-sm text-white font-semibold transition shadow-lg shadow-fin-accent/15 cursor-pointer"
                >
                  Confirm Log
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
