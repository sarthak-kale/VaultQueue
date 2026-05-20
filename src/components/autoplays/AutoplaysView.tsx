import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Cpu,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Check,
  Info,
  Layers,
  Zap,
  RefreshCw,
  X
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';
import { AutoplayRule, CategoryType, AutoplayType } from '../../types';

const CATEGORIES: CategoryType[] = [
  'Food',
  'Shopping',
  'Bills',
  'Transport',
  'Health',
  'Entertainment',
  'Education',
  'Travel',
  'Other'
];

const AUTOPLAY_TYPES: { value: AutoplayType; label: string; icon: any; colorClass: string; bgClass: string }[] = [
  { value: 'income', label: 'Recurring Income', icon: TrendingUp, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10 border-emerald-500/20' },
  { value: 'expense', label: 'Recurring Expense', icon: TrendingDown, colorClass: 'text-red-400', bgClass: 'bg-red-500/10 border-red-500/20' },
  { value: 'subscription', label: 'Recurring Subscription', icon: Zap, colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10 border-amber-500/20' },
  { value: 'savings', label: 'Recurring Savings', icon: PiggyBank, colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10 border-blue-500/20' },
];

export default function AutoplaysView() {
  const { 
    autoplayRules, 
    addAutoplayRule, 
    updateAutoplayRule, 
    deleteAutoplayRule, 
    toggleAutoplayActive, 
    processDueAutoplays,
    profile 
  } = useFintech();

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoplayRule | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('Other');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<AutoplayType>('expense');

  // Trigger feedback
  const [isProcessing, setIsProcessing] = useState(false);
  const [processNotice, setProcessNotice] = useState(false);

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setTitle('');
    setAmount('');
    setCategory('Other');
    setFrequency('Monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule: AutoplayRule) => {
    setEditingRule(rule);
    setTitle(rule.title);
    setAmount(rule.amount.toString());
    setCategory(rule.category);
    setFrequency(rule.frequency);
    setStartDate(rule.startDate);
    setType(rule.type);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Please output accurate labels and currency ratios.');
      return;
    }

    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      frequency,
      startDate,
      type
    };

    if (editingRule) {
      updateAutoplayRule(editingRule.id, payload);
    } else {
      addAutoplayRule(payload);
    }
    setIsModalOpen(false);
  };

  const handleManualRun = () => {
    setIsProcessing(true);
    setTimeout(() => {
      processDueAutoplays();
      setIsProcessing(false);
      setProcessNotice(true);
      setTimeout(() => setProcessNotice(false), 3000);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-left">
      
      {/* HEADER BAR WITH MANUAL RUN OR ADD ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <h2 className="text-xl font-display font-black tracking-tight text-white flex items-center gap-2.5">
            <Cpu className="h-5 w-5 text-blue-400" />
            <span>Automated Autoplays Control</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Design systematic recurring structures that execute automatically while you are idle. Perfect for credit salary cycles, streaming subscriptions, and systematic investing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="autoplay-manual-run"
            onClick={handleManualRun}
            disabled={isProcessing}
            className="px-3.5 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 bg-[#111111]/40 text-xs font-semibold text-white tracking-wide transition cursor-pointer flex items-center gap-2 focus:outline-none"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Execute Queue</span>
          </button>
          
          <button
            id="autoplay-add-action"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-white/5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* REACTION TO MANUAL QUEUE FLUSH */}
      <AnimatePresence>
        {processNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center gap-2.5"
          >
            <Sparkles className="h-4 w-4 text-blue-400 text-sm animate-pulse" />
            <span className="text-[11px] text-blue-300">Automated queue processed successfully. Relevant date milestones have logged transactions securely.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE CONTENT LAYOUT */}
      {autoplayRules.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/[0.06] rounded-[2rem] bg-black/40 p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />
          
          <div className="h-14 w-14 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/5">
            <Cpu className="h-6 w-6 animate-pulse" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">No autoplay rules created.</h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[340px] leading-relaxed">
            There are currently no scheduled automation parameters. Establish salary credits, monthly licenses, or savings logs to automate indices.
          </p>
          <button
            id="autoplay-empty-add-btn"
            onClick={handleOpenAddModal}
            className="mt-5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Initialize First Automation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {autoplayRules.map((rule) => {
            const matchedType = AUTOPLAY_TYPES.find(t => t.value === rule.type) || AUTOPLAY_TYPES[1];
            const TypeIcon = matchedType.icon;
            
            return (
              <motion.div
                key={rule.id}
                layout
                className={`p-5 rounded-2xl bg-fin-card border transition-all relative overflow-hidden flex flex-col justify-between h-48 select-none ${
                  rule.isActive ? 'border-fin-border/80' : 'border-white/[0.02] opacity-60'
                }`}
              >
                {/* Visual Glow reflection inside card */}
                {rule.isActive && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent rounded-full pointer-events-none" />
                )}

                {/* Top Info row */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${matchedType.bgClass} ${matchedType.colorClass}`}>
                      <TypeIcon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-xs text-white truncate max-w-[130px]">{rule.title}</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{rule.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Active/Inactive state toggle */}
                    <button
                      id={`autoplay-toggle-${rule.id}`}
                      onClick={() => toggleAutoplayActive(rule.id)}
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center transition cursor-pointer focus:outline-none ${
                        rule.isActive 
                          ? 'border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                          : 'border-white/[0.04] bg-white/[0.02] text-slate-500 hover:border-slate-700 hover:text-white'
                      }`}
                      title={rule.isActive ? "Pause Automation" : "Resume Automation"}
                    >
                      {rule.isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    </button>

                    {/* Edit button */}
                    <button
                      id={`autoplay-edit-${rule.id}`}
                      onClick={() => handleOpenEditModal(rule)}
                      className="h-7 w-7 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      id={`autoplay-delete-${rule.id}`}
                      onClick={() => {
                        if (confirm(`Erase "${rule.title}" systematic automation action?`)) {
                          deleteAutoplayRule(rule.id);
                        }
                      }}
                      className="h-7 w-7 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 flex items-center justify-center transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amount Middle Block */}
                <div className="my-3.5 relative z-10 text-left">
                  <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase">Systematic Ratio</span>
                  <div className="text-xl font-display font-black text-white mt-0.5">
                    <span className={rule.type === 'income' ? 'text-emerald-400' : 'text-white'}>
                      {rule.type === 'income' ? '+' : '-'}{profile.currency}{rule.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Footer specs metadata */}
                <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 text-[9px] text-slate-500 font-mono relative z-10">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Interval: <strong className="text-white capitalize">{rule.frequency}</strong>
                  </span>
                  <span>
                    Last: <span className="text-white">{rule.lastProcessedDate ? rule.lastProcessedDate : 'Pending Run'}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODAL DRAWER DIALOG FOR ADD / EDIT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0e1015] border border-white/[0.08] p-6 rounded-2xl max-w-lg w-full relative z-10 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-5">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <Cpu className="h-4.5 w-4.5 text-blue-400" />
                  <span>{editingRule ? 'Edit Automated Autoplay' : 'Configure Autoplay Action'}</span>
                </h3>
                <button
                  id="close-autoplay-modal-btn"
                  onClick={() => setIsModalOpen(false)}
                  className="h-7 w-7 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* FORM ENGINE */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Autoplay Type Select */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Action Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AUTOPLAY_TYPES.map((t) => {
                      const Icon = t.icon;
                      const isSelected = type === t.value;
                      return (
                        <button
                          id={`form-type-btn-${t.value}`}
                          key={t.value}
                          type="button"
                          onClick={() => setType(t.value)}
                          className={`p-3.5 rounded-xl border flex flex-col items-center justify-between text-center transition cursor-pointer h-20 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500/10 text-white' 
                              : 'border-white/[0.04] bg-white/[0.01] text-slate-500 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 ${isSelected ? t.colorClass : ''}`} />
                          <span className="text-[8.5px] font-semibold tracking-tight mt-1 truncate w-full">{t.label.split(' ')[1]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Title / Label</label>
                  <input
                    id="autoplay-form-title"
                    type="text"
                    required
                    maxLength={32}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Netflix Subscription, Salary credit, SIP"
                    className="w-full bg-black/60 border border-white/[0.06] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Amount / Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Amount Ratios ({profile.currency})</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-xs font-mono">
                        {profile.currency}
                      </div>
                      <input
                        id="autoplay-form-amount"
                        type="number"
                        required
                        min="1"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full bg-black/60 border border-white/[0.06] focus:border-blue-500 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Category select */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Category Class</label>
                    <select
                      id="autoplay-form-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryType)}
                      className="w-full bg-black/60 border border-white/[0.06] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c} className="bg-[#0e1015]">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Frequency / Start Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Frequency select */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Execution Frequency</label>
                    <select
                      id="autoplay-form-frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/[0.06] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Daily" className="bg-[#0e1015]">Daily</option>
                      <option value="Weekly" className="bg-[#0e1015]">Weekly</option>
                      <option value="Monthly" className="bg-[#0e1015]">Monthly</option>
                      <option value="Yearly" className="bg-[#0e1015]">Yearly</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 font-mono">Start Schedule Date</label>
                    <input
                      id="autoplay-form-startdate"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-black/60 border border-white/[0.06] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="autoplay-submit-form"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-xs font-bold text-white transition tracking-wide cursor-pointer shadow-lg shadow-blue-500/15"
                >
                  {editingRule ? 'Save Changes' : 'Confirm Action'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
