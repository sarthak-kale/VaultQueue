import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Trash2, 
  Filter, 
  SlidersHorizontal, 
  Clock, 
  CreditCard, 
  ArrowUpDown,
  Download,
  Plus
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';
import { CATEGORIES } from '../../utils/categories';
import { CategoryType } from '../../types';

export default function ExpensesView({ onOpenAddExpense }: { onOpenAddExpense: () => void }) {
  const { transactions, deleteTransaction, profile } = useFintech();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Multi-axis filtering logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch = tx.notes.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              tx.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
        const matchesMethod = selectedPaymentMethod === 'All' || tx.paymentMethod === selectedPaymentMethod;
        
        return matchesSearch && matchesCategory && matchesMethod;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, selectedCategory, selectedPaymentMethod, sortBy]);

  // Download CSV logic
  const downloadCSV = () => {
    if (filteredTransactions.length === 0) return;
    
    const headers = ['id', 'amount', 'category', 'notes', 'date', 'paymentMethod', 'isSubscription'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.amount,
      tx.category,
      `"${tx.notes.replace(/"/g, '""')}"`,
      tx.date,
      tx.paymentMethod,
      tx.isSubscription
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vaultqueue_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. CONTROLS WRAPPER PANEL */}
      <div className="p-5 rounded-2xl bg-fin-card border border-fin-border/80 text-left space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Financial Ledger Archives</h4>
            <p className="text-[11px] text-fin-text-secondary">Explore, audit, and analyze transaction logs locally</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* CSV Exporter */}
            <button
              id="export-csv-btn"
              onClick={downloadCSV}
              disabled={filteredTransactions.length === 0}
              className="px-4 py-2 rounded-xl border border-fin-border bg-fin-card hover:bg-fin-border text-xs font-semibold text-white transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              Export CSV
            </button>
            
            {/* Add Action button */}
            <button
              id="ledger-add-btn"
              onClick={onOpenAddExpense}
              className="px-4 py-2 rounded-xl bg-fin-accent hover:bg-blue-600 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              New Log
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search bar input with icon */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              id="ledger-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search descriptor or category..."
              className="w-full bg-fin-bg border border-fin-border rounded-xl py-2 pl-9.5 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fin-accent"
            />
          </div>

          {/* Category SELECT filter */}
          <div className="relative">
            <select
              id="ledger-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fin-accent cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              {Object.keys(CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment method SELECT filter */}
          <div>
            <select
              id="ledger-payment-select"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fin-accent cursor-pointer appearance-none"
            >
              <option value="All">All Settlement Pipeliness</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Crypto">Crypto</option>
            </select>
          </div>

          {/* Sorter */}
          <div>
            <select
              id="ledger-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fin-accent cursor-pointer appearance-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. CHRONOLOGICAL TRANSACTIONS GRID LIST */}
      <div className="p-1 rounded-2xl bg-fin-card border border-fin-border/80 text-left overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-fin-border bg-slate-900/40 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                <th className="px-6 py-4.5 text-left">Transaction Details</th>
                <th className="px-6 py-4.5 text-left">Category</th>
                <th className="px-6 py-4.5 text-left hidden md:table-cell">Settlement</th>
                <th className="px-6 py-4.5 text-left">Volume</th>
                <th className="px-6 py-4.5 text-right">Operation</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-fin-border/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 px-4">
                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto group">
                      <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-fin-border flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:border-fin-accent/40 group-hover:text-fin-accent transition-all duration-300 shadow-xl mb-5 relative">
                        <CreditCard className="h-6 w-6" />
                        <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full border border-slate-900 bg-fin-accent animate-ping" />
                      </div>
                      
                      <h5 className="text-[13px] font-semibold text-white tracking-wide">No Sequential Financial Logs Verified</h5>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        No transactions registered matching the current filters. Modify your search criteria or register a new expense to expand the archive.
                      </p>
                      
                      <div className="flex items-center gap-2.5 mt-5">
                        <button
                          onClick={onOpenAddExpense}
                          className="px-3.5 py-1.5 rounded-lg bg-fin-accent hover:bg-blue-600 text-[10px] text-white font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="h-3 w-3" /> Add First Log
                        </button>
                        
                        {(searchTerm !== '' || selectedCategory !== 'All' || selectedPaymentMethod !== 'All') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setSelectedCategory('All');
                              setSelectedPaymentMethod('All');
                            }}
                            className="px-3.5 py-1.5 rounded-lg border border-fin-border bg-slate-900/60 hover:bg-fin-border text-[10px] text-slate-300 font-semibold transition cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const cm = CATEGORIES[tx.category] || CATEGORIES.Other;
                  const TIcon = cm.icon;
                  const isIncome = tx.type === 'income';
                  
                  return (
                    <motion.tr
                      id={`transaction-row-${tx.id}`}
                      key={tx.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-900/30 transition-colors"
                    >
                      {/* Name & Date */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className={`h-8.5 w-8.5 rounded-lg border hidden sm:flex items-center justify-center ${isIncome ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : cm.color}`}>
                            <TIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white max-w-[140px] sm:max-w-xs truncate">
                                {tx.notes}
                              </span>
                              {tx.isSubscription && (
                                <span className="text-[8px] font-semibold bg-orange-400/10 border border-orange-400/20 text-orange-400 px-1 py-0.2 rounded font-mono">
                                  SUBSCRIBED
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-fin-text-secondary font-mono mt-0.5 block">
                              {tx.date}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Label */}
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-slate-900 text-white border-fin-border">
                          {tx.category}
                        </span>
                      </td>

                      {/* Settlement */}
                      <td className="px-6 py-4.5 hidden md:table-cell">
                        <span className="text-xs font-mono text-slate-400">
                          {tx.paymentMethod}
                        </span>
                      </td>

                      {/* Volume subtract */}
                      <td className="px-6 py-4.5">
                        <span className={`text-xs font-semibold font-mono ${isIncome ? 'text-emerald-400' : 'text-white'}`}>
                          {isIncome ? '+' : '-'}{profile.currency}{tx.amount.toFixed(2)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <button
                          id={`tx-delete-btn-${tx.id}`}
                          onClick={() => deleteTransaction(tx.id)}
                          className="h-7 w-7 rounded-md border border-fin-border hover:border-fin-danger hover:bg-fin-danger/10 flex items-center justify-center text-fin-text-secondary hover:text-fin-danger transition cursor-pointer ml-auto"
                          title="Delete Transaction"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger table pagination control lines */}
        <div className="px-6 py-4.5 bg-slate-900/20 border-t border-fin-border/60 flex items-center justify-between text-xs text-fin-text-secondary">
          <span>
            Displaying <span className="text-white font-medium">{filteredTransactions.length}</span> of <span className="text-white font-medium">{transactions.length}</span> overall ledger logs
          </span>
          <span className="font-mono text-[10px]">
            ALIGNED BY SECURE CLIENT CODES
          </span>
        </div>
      </div>
    </div>
  );
}
