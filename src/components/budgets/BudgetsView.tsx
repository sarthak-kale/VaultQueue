import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Trash2, 
  PlusCircle, 
  AlertTriangle, 
  HelpCircle, 
  Coins, 
  FileText,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';
import { CATEGORIES } from '../../utils/categories';
import { CategoryType, Budget } from '../../types';

export default function BudgetsView() {
  const { budgets, transactions, updateBudget, deleteBudget, profile } = useFintech();

  // Inputs
  const [category, setCategory] = useState<CategoryType>('Food');
  const [limit, setLimit] = useState<string>('');

  // Spending aggregation mapped by category
  const expenseSummary = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const tx of transactions) {
      totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
    }
    return totals;
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      alert('Kindly supply a valid positive budget limit.');
      return;
    }

    updateBudget({
      category,
      limit: parsedLimit
    });

    setLimit('');
  };

  // Build high quality remaining lists derived dynamically
  const budgetListWithStats = useMemo(() => {
    return budgets.map((b) => {
      const spent = expenseSummary[b.category] || 0;
      const remaining = b.limit - spent;
      const percentage = Math.min(100, Math.round((spent / b.limit) * 100)) || 0;
      const isExceeded = spent > b.limit;
      return {
        ...b,
        spent,
        remaining,
        percentage,
        isExceeded
      };
    });
  }, [budgets, expenseSummary]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: BUDGET SETUPS FORM */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-fin-card border border-fin-border/80 text-left h-fit">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-fin-border/60">
            <Target className="h-4.5 w-4.5 text-fin-accent" />
            <h4 className="font-display font-semibold text-sm text-white">Configure Target Bounds</h4>
          </div>
          <p className="text-xs text-fin-text-secondary leading-relaxed mb-6">
            Establish monthly categorical spending limits. VaultQueue automatically tracks your chronological transactions and alerts you if you cross active bounds.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Target Category
              </label>
              <select
                id="budget-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-fin-bg border border-fin-border rounded-xl py-3 px-3 text-xs text-white focus:outline-none focus:border-fin-accent cursor-pointer"
              >
                {Object.keys(CATEGORIES).map((key) => (
                  <option key={key} value={key} className="bg-fin-card text-white">
                    {key}
                  </option>
                ))}
              </select>
            </div>

            {/* Threshold Limit Value */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Monthly Threshold Limit ({profile.currency})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-fin-text-secondary">
                  <span className="text-xs font-mono">{profile.currency}</span>
                </div>
                <input
                  id="budget-limit-input"
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-fin-accent"
                />
              </div>
            </div>

            <button
              id="budget-submit-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-fin-accent hover:bg-blue-600 font-semibold text-xs text-white tracking-wide shadow-lg shadow-fin-accent/15 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              Establish Limit
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: ACTIVE BOUNDS VISUAL LIST */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-fin-card border border-fin-border/80 text-left">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-fin-border/40">
            <div>
              <h4 className="font-display font-semibold text-sm text-white">Active Financial Limits</h4>
              <p className="text-[11px] text-fin-text-secondary">Categories tracked in browser memory</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-900 border border-fin-border text-slate-400 px-2 py-0.5 rounded uppercase">
              {budgetListWithStats.length} limits Active
            </span>
          </div>

          <div className="space-y-6">
            {budgetListWithStats.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-[#1F2937] rounded-2xl bg-gradient-to-b from-[#111827]/10 to-[#111827]/30 p-8 group relative overflow-hidden">
                {/* Background graphic elements */}
                <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-fin-accent/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-fin-accent/5 blur-3xl pointer-events-none" />
                
                <div className="flex flex-col items-center max-w-sm mx-auto">
                  <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-[#1f2937] flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:border-fin-accent/40 group-hover:text-fin-accent transition-all duration-300 shadow-xl mb-5 relative">
                    <Target className="h-6 w-6" />
                    <svg className="absolute inset-0 w-full h-full animate-spin-slow text-fin-accent opacity-20" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 15" />
                    </svg>
                  </div>
                  
                  <h5 className="text-xs font-semibold text-white tracking-wide">Bounds Unregistered</h5>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Monthly spending limits prevent compounding overhead. Utilize the configuration panel on the left to establish categorical bounds in browser memory.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {budgetListWithStats.map((b) => {
                  const cm = CATEGORIES[b.category] || CATEGORIES.Other;
                  const BIcon = cm.icon;
                  
                  return (
                    <motion.div
                      id={`budget-card-${b.category}`}
                      key={b.category}
                      layout
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-5 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                        b.isExceeded 
                          ? 'border-fin-danger/30 bg-fin-danger/5 glow-red' 
                          : 'border-fin-border bg-fin-card/40 hover:border-slate-800'
                      }`}
                    >
                      {/* Floating Exceeded Alert Emblem */}
                      {b.isExceeded && (
                        <div className="absolute top-0 right-0 p-2.5 rounded-bl-xl bg-fin-danger text-white flex items-center justify-center shadow-lg animate-pulse">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${cm.color}`}>
                            <BIcon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white uppercase tracking-wider">{b.category}</h5>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Category Target</p>
                          </div>
                        </div>
                        
                        {!b.isExceeded && (
                          <button
                            id={`budget-delete-${b.category}`}
                            onClick={() => deleteBudget(b.category)}
                            className="h-7 w-7 rounded border border-fin-border hover:border-fin-danger hover:bg-fin-danger/10 text-fin-text-secondary hover:text-fin-danger transition flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Display Progress Metrics */}
                      <div className="mt-5 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-fin-text-secondary">Spending Index</span>
                          <span className={`font-semibold font-mono ${b.isExceeded ? 'text-fin-danger' : 'text-fin-success'}`}>
                            {b.percentage}%
                          </span>
                        </div>
                        
                        {/* Interactive dynamic progress progress slider bar */}
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-fin-border">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              b.isExceeded 
                                ? 'bg-fin-danger animate-pulse' 
                                : 'bg-gradient-to-r from-fin-accent to-blue-400'
                            }`}
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Numeric summary block */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-fin-border/60 text-[10px]">
                        <div className="text-left">
                          <p className="text-slate-500 font-mono uppercase tracking-wider">Limit</p>
                          <p className="font-semibold text-white mt-1">{profile.currency}{b.limit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-500 font-mono uppercase tracking-wider">Spent</p>
                          <p className="font-semibold text-white mt-1">{profile.currency}{b.spent.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-500 font-mono uppercase tracking-wider">Left</p>
                          <p className={`font-semibold mt-1 ${b.isExceeded ? 'text-fin-danger font-bold' : 'text-fin-success'}`}>
                            {b.isExceeded ? '-' : ''}{profile.currency}{Math.abs(b.remaining).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Exceed danger action text bar */}
                      {b.isExceeded && (
                        <div className="mt-4 pt-2 border-t border-fin-danger/20 flex justify-between items-center">
                          <span className="text-[9px] text-fin-danger font-semibold tracking-wide uppercase">Overspent Limit bounds!</span>
                          <button
                            id={`budget-delete-exceed-${b.category}`}
                            onClick={() => deleteBudget(b.category)}
                            className="text-[9px] text-fin-danger hover:underline font-mono uppercase font-bold cursor-pointer"
                          >
                            Remove Limit
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
