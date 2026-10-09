import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from './adminMockData';
import confetti from 'canvas-confetti';

interface AdminAuthGuardProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ onBack, onSuccess }) => {
  const { user, isLoggedIn, login, logout, appBranding } = useApp();

  const [authMethod, setAuthMethod] = useState<'password' | 'pin'>('password');
  const [identifier, setIdentifier] = useState('david@zebradsm.com');
  const [password, setPassword] = useState('zebra2026');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if current logged-in user is a normal customer
  const isCustomerLoggedIn = isLoggedIn && user.role !== 'admin';

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    let idToUse = identifier.trim();
    let passToUse = password;

    if (authMethod === 'pin') {
      if (!pin || pin.length < 4) {
        setErrorMessage('Tafadhali ingiza PIN ya Admin yenye tarakimu 4 au zaidi (mfano: 2026).');
        return;
      }
      // PIN verification
      if (pin === '2026' || pin === '1234' || pin === '0000') {
        idToUse = 'david@zebradsm.com';
        passToUse = 'zebra2026';
      } else {
        setErrorMessage('PIN uliyoweka si sahihi. Jaribu PIN: 2026 au tumia nenosiri.');
        return;
      }
    } else {
      if (!idToUse) {
        setErrorMessage('Tafadhali weka barua pepe, jina au namba ya simu ya Admin.');
        return;
      }
      if (!passToUse) {
        setErrorMessage('Tafadhali weka nenosiri la Admin.');
        return;
      }
    }

    setLoading(true);

    try {
      const ok = await login(idToUse, passToUse);
      if (ok) {
        setSuccessMessage('Umefanikiwa kuingia kama Msimamizi (Admin)! Inafungua dashibodi...');
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 900);
      } else {
        setErrorMessage('Taarifa hazijathibitishwa. Hakikisha akaunti hii ina mamlaka ya Admin.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Hitilafu imetokea wakati wa kuingia. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setAuthMethod('password');
    setIdentifier(email);
    setPassword(pass);
    setErrorMessage(null);
  };

  const handleQuickPin = (quickPin: string) => {
    setAuthMethod('pin');
    setPin(quickPin);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#121215] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative background gradient glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Rudi kwenye Menyu ya Wateja</span>
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/25 ring-4 ring-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Authentication Required</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-neutral-900 dark:text-white tracking-tight">
              Dashibodi ya Msimamizi (Admin)
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed max-w-sm">
              Eneo hili limelindwa. Msimamizi lazima aingie (log in) kwanza kwa nenosiri au PIN ili kuthibitisha mamlaka ya usimamizi.
            </p>
          </div>
        </div>

        {/* Alert if logged in as regular customer */}
        {isCustomerLoggedIn && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-neutral-900 dark:text-neutral-200 text-xs space-y-2">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-600 dark:text-amber-400">
                  Umeingia kama Mteja: <span className="underline">{user.name}</span>
                </p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5">
                  Akaunti ya kawaida ya mteja haina mamlaka ya kuingia hapa. Tafadhali ingia na taarifa za Admin hapa chini.
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-400 flex items-center space-x-1 cursor-pointer pt-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Toka kwenye akaunti ya sasa ({user.name})</span>
            </button>
          </div>
        )}

        {/* Auth Method Switch */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/70 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
              authMethod === 'password'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Nenosiri (Password)
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('pin')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
              authMethod === 'pin'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            PIN ya Haraka (Quick PIN)
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          {authMethod === 'password' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Akaunti ya Admin (Email / Jina / Namba)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="david@zebradsm.com au David Michael Johnson"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
                  />
                  <div className="absolute right-3 top-2.5 text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Nenosiri la Admin (Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Weka password ya Admin..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-center">
                Weka PIN ya Msimamizi (4-Digit Master PIN)
              </label>
              <div className="relative max-w-[200px] mx-auto">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  autoFocus
                  className="w-full text-center tracking-[0.5em] text-xl font-mono py-3 rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <p className="text-[11px] text-center text-neutral-400 mt-2">
                PIN ya kawaida ya jaribio: <strong className="text-amber-500">2026</strong>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-neutral-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Thibitisha na Ingia kama Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Admin Test Credentials Section */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Akaunti za Mfano za Admin (Quick Fill):</span>
          </p>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('david@zebradsm.com', 'zebra2026')}
              className="w-full text-left p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <p className="font-bold text-neutral-900 dark:text-white text-[11px]">
                  👑 David Michael Johnson (Super Admin)
                </p>
                <p className="text-[10px] text-neutral-400">david@zebradsm.com • zebra2026</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('amour@amourcodes.com', 'zebra2026')}
              className="w-full text-left p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <p className="font-bold text-neutral-900 dark:text-white text-[11px]">
                  👑 Amour Ally (AmourCodes Super Admin)
                </p>
                <p className="text-[10px] text-neutral-400">amour@amourcodes.com • zebra2026</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickPin('2026')}
              className="w-full text-left p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                  Tumia PIN ya Haraka (2026)
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
