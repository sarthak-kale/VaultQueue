import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Sparkles,
  PlusCircle,
  Plus,
  CreditCard,
  Percent,
  TrendingUp as ArrowUpRight,
  Layers,
  ArrowDownLeft
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';
import { useTransactionsStore } from '../../store/transactionsStore';
import { useIncomeStore } from '../../store/incomeStore';
import { useExpensesStore } from '../../store/expensesStore';
import { useBudgetStore } from '../../store/budgetStore';
import { useGoalsStore } from '../../store/goalsStore';
import { CATEGORIES } from '../../utils/categories';
import { getRunningSubscriptions } from '../../utils/subscriptionHelper';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardView({ 
  onOpenAddExpense, 
  setActiveTab 
}: { 
  onOpenAddExpense: () => void; 
  setActiveTab: (tab: any) => void 
}) {
  const { profile, loadSimulationData } = useFintech();

  // Dynamic subscriptions directly from centralized stores
  const transactions = useTransactionsStore((state) => state.transactions);
  const budgets = useBudgetStore((state) => state.budgets);
  const goals = useGoalsStore((state) => state.goals);

  // Read pre-calculated sums from income and expense stores reactively
  const totalIncome = useIncomeStore((state) => state.totalIncome);
  const totalExpenses = useExpensesStore((state) => state.totalExpenses);

  // Total balance starts clean at 0, reactive to input
  const currentBalance = totalIncome - totalExpenses;

  // Luxury 1.50% cashback computed strictly from card expenditures
  const cashBackAccumulated = useMemo(() => {
    return transactions.reduce((acc, current) => {
      if (current.type !== 'income' && current.paymentMethod === 'Card') {
        return acc + (current.amount * 0.015);
      }
      return acc;
    }, 0);
  }, [transactions]);

  const activeBudgetsCount = budgets.length;
  const activeGoalsCount = goals.length;

  const totalSavings = useMemo(() => {
    return goals.reduce((acc, goal) => acc + goal.savedAmount, 0);
  }, [goals]);

  // Exceeded monthly budget warnings
  const exceededBudgets = useMemo(() => {
    const catTotals: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type !== 'income') {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      }
    }
    return budgets.filter(b => (catTotals[b.category] || 0) > b.limit);
  }, [budgets, transactions]);

  // ----------------------------------------------------
  // 2. RECHARTS TIME-SERIES AND MATRIX DATA
  // ----------------------------------------------------
  
  const areaChartData = useMemo(() => {
    if (transactions.length === 0) return [];
    
    // Aggregate by date
    const grouped: Record<string, number> = {};
    for (const t of transactions) {
      grouped[t.date] = (grouped[t.date] || 0) + t.amount;
    }

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    let cumulativeTrack = 0;
    return sortedDates.map(date => {
      cumulativeTrack += grouped[date];
      const dObj = new Date(date);
      const formattedDate = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      return {
        rawDate: date,
        date: formattedDate,
        amount: parseFloat(grouped[date].toFixed(2)),
        cumulative: parseFloat(cumulativeTrack.toFixed(2))
      };
    });
  }, [transactions]);

  const pieChartData = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type !== 'income') {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    }

    return Object.keys(totals).map(catKey => {
      const categoryName = catKey as keyof typeof CATEGORIES;
      return {
        name: catKey,
        value: parseFloat(totals[categoryName].toFixed(2)),
        color: CATEGORIES[categoryName]?.hex || '#4B5563'
      };
    });
  }, [transactions]);

  const activeSubscriptions = useMemo(() => {
    return getRunningSubscriptions(transactions);
  }, [transactions]);

  const totalMonthlySubscriptionCost = useMemo(() => {
    return activeSubscriptions.reduce((acc, sub) => acc + sub.amount, 0);
  }, [activeSubscriptions]);

  const recentTransactions = useMemo(() => {
    return [...transactions].slice(0, 4);
  }, [transactions]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* EXCEEDED BUDGET OVERHEAD ALERT */}
      {exceededBudgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-3xl border border-red-500/10 bg-[#111111] flex items-start gap-4 shadow-[0_10px_30px_rgba(239,68,68,0.05)] relative overflow-hidden"
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-red-500" />
          <div className="h-9 w-9 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-xs font-semibold text-white tracking-wide">Liquidity Alert Panel</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Budget threshold overrun for category limits:{' '}
              {exceededBudgets.map((b, idx) => (
                <span key={b.category} className="font-mono text-white font-semibold">
                  {b.category} (Limit: {profile.currency}{b.limit}){idx !== exceededBudgets.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('Budgets')}
            className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#3B82F6] hover:text-white transition mt-1"
          >
            Adjust Bounds &rarr;
          </button>
        </motion.div>
      )}

      {/* CORE 7-COLUMN METRIC HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Balance Card */}
        <div className="p-4 rounded-2xl bg-[#111111]/85 border border-white/[0.04] text-left relative overflow-hidden flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase block">Balance</span>
          <h3 className="text-sm font-display font-black text-white mt-2">
            {profile.currency}{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Income Card */}
        <div className="p-4 rounded-2xl bg-[#111111]/85 border border-white/[0.04] text-left relative overflow-hidden flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase block">Income</span>
          <h3 className="text-sm font-display font-black text-emerald-400 mt-2">
            +{profile.currency}{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Expenses Card */}
        <div className="p-4 rounded-2xl bg-[#111111]/85 border border-white/[0.04] text-left relative overflow-hidden flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase block">Expenses</span>
          <h3 className="text-sm font-display font-black text-white mt-2">
            -{profile.currency}{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Savings Card */}
        <div className="p-4 rounded-2xl bg-[#111111]/85 border border-white/[0.04] text-left relative overflow-hidden flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase block">Savings</span>
          <h3 className="text-sm font-display font-black text-blue-400 mt-2">
            {profile.currency}{totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Budgets Count Card */}
        <div className="p-4 rounded-2xl bg-[#111111]/85 border border-white/[0.04] text-left relative overflow-hidden flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase block">Budgets</span>
          <h3 className="text-sm font-display font-black text-white mt-2">
            {activeBudgetsCount}
          </h3>
        </div>

        {/* Goals Count Card */}
        <div className="p-4 rounded-2xl bg-[#111111]/85 border border-white/[0.04] text-left relative overflow-hidden flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase block">Goals</span>
          <h3 className="text-sm font-display font-black text-white mt-2">
            {activeGoalsCount}
          </h3>
        </div>

        {/* Transactions Count Card */}
        <div className="p-4 rounded-2xl bg-[#111111]/85 border border-white/[0.04] text-left relative overflow-hidden flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">Transactions</span>
          <h3 className="text-sm font-display font-black text-white mt-2">
            {transactions.length}
          </h3>
        </div>
      </div>

      {/* ZERO DATA STATE - GREET WELCOME STATE */}
      {transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="p-8 rounded-[2rem] border border-dashed border-white/[0.06] bg-[#111111]/30 text-center relative overflow-hidden flex flex-col items-center justify-center select-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="h-12 w-12 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 mb-4 shadow" style={{ pointerEvents: 'none' }}>
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">No financial records yet.</h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[340px] leading-relaxed">
            Record your first transaction or establish a savings goal to unlock automatic asset dispersion analysis.
          </p>
          <div className="flex items-center gap-3 mt-5 flex-wrap justify-center relative z-10">
            <button
              id="dash-zero-add-expense"
              onClick={onOpenAddExpense}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-title font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> <span>Add your first transaction</span>
            </button>
            <button
              id="dash-zero-create-goal"
              onClick={() => setActiveTab('Goals')}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 bg-white/[0.02] text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <PiggyBank className="h-3.5 w-3.5 text-blue-400" /> <span>Create your first goal</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* DUAL CORE SECTION: PREMIUM WALLET CARD (iOS DOCK SYNERGY) & METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LARGE BLACK-GLOSS WALLET CARD (iOS / APPLE WALLET STYLE) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 rounded-[2.25rem] bg-gradient-to-br from-[#1c1c1e] to-[#0c0c0d] p-8 border border-[rgba(255,255,255,0.08)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] flex flex-col justify-between relative overflow-hidden group select-none cursor-pointer"
          whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Diagonal Glass Reflection Sweep */}
          <motion.div
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full pointer-events-none"
            animate={{ x: ['100%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear', repeatDelay: 4 }}
          />

          {/* Glowing blue backlighting */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-blue-500/10 via-[#8B5CF6]/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-60" />

          {/* Top Bar inside card */}
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase">PREMIUM ACCOUNT</span>
              <h4 className="text-xs font-semibold text-white tracking-wide mt-1">{profile.name || 'Alexander Sterling'}</h4>
            </div>
            {/* MasterCard overlap circles */}
            <div className="flex -space-x-3.5 opacity-90">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/75 blur-[0.3px]" />
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/75 blur-[0.3px]" />
            </div>
          </div>

          {/* Simulated Chip + Contactless Wave */}
          <div className="flex items-center gap-3.5 my-8 relative z-10">
            {/* Minimalist Microchip */}
            <div className="w-10 h-7 rounded-md bg-gradient-to-r from-[#D4AF37]/40 via-[#F3E5AB]/40 to-[#AA7C11]/40 border border-amber-500/30 flex flex-col justify-between p-1.5 opacity-80">
              <div className="grid grid-cols-3 gap-0.5 h-1">
                <div className="border-[0.5px] border-amber-500/20" /><div className="border-[0.5px] border-amber-500/20" /><div className="border-[0.5px] border-amber-500/20" />
              </div>
              <div className="grid grid-cols-3 gap-0.5 h-2">
                <div className="border-[0.5px] border-amber-500/20" /><div className="border-[0.5px] border-amber-500/10 bg-amber-400/20 rounded-sm" /><div className="border-[0.5px] border-amber-500/20" />
              </div>
            </div>
            {/* Contactless symbol */}
            <svg className="w-4 h-4 text-[#A1A1AA] opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Balance display */}
          <div className="relative z-10 text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]">AVAILABLE METRIC</span>
            <div className="flex items-baseline mt-1.5">
              <span className="text-3xl font-display font-black text-white tracking-tight">
                {profile.currency}{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)] text-[9px] text-slate-500 font-mono">
              <span>•••• •••• •••• 8690</span>
              <span className="tracking-widest">WORLD ELITE</span>
            </div>
          </div>
        </motion.div>

        {/* 4 MODERN LUXURY METRICS PANEL (Budget, CashBack, Spending, Trajectories) */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-5 items-stretch">
          
          {/* Spend Meter Card */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-[1.75rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase">OUTFLOW</span>
                <h4 className="text-xs font-semibold text-white tracking-wide mt-0.5">Monthly Burn</h4>
              </div>
              <div className="h-8 w-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-display font-bold text-white tracking-tight">
                {profile.currency}{totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </h3>
              <p className="text-[9.5px] text-[#A1A1AA] mt-1">Total chronological outflow logs</p>
            </div>
          </motion.div>

          {/* Cashback Meter (Premium dynamic value) */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-[1.75rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase">DIVIDENDS</span>
                <h4 className="text-xs font-semibold text-white tracking-wide mt-0.5">Cashback Recoup</h4>
              </div>
              <div className="h-8 w-8 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-display font-bold text-[#10B981] tracking-tight">
                {profile.currency}{cashBackAccumulated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-[9.5px] text-[#A1A1AA] mt-1">1.50% allocation computed on Card checkouts</p>
            </div>
          </motion.div>

          {/* Mapped Budgets Limit Status */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-[1.75rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase">CONSTRAINTS</span>
                <h4 className="text-xs font-semibold text-white tracking-wide mt-0.5">Active Budgets</h4>
              </div>
              <div className="h-8 w-8 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-display font-bold text-white tracking-tight">
                {activeBudgetsCount} <span className="text-xs text-slate-500 font-normal">Active Categories</span>
              </h3>
              <div className="h-1 w-full bg-neutral-900 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#8B5CF6] rounded-full" 
                  style={{ width: `${activeBudgetsCount > 0 ? Math.min(100, activeBudgetsCount * 20) : 0}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Goal trajectories */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-[1.75rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase">ACCUMULATION</span>
                <h4 className="text-xs font-semibold text-white tracking-wide mt-0.5">Savings Pipelines</h4>
              </div>
              <div className="h-8 w-8 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                <PiggyBank className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-display font-bold text-white tracking-tight">
                {activeGoalsCount} <span className="text-xs text-slate-500 font-normal">Targets Mapped</span>
              </h3>
              <div className="h-1 w-full bg-neutral-900 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${activeGoalsCount > 0 ? Math.min(100, activeGoalsCount * 25) : 0}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* QUICK ACTION GLASS TILES GRID (MODAL / NAV DIRECTIVES) */}
      <div className="p-6 rounded-[2rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left">
        <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-4">WORKSPACE ACCELERATORS</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Quick Record Outflow */}
          <button
            onClick={onOpenAddExpense}
            className="p-4 rounded-2xl bg-black border border-[rgba(255,255,255,0.04)] hover:border-[#3B82F6]/40 text-left transition flex flex-col items-start justify-between h-24 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-105 transition">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-3">Add Outflow</span>
          </button>

          {/* Quick Record Income */}
          <button
            onClick={onOpenAddExpense}
            className="p-4 rounded-2xl bg-black border border-[rgba(255,255,255,0.04)] hover:border-[#10B981]/40 text-left transition flex flex-col items-start justify-between h-24 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-3">Add Income</span>
          </button>

          {/* Budgets Tab Redirect */}
          <button
            onClick={() => setActiveTab('Budgets')}
            className="p-4 rounded-2xl bg-black border border-[rgba(255,255,255,0.04)] hover:border-[#8B5CF6]/40 text-left transition flex flex-col items-start justify-between h-24 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#8B5CF6] group-hover:scale-105 transition">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-3">Edit Limits</span>
          </button>

          {/* Goals Redirect */}
          <button
            onClick={() => setActiveTab('Goals')}
            className="p-4 rounded-2xl bg-black border border-[rgba(255,255,255,0.04)] hover:border-blue-500/40 text-left transition flex flex-col items-start justify-between h-24 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
              <PiggyBank className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-3">Goals Trajectory</span>
          </button>

          {/* PDF Audit / Statement Redirect */}
          <button
            onClick={() => setActiveTab('Reports')}
            className="p-4 rounded-2xl bg-black border border-[rgba(255,255,255,0.04)] hover:border-amber-500/40 text-left transition flex flex-col items-start justify-between h-24 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-3">SaaS Statement</span>
          </button>

          {/* Workspace Settings Redirect */}
          <button
            onClick={() => setActiveTab('Settings')}
            className="p-4 rounded-2xl bg-black border border-[rgba(255,255,255,0.04)] hover:border-white/20 text-left transition flex flex-col items-start justify-between h-24 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-zinc-800 flex items-center justify-center text-slate-300 group-hover:scale-105 transition">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-3">Preferences</span>
          </button>

        </div>
      </div>

      {/* RECHARTS PLOTS COMPONENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Balance Line Curved Charts */}
        <div className="lg:col-span-8 p-6 rounded-[2rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">Chronological Expenditure Trend</h4>
              <p className="text-[10.5px] text-[#A1A1AA] mt-0.5">Dynamic balance curvatures and transaction aggregation</p>
            </div>
            <span className="text-[9px] font-mono bg-white/[0.04] text-white px-2 py-0.5 border border-white/10 rounded uppercase font-bold">
              REALTIME VECTOR
            </span>
          </div>

          <div className="h-64 w-full">
            {areaChartData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center border border-dashed border-[rgba(255,255,255,0.06)] rounded-2xl bg-black/40 text-center p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.02]" />
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-white/[0.02]" />
                <div className="absolute inset-y-0 left-2/3 w-[1px] bg-white/[0.02]" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,80 Q25,80 50,80 T100,80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-11 w-11 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-3.5 shadow-lg shadow-blue-500/5 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-5 w-5 animate-pulse" />
                  </div>
                  <h5 className="text-xs font-semibold text-white tracking-wide font-sans">No analytics available yet.</h5>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[280px] leading-relaxed">
                    Your analytics will appear here as soon as transaction records register.
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientSpentColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#4B5563" 
                    fontSize={9}
                    tickLine={false}
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#4B5563" 
                    fontSize={9} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${profile.currency}${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '11px',
                    }}
                    formatter={(value: any) => [`${profile.currency}${value}`, 'Spent']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#gradientSpentColor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense Category Pie Distribution */}
        <div className="lg:col-span-4 p-6 rounded-[2rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">Category Matrix</h4>
            <p className="text-[10.5px] text-[#A1A1AA] mt-0.5">Asset dispersion ratio</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative my-4">
            {pieChartData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center border border-dashed border-[rgba(255,255,255,0.06)] rounded-2xl bg-black/40 text-center p-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.04),transparent_70%)] pointer-events-none" />
                <div className="h-24 w-24 rounded-full border border-dashed border-white/[0.04] flex items-center justify-center relative animate-spin-slow">
                  <div className="h-16 w-16 rounded-full border border-dashed border-white/[0.06] flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/15" />
                  </div>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 select-none">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#8B5CF6] mb-1.5 shadow-md">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h5 className="text-[10px] font-semibold text-white tracking-tight">No analytics available yet.</h5>
                  <p className="text-[8.5px] text-slate-400 mt-0.5 max-w-[150px] leading-tight">
                    Your analytics will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '11px',
                    }}
                    formatter={(value: any) => [`${profile.currency}${value}`, 'Allocated']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Total Overlay inside Center */}
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-[8px] uppercase tracking-wider text-slate-500">AGGREGUATE</span>
              <span className="text-sm font-bold text-white font-display mt-0.5">
                {profile.currency}{totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center max-h-16 overflow-y-auto pt-2 border-t border-[rgba(255,255,255,0.04)]">
            {pieChartData.length === 0 ? (
              <span className="text-[9px] text-slate-600 font-mono">No Categorical Dispensation Computed</span>
            ) : (
              pieChartData.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1 text-[9px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="truncate">{p.name}: {profile.currency}{p.value.toFixed(0)}</span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* LEDGER ARCHIVES & SAAS SPENDING CHECKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ledger Subset */}
        <div className="lg:col-span-6 p-6 rounded-[2rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[rgba(255,255,255,0.04)]">
            <div>
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">Ledger Pipeline</h4>
              <p className="text-[10.5px] text-[#A1A1AA] mt-0.5">Live chronological checkout feeds</p>
            </div>
            <button
              onClick={() => setActiveTab('Transactions')}
              className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer font-mono font-bold uppercase"
            >
              Examine ALL &rarr;
            </button>
          </div>

          <div className="space-y-2.5 flex-grow">
            {recentTransactions.length === 0 ? (
              <div className="py-14 flex flex-col items-center justify-center text-center border border-dashed border-white/[0.04] rounded-2xl bg-black/25 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.03),transparent_75%)] pointer-events-none" />
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-center text-slate-500 mb-3 group-hover:scale-105 transition-transform">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h5 className="text-[11px] font-semibold text-white tracking-wide">Ledger Pipeline Inactive</h5>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[210px] leading-normal">
                  Chronological checkout flows will populate real-time indicators instantly once registered.
                </p>
                <button
                  onClick={onOpenAddExpense}
                  className="mt-4 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Record Outflow
                </button>
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const cm = CATEGORIES[tx.category] || CATEGORIES.Other;
                const TIcon = cm.icon;
                const isIncome = tx.type === 'income';
                return (
                  <div key={tx.id} className="p-3 rounded-2xl border border-[rgba(255,255,255,0.04)] bg-black/30 hover:bg-neutral-900/40 transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${isIncome ? 'border-emerald-500/10 bg-emerald-500/5 text-[#10B981]' : cm.color}`}>
                        <TIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-white truncate max-w-[130px] sm:max-w-xs">{tx.notes}</h5>
                        <p className="text-[9.5px] text-[#A1A1AA] font-mono mt-0.5">{tx.date} • {tx.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold font-mono ${isIncome ? 'text-[#10B981]' : 'text-white'}`}>
                        {isIncome ? '+' : '-'}{profile.currency}{tx.amount.toFixed(0)}
                      </span>
                      {tx.isSubscription && (
                        <div className="text-[7.5px] bg-orange-400/10 border border-orange-400/20 text-orange-400 px-1 py-0.2 rounded font-mono mt-0.5 uppercase">Recurring</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Smart Subscription scanning + Savings goals combined */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          
          {/* Subscription widget */}
          <div className="p-6 rounded-[2rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex-1 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 pb-2 border-b border-[rgba(255,255,255,0.04)]">
              <div>
                <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-orange-400" />
                  SaaS Oracle Scanning
                </h4>
                <p className="text-[10.5px] text-[#A1A1AA] mt-0.5">Keyword subscription isolation scans</p>
              </div>
              <span className="text-[9px] font-mono bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded border border-orange-400/20 font-bold">
                {activeSubscriptions.length} DETECTED
              </span>
            </div>

            {activeSubscriptions.length === 0 ? (
              <div className="p-4 rounded-2xl bg-black/20 border border-dashed border-[rgba(255,255,255,0.06)] flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center text-orange-400">
                  <ShieldCheck className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">System Monitoring Active</h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Keyword parser scans description values (like Netflix, Prime, Slack, or Spotify) automatically to extract licensing burn rates.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSubscriptions.map((sub, i) => (
                    <div key={i} className="p-3 rounded-xl border border-[rgba(255,255,255,0.04)] bg-black/40 flex items-center justify-between">
                      <div>
                        <h6 className="text-xs font-semibold text-white">{sub.name}</h6>
                        <p className="text-[8.5px] text-[#A1A1AA] mt-0.5">Billing active</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">-{profile.currency}{sub.amount.toFixed(0)}/mo</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-2xl bg-black border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Total Committed SaaS Overhead</span>
                  <span className="font-mono font-bold text-white">{profile.currency}{totalMonthlySubscriptionCost.toFixed(0)}/month</span>
                </div>
              </div>
            )}
          </div>

          {/* Goal tracker allocator progress widget */}
          <div className="p-6 rounded-[2rem] bg-[#111111] border border-[rgba(255,255,255,0.06)] text-left flex-1">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[rgba(255,255,255,0.04)]">
              <div>
                <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">Target Reserves</h4>
                <p className="text-[10.5px] text-[#A1A1AA] mt-0.5">Allocated structural progress</p>
              </div>
              <button
                onClick={() => setActiveTab('Goals')}
                className="text-[10px] text-blue-400 hover:underline uppercase font-mono font-bold"
              >
                Board &rarr;
              </button>
            </div>

            <div className="space-y-3.5 pt-1">
              {goals.length === 0 ? (
                <div className="py-6 flex flex-col items-center justify-center text-center border border-dashed border-white/[0.04] rounded-2xl bg-black/20 p-4">
                  <PiggyBank className="h-5 w-5 text-slate-600 mb-1.5 animate-pulse" />
                  <span className="text-[10px] font-semibold text-white text-center">No Tiers Established</span>
                  <p className="text-[8.5px] text-slate-500 mt-0.5 max-w-[180px] leading-tight">
                    Establish visual goals within the savings system to monitor accumulation indices.
                  </p>
                </div>
              ) : (
                goals.slice(0, 2).map((g) => {
                  const percentage = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100)) || 0;
                  return (
                    <div key={g.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{g.name}</span>
                        <span className="font-bold text-[#10B981] font-mono">{percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-[rgba(255,255,255,0.06)]">
                        <div 
                          className="h-full rounded-full bg-[#10B981] transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-[#A1A1AA]">
                        <span>Accumulated: {profile.currency}{g.savedAmount.toLocaleString()}</span>
                        <span>Goal: {profile.currency}{g.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
