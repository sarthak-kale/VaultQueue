import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  User, 
  DollarSign, 
  Trash2, 
  RotateCcw, 
  Database,
  Lock,
  Compass,
  Briefcase,
  AlertOctagon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';

export default function SettingsView() {
  const { profile, updateProfile, clearAllData } = useFintech();

  // Settings State copies
  const [userName, setUserName] = useState(profile.name);
  const [userCurrency, setUserCurrency] = useState(profile.currency);
  const [userOccupation, setUserOccupation] = useState(profile.occupation);
  const [successSaved, setSuccessSaved] = useState(false);

  useEffect(() => {
    setUserName(profile.name);
    setUserCurrency(profile.currency);
    setUserOccupation(profile.occupation);
  }, [profile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: userName.trim(),
      currency: userCurrency,
      occupation: userOccupation.trim()
    });
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 2500);
  };

  const handleClear = () => {
    if (confirm('Are you absolutely certain you wish to wipe the offline database? This cannot be undone.')) {
      clearAllData();
      alert('Local storage financial indexes successfully expunged.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-left">
      {/* SUCCESS FLASH CARD */}
      <motion.div
        animate={successSaved ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        className={`p-4 rounded-xl border border-fin-success/30 bg-fin-success/5 flex items-center gap-3.5 ${successSaved ? 'block' : 'hidden'}`}
      >
        <CheckCircle2 className="h-5 w-5 text-fin-success" />
        <span className="text-xs text-white">Interactive system changes saved down to security context successfully.</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* PROFILE CARD SETUP */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-fin-card border border-fin-border/80 flex flex-col justify-between">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-fin-border/60">
              <User className="h-4.5 w-4.5 text-fin-accent" />
              <h4 className="font-display font-semibold text-sm text-white">Client Identity Settings</h4>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="settings-name-input"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Jean-Luc Picard"
                  className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-fin-accent"
                />
              </div>
            </div>

            {/* Occupation Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Profession / Position Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  id="settings-occupation-input"
                  type="text"
                  value={userOccupation}
                  onChange={(e) => setUserOccupation(e.target.value)}
                  placeholder="e.g. Lead Allocation quant"
                  className="w-full bg-fin-bg border border-fin-border rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-fin-accent"
                />
              </div>
            </div>

            {/* Currency Symbol Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary mb-1.5">
                Reporting Currency Denom
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['$', '€', '£', '₹', '¥'].map((sym) => (
                  <button
                    id={`currency-btn-${sym}`}
                    key={sym}
                    type="button"
                    onClick={() => setUserCurrency(sym)}
                    className={`py-3 rounded-xl border font-mono text-sm font-semibold transition cursor-pointer text-center ${
                      userCurrency === sym
                        ? 'border-fin-accent bg-fin-accent/10 text-white'
                        : 'border-fin-border bg-fin-bg hover:bg-fin-border/40 text-fin-text-secondary hover:text-white'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="settings-save-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-fin-accent hover:bg-blue-600 text-xs font-semibold text-white tracking-wide shadow-lg shadow-fin-accent/15 transition cursor-pointer"
            >
              Commit Identity Change
            </button>
          </form>
        </div>

        {/* DATABASE OPERATIONS CARD */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-fin-card border border-fin-border/80 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-fin-border/60">
              <Database className="h-4.5 w-4.5 text-orange-400" />
              <h4 className="font-display font-semibold text-sm text-white">Database Management</h4>
            </div>
            
            <p className="text-xs text-fin-text-secondary leading-relaxed">
              VaultQueue operates 100% locally on your computer using sandbox partition arrays. No cloud sync tunnels are used.
            </p>

            <div className="p-3.5 rounded-xl bg-[#161a24] border border-fin-border flex items-start gap-2.5">
              <Lock className="h-4 w-4 text-fin-accent mt-0.5 flex-shrink-0" />
              <div className="text-[10px] text-slate-400">
                <p className="font-semibold text-white uppercase tracking-wider">Device Level Decoupling</p>
                <p className="mt-0.5 leading-normal">Wiping browser cookies or storage variables triggers a complete workspace reset.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {/* Erase all data */}
              <button
                id="settings-erase-db"
                type="button"
                onClick={handleClear}
                className="w-full py-2.5 rounded-xl border border-fin-danger/20 bg-fin-danger/5 hover:bg-fin-danger/10 hover:border-fin-danger/40 text-xs text-fin-danger font-semibold transition cursor-pointer flex items-center justify-center gap-2 animate-pulse"
              >
                <Trash2 className="h-4 w-4" />
                Expunge Storage Array (Wipe)
              </button>
            </div>
          </div>

          <div className="pt-6 text-center text-[10px] text-slate-500 border-t border-fin-border/40 font-mono mt-6">
            VERSION V4.12 • SECURED SEC
          </div>
        </div>
      </div>
    </div>
  );
}
