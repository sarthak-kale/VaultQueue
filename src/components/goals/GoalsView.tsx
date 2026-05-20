import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  PiggyBank, 
  Trash2, 
  Plus, 
  Minus, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Target,
  PlusCircle,
  Gem
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';
import { SavingsGoal } from '../../types';

export default function GoalsView() {
  const { goals, addGoal, updateGoalSavedAmount, deleteGoal, profile } = useFintech();

  // Inputs
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  // Individual goal contribution input states map
  const [contributionAmounts, setContributionAmounts] = useState<Record<string, string>>({});

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(targetAmount);
    if (!name.trim()) {
      alert('Kindly declare a specific goal nickname.');
      return;
    }
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      alert('Declared budget objectives must be positive numerical volumes.');
      return;
    }

    addGoal({
      name: name.trim(),
      targetAmount: parsedTarget,
      deadline: deadline || new Date().toISOString().split('T')[0]
    });

    setName('');
    setTargetAmount('');
    setDeadline('');
  };

  const handleAdjustSaved = (id: string, currentSaved: number, target: number, isAddition: boolean) => {
    const inputVal = parseFloat(contributionAmounts[id]);
    if (isNaN(inputVal) || inputVal <= 0) {
      alert('Provide a valid numeric contribution amount.');
      return;
    }

    const valueChange = isAddition ? inputVal : -inputVal;
    const finalVal = Math.min(target, Math.max(0, currentSaved + valueChange));
    
    updateGoalSavedAmount(id, finalVal);

    // Clear contribution selector input
    setContributionAmounts(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ESTABLISH SAVINGS GOAL FORM */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-fin-card border border-fin-border/80 text-left h-fit">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-fin-border/60">
            <PiggyBank className="h-4.5 w-4.5 text-fin-success" />
            <h4 className="font-display font-semibold text-sm text-white">Declare Savings Goal</h4>
          </div>
          <p className="text-xs text-fin-text-secondary leading-relaxed mb-6">
            Earmark financial allowances for large-scale investments (Laptop, Bike, Emergency Reserves, Swiss Cabin retreats). Watch progress grow dynamically.
          </p>

          <form onSubmit={handleCreateGoal} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Goal Name / Asset Nickname
              </label>
              <input
                id="goal-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MacBook Pro, Vacation reserves"
                className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fin-accent"
              />
            </div>

            {/* Target objective amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Target Amount ({profile.currency})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-fin-text-secondary">
                  <span className="text-xs font-mono">{profile.currency}</span>
                </div>
                <input
                  id="goal-amount-input"
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-fin-accent"
                />
              </div>
            </div>

            {/* Target deadline */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Deadline Date
              </label>
              <input
                id="goal-deadline-input"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-fin-accent"
              />
            </div>

            <button
              id="goal-submit-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-fin-success hover:bg-emerald-600 font-semibold text-xs text-white tracking-wide shadow-lg shadow-fin-success/15 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              Build Savings Route
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: ACTIVE OBJECTIVES CANVAS */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-fin-card border border-fin-border/80 text-left">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-fin-border/40">
            <div>
              <h4 className="font-display font-semibold text-sm text-white">Active Savings Targets</h4>
              <p className="text-[11px] text-fin-text-secondary">Asset pipelines managed inside the secure profile</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-900 border border-fin-border text-slate-400 px-2 py-0.5 rounded uppercase">
              {goals.length} Goals
            </span>
          </div>

          <div className="space-y-6">
            {goals.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-[#1F2937] rounded-2xl bg-gradient-to-b from-[#111827]/10 to-[#111827]/30 p-8 group relative overflow-hidden">
                {/* Background glowing gradients */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-fin-success/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-fin-success/5 blur-3xl pointer-events-none" />
                
                <div className="flex flex-col items-center max-w-sm mx-auto">
                  <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-[#1f2937] flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:border-fin-success/40 group-hover:text-fin-success transition-all duration-300 shadow-xl mb-5 relative">
                    <PiggyBank className="h-6 w-6" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  
                  <h5 className="text-xs font-semibold text-white tracking-wide">No Active Trajectories</h5>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Set up specific targets (such as safety reserves, hardware pipelines, or future investments) using the panel on the left to structure systemic savings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {goals.map((g) => {
                  const percentage = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100)) || 0;
                  const isCompleted = g.savedAmount >= g.targetAmount;
                  const contributionValue = contributionAmounts[g.id] || '';

                  return (
                    <motion.div
                      id={`goal-card-${g.id}`}
                      key={g.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-5 rounded-xl border relative flex flex-col justify-between ${
                        isCompleted 
                          ? 'border-fin-success/30 bg-fin-success/5 glow-green' 
                          : 'border-fin-border bg-fin-card/40 hover:border-slate-800'
                      }`}
                    >
                      {/* Top Bar info */}
                      <div>
                        {/* Completed state badge */}
                        {isCompleted && (
                          <div className="absolute top-0 right-0 px-2.5 py-1 rounded-bl-lg bg-fin-success text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Completed
                          </div>
                        )}

                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${
                              isCompleted ? 'text-fin-success bg-fin-success/10 border-fin-success/25' : 'text-fin-accent bg-fin-accent/10 border-fin-accent/20'
                            }`}>
                              <Gem className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white truncate max-w-[150px]">{g.name}</h5>
                              <p className="text-[9px] text-slate-500 font-sans mt-0.5 max-w-[120px] truncate">Deadline: {g.deadline}</p>
                            </div>
                          </div>
                          
                          <button
                            id={`goal-delete-${g.id}`}
                            onClick={() => deleteGoal(g.id)}
                            className="h-7 w-7 rounded border border-fin-border hover:border-fin-danger hover:bg-fin-danger/10 text-fin-text-secondary hover:text-fin-danger transition flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Progress slider bar and percentages */}
                        <div className="mt-5 space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-fin-text-secondary">Funding Rate</span>
                            <span className="font-bold text-white font-mono">{percentage}%</span>
                          </div>

                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-fin-border">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ease-out bg-fin-success`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                            <span>{profile.currency}{g.savedAmount}</span>
                            <span>Target: {profile.currency}{g.targetAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contribution Quick Form (only if not completed) */}
                      {!isCompleted && (
                        <div className="mt-5 pt-3 border-t border-fin-border/60 flex items-center gap-2">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-fin-text-secondary">
                              <span className="text-[10px]">{profile.currency}</span>
                            </div>
                            <input
                              id={`goal-contrib-input-${g.id}`}
                              type="number"
                              min="1"
                              placeholder="Add"
                              value={contributionValue}
                              onChange={(e) => setContributionAmounts(prev => ({ ...prev, [g.id]: e.target.value }))}
                              className="w-full bg-fin-bg border border-fin-border rounded-lg py-1.5 pl-6 pr-1.5 text-[11px] text-white focus:outline-none"
                            />
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              id={`goal-deduct-${g.id}`}
                              title="Subtract money"
                              onClick={() => handleAdjustSaved(g.id, g.savedAmount, g.targetAmount, false)}
                              className="h-7 w-7 rounded-lg border border-fin-border bg-fin-card hover:bg-fin-border flex items-center justify-center text-fin-text-secondary hover:text-white transition cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <button
                              id={`goal-contrib-${g.id}`}
                              title="Allocate money"
                              onClick={() => handleAdjustSaved(g.id, g.savedAmount, g.targetAmount, true)}
                              className="h-7 w-7 rounded-lg bg-fin-success text-white flex items-center justify-center hover:bg-emerald-600 transition cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
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
