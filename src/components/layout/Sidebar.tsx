import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  PiggyBank, 
  FileText, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Keyboard,
  PlayCircle,
  ChevronDown,
  User,
  Trash2
} from 'lucide-react';
import { ActiveTabType } from '../../types';
import { useFintech } from '../../context/FintechContext';

interface SidebarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { profile, logout, clearAllData } = useFintech();

  const navItems = [
    { id: 'Dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'Transactions', name: 'Transactions', icon: Receipt },
    { id: 'Budgets', name: 'Budgets', icon: PieChart },
    { id: 'Goals', name: 'Goals', icon: PiggyBank },
    { id: 'Reports', name: 'Reports', icon: FileText },
    { id: 'Autoplays', name: 'Autoplays', icon: PlayCircle },
    { id: 'Settings', name: 'Settings', icon: SettingsIcon },
  ] as const;

  // Keyboard shortcut Ctrl + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed, setIsCollapsed]);

  const sidebarContent = (isMobile: boolean = false) => {
    const displayCollapsed = isMobile ? false : isCollapsed;
    
    return (
      <div className="flex flex-col h-full bg-[#111111] border-r border-[rgba(255,255,255,0.06)] text-left relative animate-fade-in">
        {/* SIDEBAR HEADER */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3 overflow-hidden select-none">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#3B82F6] via-indigo-500 to-[#8B5CF6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/10">
              <Layers className="h-4 w-4 text-white" />
            </div>
            
            <AnimatePresence initial={false}>
              {!displayCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  <span className="font-display font-black text-xs tracking-wider text-white">
                    VAULT<span className="text-[#3B82F6]">QUEUE</span>
                  </span>
                  <p className="text-[7.5px] text-slate-500 font-mono tracking-widest mt-0.5">
                    PORTFOLIO DESK
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse/Expand toggle button (desktop only) */}
          {!isMobile && (
            <button
              id="sidebar-collapse-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-7 w-7 rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-slate-700 bg-black flex items-center justify-center text-slate-400 hover:text-white transition absolute -right-3.5 top-5.5 z-50 cursor-pointer shadow-md shadow-black/80"
              title={isCollapsed ? 'Expand sidebar (Ctrl + B)' : 'Collapse sidebar (Ctrl + B)'}
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as ActiveTabType);
                    if (isMobile) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-white/[0.04] to-transparent text-white border border-[rgba(255,255,255,0.04)] shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebarActiveIndicator"
                      className="absolute left-0 w-1 h-5 bg-fin-accent rounded-r-md" 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <Icon className={`h-4.5 w-4.5 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-fin-accent scale-105' : 'text-slate-400 group-hover:text-white'}`} />

                  {!displayCollapsed && (
                    <span className="whitespace-nowrap truncate">{item.name}</span>
                  )}
                </button>

                {/* Collapsed Mode Tooltip popup */}
                {displayCollapsed && hoveredItem === item.id && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#0B0F14] border border-[#1F2937] px-3 py-1.5 rounded-lg text-[10px] text-white font-semibold shadow-xl z-50 pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-100">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SIDEBAR FOOTER CARD */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-2.5">
          {/* USER PROFILE DRAG-UP AREA */}
          <div className="relative">
            <button
              id="sidebar-profile-trigger"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.06)] hover:border-slate-700 bg-black/40 hover:bg-[#111111]/80 transition cursor-pointer text-left select-none animate-fade-in"
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Avatar rendering */}
                {profile.avatar && !['silver', 'emerald', 'purple', 'amber'].includes(profile.avatar) ? (
                  <img
                    src={profile.avatar}
                    alt="User Identity"
                    className="h-6 w-6 rounded-lg object-cover border border-white/15 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`h-6 w-6 rounded-lg bg-gradient-to-tr ${
                    profile.avatar === 'silver' ? 'from-zinc-500 to-slate-800' :
                    profile.avatar === 'emerald' ? 'from-emerald-400 to-teal-900' :
                    profile.avatar === 'amber' ? 'from-amber-400 to-orange-950' :
                    'from-[#8B5CF6] via-[#3B82F6] to-[#0A0A0A]'
                  } border border-white/10 flex-shrink-0`} />
                )}
                {!displayCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate max-w-[130px] leading-tight">
                      {profile.name || 'Anonymous'}
                    </span>
                    <span className="text-[9px] text-slate-500 truncate max-w-[130px] leading-none mt-0.5">
                      {profile.email || 'guest@vaultqueue.co'}
                    </span>
                  </div>
                )}
              </div>
              {!displayCollapsed && (
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              )}
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  {/* Backdrop for clickaway */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                  <motion.div
                    id="profile-dropdown-content"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.12 }}
                    className="absolute bottom-full left-0 mb-3 w-64 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0C0C0D] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 text-left overflow-hidden"
                  >
                    {/* Decorative subtle background gradient */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

                    <div className="pb-3.5 border-b border-white/5 relative z-10 flex items-center gap-3">
                      {profile.avatar && !['silver', 'emerald', 'purple', 'amber'].includes(profile.avatar) ? (
                        <img
                          src={profile.avatar}
                          alt="User Identity"
                          className="h-9 w-9 rounded-xl object-cover border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${
                          profile.avatar === 'silver' ? 'from-zinc-500 to-slate-800' :
                          profile.avatar === 'emerald' ? 'from-emerald-400 to-teal-900' :
                          profile.avatar === 'amber' ? 'from-amber-400 to-orange-950' :
                          'from-[#8B5CF6] via-[#3B82F6] to-[#0A0A0A]'
                        } border border-white/10 flex-shrink-0`} />
                      )}
                      <div className="truncate text-left flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate leading-tight">{profile.name || 'Alexander Sterling'}</h4>
                        <p className="text-[10px] text-slate-500 truncate leading-none mt-1.5">{profile.email || 'guest@vaultqueue.co'}</p>
                      </div>
                    </div>

                    <div className="py-2.5 space-y-1 relative z-10 border-b border-white/5">
                      <button
                        onClick={() => {
                          setActiveTab('Settings');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-2.5 cursor-pointer"
                      >
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Identity Settings</span>
                      </button>
                    </div>

                    <div className="pt-2.5 relative z-10 space-y-1">
                      {/* Logout button */}
                      <button
                        id="profile-dropdown-logout-btn"
                        onClick={() => {
                          logout();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-2 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5 text-red-400" />
                        <span>Sign Out Session</span>
                      </button>

                      {/* Reset financial workspace button */}
                      <button
                        id="profile-dropdown-reset-btn"
                        onClick={() => {
                          if (confirm('Are you absolutely sure you want to reset your financial workspace? All expense logs, budgets, targets and analytics will be permanently erased.')) {
                            clearAllData();
                            setShowProfileDropdown(false);
                          }
                        }}
                        className="w-full text-left px-2 py-2 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition flex items-center gap-2.5 cursor-pointer border border-transparent hover:border-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500 font-bold" />
                        <span>Reset Workspace</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {!displayCollapsed ? (
            <div className="p-3 bg-black/40 border border-[rgba(255,255,255,0.06)] rounded-xl">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center font-mono text-[9px] text-slate-400">
                  <Keyboard className="h-3.5 w-3.5" />
                </div>
                <div className="text-[9px] text-slate-500 leading-normal">
                  Toggle Layout: <span className="font-semibold text-slate-300">Ctrl + B</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center text-slate-500 py-1">
              <span className="text-[9px] font-mono">V4.12</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR PANEL */}
      <motion.aside
        id="desktop-layout-sidebar"
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="hidden md:block h-screen flex-shrink-0 z-40 relative select-none"
      >
        {sidebarContent(false)}
      </motion.aside>

      {/* MOBILE PANEL DRAW OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop layer */}
            <motion.div
              id="mobile-sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile list */}
            <motion.div
              id="mobile-sidebar-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden"
            >
              {sidebarContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
