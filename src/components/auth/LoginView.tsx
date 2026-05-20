import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  User, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Upload, 
  Zap, 
  Lock, 
  Compass, 
  Layers,
  Check
} from 'lucide-react';
import { useFintech } from '../../context/FintechContext';

// Abstract premium gradients for profiles
const GRADIENT_PRESETS = [
  { id: 'silver', label: 'Silver Dusk', bg: 'from-zinc-500 to-slate-800' },
  { id: 'emerald', label: 'Emerald Quant', bg: 'from-emerald-400 to-teal-900' },
  { id: 'purple', label: 'Royal Velvet', bg: 'from-[#8B5CF6] via-[#3B82F6] to-[#0A0A0A]' },
  { id: 'amber', label: 'Orion Amber', bg: 'from-amber-400 to-orange-950' },
];

export default function LoginView() {
  const { login } = useFintech();
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('purple');
  const [customAvatarBase64, setCustomAvatarBase64] = useState<string | null>(null);
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle local image file loading
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorText('Avatar must be under 2MB for optimized storage');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatarBase64(reader.result as string);
        setSelectedPreset(''); // clear preset choice
        setErrorText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    setCustomAvatarBase64(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorText('Enterprise or Client Full Name is required');
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setErrorText('Please specify a valid communication email address');
      return;
    }

    setErrorText('');
    setIsSubmitting(true);

    // Dynamic timeout for cinematic loading feeling
    setTimeout(() => {
      const activeAvatar = customAvatarBase64 || selectedPreset;
      login(fullName.trim(), emailAddress.trim(), activeAvatar);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleContinueAsGuest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      login('Guest Account', 'guest@vaultqueue.co', 'silver');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-screen bg-[#000000] text-white flex flex-col justify-between items-center relative overflow-hidden font-sans p-6 select-none">
      
      {/* Background Cinematic Glow Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[40rem] h-[40rem] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Subtly moving grid overlay lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      {/* HEADER LOGO */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#3B82F6] via-indigo-500 to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/10">
            <Layers className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="text-left">
            <span className="font-display font-black text-xs tracking-wider text-white">
              VAULT<span className="text-[#3B82F6]">QUEUE</span>
            </span>
            <p className="text-[7.5px] text-slate-500 font-mono tracking-widest leading-none mt-0.5">
              SECURED PORTFOLIO DESK
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.04)] bg-white/[0.02] text-[10px] text-[#A1A1AA] font-mono">
          <Lock className="h-3 w-3 text-[#10B981]" /> Hardware Isolated Sandbox Mode
        </div>
      </div>

      {/* CORE FORM / HERO REGION */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center justify-center relative z-10 flex-grow py-12">
        
        {/* LEFT COLUMN: HERO MARKETING OR BRAND */}
        <div className="lg:col-span-6 text-left space-y-6 lg:pr-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-[#3B82F6] font-mono text-[9px] uppercase tracking-widest"
          >
            <Sparkles className="h-3 w-3" /> INTRODUCING RELEASE V4.12
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight"
          >
            The Luxury Financial Workspace.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-lg"
          >
            Experience a minimal corporate ledger designed for absolute data autonomy. Zero remote tunnels, immediate micro-chronology updates, and cinematic visual rendering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(255,255,255,0.06)] max-w-md"
          >
            <div>
              <span className="block text-md font-bold font-mono text-white">0%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tethered Data</span>
            </div>
            <div>
              <span className="block text-md font-bold font-mono text-white">100%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Private Offline</span>
            </div>
            <div>
              <span className="block text-md font-bold font-mono text-[#3B82F6]">1.5%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Card Cashback</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: PREMIUM GLASS AUTH CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="p-8 sm:p-10 rounded-[2.25rem] bg-gradient-to-br from-[#121212] to-[#080808] border border-[rgba(255,255,255,0.08)] shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl text-left relative overflow-hidden">
            
            {/* Glossy lighting sweep */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-8 select-none text-left">
              <h2 className="text-xl font-display font-bold text-white tracking-tight">Initiate Local Terminal</h2>
              <p className="text-[11px] text-[#A1A1AA] mt-1">Please authorize client credentials to build your private index.</p>
            </div>

            {errorText && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-[10px] text-left leading-relaxed"
              >
                {errorText}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Input */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Alexander Sterling"
                    className="w-full bg-black/60 focus:bg-black border border-[rgba(255,255,255,0.06)] hover:border-slate-700 focus:border-[#3B82F6] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/15 transition placeholder:text-slate-600"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Secure Communication Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="e.g., sterling@quantvault.co"
                    className="w-full bg-black/60 focus:bg-black border border-[rgba(255,255,255,0.06)] hover:border-slate-700 focus:border-[#3B82F6] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/15 transition placeholder:text-slate-600"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Identity Avatar system */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Identity Signature (Avatar/Design)
                </label>
                
                {/* Switchable selection */}
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`h-9 rounded-xl bg-gradient-to-tr ${preset.bg} border-2 overflow-hidden flex items-center justify-center transition hover:scale-105 cursor-pointer relative ${selectedPreset === preset.id ? 'border-[#3B82F6]' : 'border-[rgba(255,255,255,0.08)]'}`}
                      title={preset.label}
                    >
                      {selectedPreset === preset.id && (
                        <Check className="h-3.5 w-3.5 text-white bg-black/50 p-0.5 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom File uploader */}
                <div className="pt-1.5">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-white/[0.01] hover:bg-white/[0.03] transition text-[10px] text-slate-400 hover:text-white cursor-pointer select-none">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{customAvatarBase64 ? 'Custom Avatar Anchored' : 'Upload custom PNG/JPEG'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
              </div>

              {/* Enter Vault button */}
              <button
                id="enter-vault-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-black tracking-wide transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 relative shadow-lg shadow-white/5 mt-6 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="h-4.5 w-4.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter VaultQueue Desk</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="relative text-center my-4">
                <div className="absolute inset-y-1/2 left-0 right-0 h-[1px] bg-white/5" />
                <span className="relative z-10 bg-[#080808] px-3 font-mono text-[8.5px] text-slate-500 uppercase tracking-widest">
                  Authentication bypass
                </span>
              </div>

              {/* Guest Enter */}
              <button
                id="guest-enter-btn"
                type="button"
                onClick={handleContinueAsGuest}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-slate-500 bg-white/[0.02] hover:bg-white/5 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                Continue as Corporate Guest
              </button>

            </form>
          </div>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[rgba(255,255,255,0.04)] relative z-10 select-none">
        <span className="font-mono text-[8px] text-slate-600 uppercase tracking-wider">
          SYSTEM DISCIPLINE V4.12 • NO THIRD PARTY TUNNELS
        </span>
        <div className="flex gap-4 text-[9px] text-slate-500">
          <span className="hover:text-slate-300 transition cursor-pointer">Security Protocol</span>
          <span className="hover:text-slate-300 transition cursor-pointer">Endpoint Audit</span>
          <span className="hover:text-slate-300 transition cursor-pointer">Wipe Trigger</span>
        </div>
      </div>

    </div>
  );
}
