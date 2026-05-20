import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle,
  Bell,
  Sparkles,
  Check,
  Search,
  Menu,
  X,
  LayoutDashboard,
  Receipt,
  PieChart,
  FileText,
  PiggyBank,
  Settings as SettingsIcon,
  MoreHorizontal,
  FolderSync,
  ChevronDown,
  LogOut,
  Trash2,
  User,
  PlayCircle
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

import { FintechProvider, useFintech } from './context/FintechContext';
import Sidebar from './components/layout/Sidebar';
import DashboardView from './components/dashboard/DashboardView';
import ExpensesView from './components/expenses/ExpensesView';
import BudgetsView from './components/budgets/BudgetsView';
import GoalsView from './components/goals/GoalsView';
import ReportsView from './components/reports/ReportsView';
import SettingsView from './components/settings/SettingsView';
import AutoplaysView from './components/autoplays/AutoplaysView';
import QuickAddModal from './components/expenses/QuickAddModal';
import LoginView from './components/auth/LoginView';
import { ActiveTabType } from './types';

function AppContent() {
  const { profile, notifications, markNotificationsAsRead, isAuthenticated, logout, clearAllData } = useFintech();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('Dashboard');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMoreMenu, setShowMobileMoreMenu] = useState(false);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 }
  };

  // Nav mapping for floating bottom bar (Mobile iOS style)
  const mobileNavItems = [
    { id: 'Dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'Transactions', label: 'Transactions', icon: Receipt },
    { id: 'Reports', label: 'Analytics', icon: FileText },
    { id: 'Budgets', label: 'Budgets', icon: PieChart },
  ] as const;

  return (
    <div className="h-screen w-screen bg-[#000000] text-white font-sans flex overflow-hidden relative">
      
      {/* COLLAPSIBLE LEFT SIDEBAR FOR DESKTOP */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        setIsMobileOpen={setMobileSidebarOpen}
      />

      {/* CORE FRAME CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 min-w-0">
        
        {/* PREMIUM TOP HEADER BAR */}
        <header className="bg-black/60 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] h-18 sticky top-0 z-30 flex-shrink-0">
          <div className="w-full h-full px-4 md:px-8 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              {/* Back-up Hamburger button */}
              <button
                id="mobile-sidebar-hamburger"
                onClick={() => setMobileSidebarOpen(true)}
                className="h-9 w-9 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111111]/40 flex md:hidden items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                title="Toggle workspace layout"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* PILL-STYLE PREMIUM SEARCH BAR WITH BACKDROP BLUR & GLASSMORPHISM */}
              <div className="relative max-w-sm hidden sm:block md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <input
                  id="navbar-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Universal Vault ledger search..."
                  className="w-full bg-[#111111]/50 focus:bg-[#111111] border border-[rgba(255,255,255,0.06)] hover:border-slate-700 focus:border-[#3B82F6] rounded-full py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/15 transition placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-3 ml-auto flex-shrink-0">
              
              {/* Quick Transaction Action */}
              <button
                id="header-add-expense-btn"
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-white/5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Record Outflow</span>
              </button>

              {/* Minimal Notification bell */}
              <div className="relative">
                <button
                  id="header-notification-btn"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) {
                      markNotificationsAsRead();
                    }
                  }}
                  className="h-8 w-8 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111111]/30 flex items-center justify-center text-slate-400 hover:text-white transition relative cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-1 w-1 rounded-full bg-red-500 animate-ping" />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <motion.div
                        id="notifications-dropdown-header"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-3.5 w-80 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-black p-4 shadow-2xl z-50 text-left"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.04)]">
                          <span className="font-display font-semibold text-xs text-white flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#3b82f6]" />
                            System Alerts
                          </span>
                          <button
                            id="clear-notifications-header"
                            onClick={markNotificationsAsRead}
                            className="text-[10px] text-[#3B82F6] hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                          >
                            <Check className="h-3 w-3" />
                            Read ({unreadCount})
                          </button>
                        </div>

                        <div className="max-h-52 overflow-y-auto pt-2 space-y-2">
                          {notifications.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-600">
                              No alerts checked.
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`p-2.5 rounded-xl border text-[11px] ${
                                  n.type === 'warning'
                                    ? 'border-red-500/10 bg-red-500/5 text-red-400'
                                    : 'border-[#3b82f6]/10 bg-[#3b82f6]/5 text-blue-400'
                                }`}
                              >
                                <div className="flex justify-between items-start gap-1">
                                  <h4 className="font-semibold truncate text-[#c1c5cd]">{n.title}</h4>
                                  <span className="text-[8px] text-slate-600 font-mono">{n.date}</span>
                                </div>
                                <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight text-left">
                                  {n.message}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </header>

        {/* CORE WORKSPACE VIEW AREA */}
        <main className="flex-grow w-full px-4 md:px-8 py-6 overflow-y-auto min-h-0 bg-black pb-32 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'Dashboard' && (
                <DashboardView 
                  onOpenAddExpense={() => setIsAddExpenseOpen(true)} 
                  setActiveTab={(tab) => setActiveTab(tab as ActiveTabType)}
                />
              )}
              {activeTab === 'Transactions' && (
                <ExpensesView onOpenAddExpense={() => setIsAddExpenseOpen(true)} />
              )}
              {activeTab === 'Budgets' && <BudgetsView />}
              {activeTab === 'Goals' && <GoalsView />}
              {activeTab === 'Reports' && <ReportsView />}
              {activeTab === 'Autoplays' && <AutoplaysView />}
              {activeTab === 'Settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE BOTTOM FLOATING DOCK (iOS GLASS DOCK) */}
      <div className="block md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40">
        
        {/* Animated MORE options contextual menu above dock */}
        <AnimatePresence>
          {showMobileMoreMenu && (
            <>
              <div className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm" onClick={() => setShowMobileMoreMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute bottom-16 left-0 right-0 p-4 rounded-[2rem] bg-neutral-950/95 border border-[rgba(255,255,255,0.08)] backdrop-blur-3xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] z-40 text-left space-y-2 select-none"
              >
                <div className="px-2 pb-2 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Auxiliary Vaults</span>
                  <X className="h-3 w-3 text-slate-400 cursor-pointer" onClick={() => setShowMobileMoreMenu(false)} />
                </div>
                
                {/* Savings trajectory */}
                <button
                  onClick={() => {
                    setActiveTab('Goals');
                    setShowMobileMoreMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition ${activeTab === 'Goals' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <PiggyBank className="h-4 w-4 text-emerald-400" />
                  <span>Savings Allocations</span>
                </button>

                {/* Autoplay Schedules */}
                <button
                  onClick={() => {
                    setActiveTab('Autoplays');
                    setShowMobileMoreMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition ${activeTab === 'Autoplays' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <PlayCircle className="h-4 w-4 text-purple-400" />
                  <span>Autoplay Rules</span>
                </button>

                {/* Dashboard preferences */}
                <button
                  onClick={() => {
                    setActiveTab('Settings');
                    setShowMobileMoreMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition ${activeTab === 'Settings' ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <SettingsIcon className="h-4 w-4 text-blue-400" />
                  <span>Workspace Preferences</span>
                </button>

              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* The floating Glass Dock */}
        <div id="mobile-ios-glass-dock" className="bg-[#111111]/85 backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] py-2.5 px-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-between relative z-40">
          
          {mobileNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTabType);
                  setShowMobileMoreMenu(false);
                }}
                className="flex flex-col items-center justify-center p-2 relative flex-1 group cursor-pointer"
              >
                {isActive && (
                  <motion.div 
                    layoutId="mobileActiveDockDot"
                    className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <Icon className={`h-4.5 w-4.5 transition-all duration-150 ${isActive ? 'text-white scale-105' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="text-[8.5px] mt-1 font-semibold text-slate-400 tracking-wide">{item.label}</span>
              </button>
            );
          })}

          {/* MORE trigger for options button */}
          <button
            onClick={() => setShowMobileMoreMenu(!showMobileMoreMenu)}
            className="flex flex-col items-center justify-center p-2 relative flex-1 group cursor-pointer"
          >
            {showMobileMoreMenu && (
              <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            )}
            <MoreHorizontal className={`h-4.5 w-4.5 transition-all duration-150 ${showMobileMoreMenu ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            <span className="text-[8.5px] mt-1 font-semibold text-slate-400 tracking-wide">More</span>
          </button>
          
        </div>
      </div>

      {/* QUICK FLOATING OUTFLOW DIALOG */}
      <QuickAddModal 
        isOpen={isAddExpenseOpen} 
        onClose={() => setIsAddExpenseOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <FintechProvider>
      <AppContent />
      <Analytics />
    </FintechProvider>
  );
}
