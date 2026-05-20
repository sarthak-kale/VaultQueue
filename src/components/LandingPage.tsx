import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Shield, 
  Cpu, 
  ArrowRight, 
  PieChart as PieIcon, 
  Activity, 
  DollarSign, 
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  // Stagger helper for animated grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 } 
    }
  };

  return (
    <div className="relative min-h-screen bg-fin-bg text-fin-text-primary overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fin-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      {/* Navigation Header */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fin-accent to-blue-600 flex items-center justify-center shadow-lg shadow-fin-accent/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white">
            VAULT<span className="text-fin-accent">QUEUE</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-sm text-fin-text-secondary hover:text-white transition cursor-pointer hidden md:inline">Features</span>
          <span className="text-sm text-fin-text-secondary hover:text-white transition cursor-pointer hidden md:inline">Security</span>
          <span className="text-sm text-fin-text-secondary hover:text-white transition cursor-pointer hidden md:inline">Architecture</span>
          <button 
            id="landing-signin-btn"
            onClick={onEnterApp}
            className="px-5 py-2.5 rounded-xl border border-fin-border bg-fin-card hover:bg-fin-border text-white text-sm font-medium transition duration-200 cursor-pointer flex items-center gap-1.5"
          >
            Launch App
            <ArrowRight className="h-4 w-4 text-fin-accent" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fin-accent/10 border border-fin-accent/20 text-xs text-fin-accent font-medium mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Premium FinTech Asset Management Client</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white"
          >
            Take Control of Your <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-fin-accent bg-clip-text text-transparent">
              Financial Future
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg text-fin-text-secondary leading-relaxed max-w-xl"
          >
            VaultQueue is a highly polished offline-first analytics workspace. Engineered for instant budget design, subscription detection, and custom savings tracking—operating purely on ultra-secure client-side encryption.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              id="landing-hero-cta"
              onClick={onEnterApp}
              className="px-8 py-4 rounded-xl bg-fin-accent hover:bg-blue-600 text-white font-medium shadow-xl shadow-fin-accent/20 transition duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              Start Tracking Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              id="landing-hero-secondary"
              onClick={onEnterApp}
              className="px-8 py-4 rounded-xl border border-fin-border bg-fin-card hover:bg-fin-border/60 text-fin-text-primary font-medium transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Demo Workspace
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-12 flex items-center gap-6 text-fin-text-secondary text-sm border-t border-fin-border/60 pt-8 w-full"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-fin-border flex items-center justify-center text-[10px] text-white">SK</div>
              <div className="w-8 h-8 rounded-full bg-blue-950 border border-fin-border flex items-center justify-center text-[10px] text-fin-accent">VQ</div>
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-fin-border flex items-center justify-center text-[10px] text-emerald-400">FI</div>
            </div>
            <div>
              <p className="text-white font-semibold">100% Client-Side Encryption</p>
              <p className="text-xs">Zero server payloads. Your data is stored strictly inside local storage.</p>
            </div>
          </motion.div>
        </div>
        
        {/* Right Column: Premium Floating Mockup Cards */}
        <div className="lg:col-span-5 relative mt-12 lg:mt-0 flex justify-center items-center">
          {/* Main Visual Frame */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl border border-fin-border/80 bg-fin-bg bg-gradient-to-b from-fin-card to-fin-bg p-6 shadow-2xl overflow-hidden shadow-black/80 glow-blue">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-fin-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Custom mini dashboard header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Vault Secure Client</span>
            </div>
            
            <div className="space-y-5">
              {/* Floating Finance Card 1 */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="p-5 rounded-2xl bg-gradient-to-r from-fin-card to-[#151f30] border border-fin-border shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-fin-text-secondary uppercase">Total Available Balance</p>
                    <h3 className="text-2xl font-display font-semibold mt-1 text-white">$142,580.40</h3>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-fin-accent/10 flex items-center justify-center border border-fin-accent/20">
                    <TrendingUp className="h-4.5 w-4.5 text-fin-accent" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5" /> +14.2% Growth
                  </span>
                  <span className="text-fin-text-secondary">This quarter</span>
                </div>
              </motion.div>

              {/* Floating Savings Goal Card */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className="p-5 rounded-2xl bg-slate-950/80 border border-fin-border/60 shadow-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-fin-text-secondary font-medium">Vacation Trip Goal</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">85% Complete</span>
                </div>
                {/* Simulated Progress bar */}
                <div className="h-1.5 w-full bg-fin-border rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[85%] animate-pulse" />
                </div>
                <div className="mt-3 flex justify-between items-center text-xs text-fin-text-secondary">
                  <span>Saved: $8,500</span>
                  <span>Target: $10,000</span>
                </div>
              </motion.div>

              {/* Floating Subscription Alert Card */}
              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 shadow-md flex items-center gap-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-400">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Subscription Alert</p>
                  <p className="text-[11px] text-fin-text-secondary truncate mt-0.5">Recurring Netflix detected on CARD *4822</p>
                </div>
              </motion.div>
            </div>
            
            {/* Visual Glass Blur Card overlay */}
            <div className="absolute bottom-4 left-6 right-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-slate-300 font-mono">192.168.1.1 (LOCAL ONLY)</span>
              </div>
              <span className="text-[10px] text-fin-accent bg-fin-accent/10 px-2 py-0.5 rounded font-mono uppercase">V4 Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-fin-border/50">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs text-fin-accent uppercase tracking-widest font-semibold mb-2">Engineered Excellence</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Designed for Financial Professionals, Powered by Local State
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Feature 1 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-fin-card border border-fin-border transition hover:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-slate-900 border border-fin-border flex items-center justify-center text-fin-accent mb-6">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Smart Local Engine</h3>
              <p className="text-sm text-fin-text-secondary mt-3 leading-relaxed">
                VaultQueue instantly processes calculations within your browser memory. Updates propagate in real-time with zero backend latency.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-fin-card border border-fin-border transition hover:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-slate-900 border border-fin-border flex items-center justify-center text-fin-accent mb-6">
                <PieIcon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Interactive Recharts Analytics</h3>
              <p className="text-sm text-fin-text-secondary mt-3 leading-relaxed">
                Beautiful vector charts and multi-axis area graphs represent your monthly distributions. Perfect details built with minimal design aesthetics.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-fin-card border border-fin-border transition hover:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-slate-900 border border-fin-border flex items-center justify-center text-fin-accent mb-6">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Decentralized Storage</h3>
              <p className="text-sm text-fin-text-secondary mt-3 leading-relaxed">
                By maintaining data purely inside your browser sandbox, your balances, budgets, subscriptions, and goals are invisible to trackers.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative footer */}
      <footer className="relative z-10 border-t border-fin-border/40 py-8 text-center text-xs text-fin-text-secondary bg-[#0a0d12]">
        <p>&copy; 2026 VaultQueue. Built with desktop-first precision. All rights reserved.</p>
      </footer>
    </div>
  );
}
