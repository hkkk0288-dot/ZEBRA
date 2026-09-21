import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { FoodAppMascot } from './FoodAppMascot';
import confetti from 'canvas-confetti';

export const AuthView: React.FC = () => {
  const {
    authMode,
    setAuthMode,
    login,
    signup,
    loginWithSocial,
    isLoggedIn,
    logout,
    user,
    setActiveTab,
    androidFrame
  } = useApp();

  // Mode: 'login' | 'signup'
  const isLogin = authMode === 'login';

  // Form states
  const [fullName, setFullName] = useState('David Johnson');
  const [email, setEmail] = useState('davidjonson@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Tafadhali weka barua pepe (email) sahihi.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Nenosiri lazima liwe na herufi zisizopungua 6.');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setErrorMsg('Tafadhali weka jina lako kamili.');
      return;
    }

    if (!isLogin && !agreeTerms) {
      setErrorMsg('Tafadhali kubali vigezo na masharti (Terms & Conditions) kuendelea.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password, fullName || undefined);
        setSuccessMsg(`Karibu tena, ${fullName || email.split('@')[0]}! Umefanikiwa kuingia.`);
      } else {
        await signup(fullName, email, password);
        setSuccessMsg(`Hongera ${fullName}! Akaunti yako imetengenezwa kwa mafanikio.`);
      }

      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Redirect after brief delay
      setTimeout(() => {
        setActiveTab('home');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Hitilafu imetokea. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  // Social Login Handler
  const handleSocialClick = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      await loginWithSocial(provider);
      setSuccessMsg(`Umefanikiwa kuingia na ${provider === 'google' ? 'Google' : 'Facebook'}!`);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setActiveTab('home');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // One-click quick fill
  const handleQuickDemoFill = () => {
    setFullName('David Johnson');
    setEmail('davidjonson@gmail.com');
    setPassword('zebra2026');
    setRememberMe(true);
    setAgreeTerms(true);
    setErrorMsg(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-start items-center py-6 px-4 sm:px-6 overflow-y-auto selection:bg-amber-500 selection:text-black">
      {/* Top Background Radial Warm Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-amber-500/20 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header Navigation (Back to Home / Title) */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#18181c] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Rudi Nyumbani</span>
        </button>

        {isLoggedIn && (
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
              Umeingia kama: <strong className="font-bold">{user.name}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md flex flex-col items-center">
        {/* 1. Mascot Illustration (Exact match to Screenshot 1 & 2) */}
        <div className="mb-6">
          <FoodAppMascot size={androidFrame ? 'md' : 'lg'} />
        </div>

        {/* 2. Segmented Pill Tab Switcher: Log In | Sign Up */}
        <div
          id="auth-segmented-switch"
          className="w-full bg-[#141416] p-1.5 rounded-full border border-neutral-800/90 shadow-2xl flex items-center relative mb-6"
        >
          {/* Log In Button */}
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg(null);
            }}
            className={`relative flex-1 py-3 text-center text-sm font-bold tracking-wide transition-colors z-10 ${
              isLogin ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isLogin && (
              <motion.div
                layoutId="activeAuthPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#b37a12] via-[#e5a825] to-[#b37a12] shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300/40 -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span>Log In</span>
          </button>

          {/* Sign Up Button */}
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg(null);
            }}
            className={`relative flex-1 py-3 text-center text-sm font-bold tracking-wide transition-colors z-10 ${
              !isLogin ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {!isLogin && (
              <motion.div
                layoutId="activeAuthPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#b37a12] via-[#e5a825] to-[#b37a12] shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300/40 -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span>Sign Up</span>
          </button>
        </div>

        {/* 3. Feedback Messages (Error or Success) */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="flex-1">{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. The Interactive Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Sign Up Only: Full Name Field */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5"
            >
              <label className="block text-xs font-semibold text-neutral-300 pl-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-neutral-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="David Johnson"
                  required={!isLogin}
                  className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                />
              </div>
            </motion.div>
          )}

          {/* Email / Email Address Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300 pl-1">
              {isLogin ? 'Email' : 'Email Address'}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-neutral-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="davidjonson@gmail.com"
                required
                className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password / Enter Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300 pl-1">
              {isLogin ? 'Password' : 'Enter Password'}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-neutral-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="xxxxxxxxx"
                required
                className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-neutral-400 hover:text-neutral-200 transition-colors"
                title={showPassword ? 'Ficha nenosiri' : 'Onyesha nenosiri'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options Row (Remember Me / Forgot Password for Login, or Terms Agreement for Signup) */}
          {isLogin ? (
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              {/* Remember Me Checkbox */}
              <label className="flex items-center space-x-2 cursor-pointer select-none group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                    rememberMe
                      ? 'bg-amber-500 border-amber-500 text-black'
                      : 'border-neutral-700 bg-neutral-900 group-hover:border-neutral-500'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-neutral-300 group-hover:text-white">Remember me</span>
              </label>

              {/* Forgot Password Link (Red/Coral text matching screenshot) */}
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[#e24c4c] hover:text-[#ff6b6b] font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          ) : (
            /* Sign Up Terms Checkbox */
            <div className="pt-1 px-1">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none group">
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4 h-4 rounded border mt-0.5 shrink-0 transition-colors flex items-center justify-center ${
                    agreeTerms
                      ? 'bg-amber-500 border-amber-500 text-black'
                      : 'border-neutral-700 bg-neutral-900 group-hover:border-neutral-500'
                  }`}
                >
                  {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] text-neutral-300 leading-snug">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    className="underline text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    className="underline text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>
          )}

          {/* 5. Main Action Button: Glowing Yellow-Gold Gradient Pill Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 px-6 rounded-full font-bold text-base text-neutral-950 bg-gradient-to-r from-[#f5b82e] via-[#f7cb45] to-[#f3ab18] hover:from-[#f7c244] hover:to-[#f5b41d] active:scale-[0.99] shadow-[0_8px_25px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
              )}
            </button>
          </div>

          {/* 6. Divider: "or continue with" with subtle golden lines */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-amber-900/40" />
            <span className="bg-[#0a0a0c] px-4 text-xs text-neutral-400 whitespace-nowrap">
              or continue with
            </span>
            <div className="w-full border-t border-amber-900/40" />
          </div>

          {/* 7. Social Sign-in Buttons: Google & Facebook */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialClick('google')}
              className="w-full py-3 px-4 rounded-full bg-[#161619] hover:bg-[#1f1f24] border border-neutral-800 hover:border-neutral-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2.5 transition-all shadow-md active:scale-[0.98]"
            >
              {/* Colored Google G SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              onClick={() => handleSocialClick('facebook')}
              className="w-full py-3 px-4 rounded-full bg-[#161619] hover:bg-[#1f1f24] border border-neutral-800 hover:border-neutral-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2.5 transition-all shadow-md active:scale-[0.98]"
            >
              {/* Blue Facebook f Icon */}
              <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">
                f
              </div>
              <span>Facebook</span>
            </button>
          </div>

          {/* 8. Quick Demo Account Fill Button */}
          <div className="pt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] text-neutral-400 hover:text-amber-400 flex items-center space-x-1.5 py-1 px-3 rounded-full bg-[#141417] border border-neutral-800 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Jaza Akaunti ya Demo (David Johnson)</span>
            </button>
          </div>
        </form>

        {/* 9. Logged In Quick Actions Banner */}
        {isLoggedIn && (
          <div className="mt-8 w-full p-4 rounded-3xl bg-[#141416] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-neutral-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('home')}
                className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all"
              >
                Agiza Chakula
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 text-neutral-300 font-semibold transition-all"
              >
                Toka (Log Out)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#141416] border border-neutral-800 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-red-500/10 text-[#e24c4c] border border-red-500/20">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Rudisha Nenosiri (Reset)</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSubmitted(false);
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-3 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-neutral-200">
                  Kiungo cha kuweka upya nenosiri kimetumwa kwa{' '}
                  <strong className="text-amber-400">{forgotEmail || email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 w-full py-2.5 rounded-full bg-amber-500 text-black font-bold text-xs"
                >
                  Sawa, Nimeelewa
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  Weka barua pepe yako ili tukutumie maelekezo ya kubadili nenosiri:
                </p>
                <input
                  type="email"
                  value={forgotEmail || email}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="davidjonson@gmail.com"
                  className="w-full bg-[#111113] border border-neutral-800 rounded-full py-3 px-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => setForgotSubmitted(true)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#f5b82e] to-[#f3ab18] text-neutral-950 font-bold text-xs"
                >
                  Tuma Kiungo cha Nenosiri
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl bg-[#141416] border border-neutral-800 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Vigezo na Masharti (Zebra Restaurant)</span>
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-neutral-300 space-y-2.5 leading-relaxed">
              <p>
                <strong>1. Usalama wa Akaunti:</strong> Akaunti yako inatumiwa kuwezesha maagizo ya vyakula na usafirishaji wa haraka Dar es Salaam (Masaki, Kariakoo, Oysterbay, Slipway n.k).
              </p>
              <p>
                <strong>2. Malipo na USSD:</strong> Malipo yote yanafanyika kwa usalama kupitia M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, au Fedha Taslimu (Cash on Delivery).
              </p>
              <p>
                <strong>3. Sera ya Faragha:</strong> Hatutoi nambari yako ya simu au anwani yako kwa mtu wa tatu bila idhini yako.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-full bg-amber-500 text-black font-bold text-xs"
            >
              Nimekubali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
