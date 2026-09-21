import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  ShieldCheck,
  Navigation,
  RefreshCw,
  Gift,
  Upload
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

  // --------------------------------------------------------------------------
  // LOG IN FORM STATES
  // - majina ma 3 au Email au Phone number
  // - paswed
  // --------------------------------------------------------------------------
  const [loginIdentifier, setLoginIdentifier] = useState('David Michael Johnson');
  const [loginPassword, setLoginPassword] = useState('zebra2026');
  const [rememberMe, setRememberMe] = useState(true);

  // --------------------------------------------------------------------------
  // SIGN UP (REGISTA) FORM STATES
  // - picha aweke — optional
  // - majina ma 3
  // - Phone number
  // - Email — optional
  // - Birthday — optional, kama unataka birthday rewards
  // - curant location iwe automatiki na pia aweze kuediti
  // - paswed
  // --------------------------------------------------------------------------
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fullName3, setFullName3] = useState('David Michael Johnson');
  const [phoneNumber, setPhoneNumber] = useState('+255 754 123 456');
  const [email, setEmail] = useState('david.johnson@example.com');
  const [birthday, setBirthday] = useState('');
  const [wantBirthdayRewards, setWantBirthdayRewards] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('Masaki, Dar es Salaam');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [signupPassword, setSignupPassword] = useState('zebra2026');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // --------------------------------------------------------------------------
  // Automatic Current Location Detection on Mount (or on manual click)
  // --------------------------------------------------------------------------
  const detectUserLocation = (silent = false) => {
    setIsDetectingLocation(true);
    if (!navigator.geolocation) {
      if (!silent) {
        setErrorMsg('Kifaa chako hakiruhusu utambuzi wa GPS moja kwa moja. Unaweza kuandika mwenyewe.');
      }
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });

        // Accurate local neighborhood mapping for Dar es Salaam & nearby
        let detectedArea = 'Masaki, Toure Drive, Dar es Salaam';
        if (latitude > -6.75 && latitude < -6.72 && longitude > 39.26 && longitude < 39.30) {
          detectedArea = 'Masaki Peninsula, Dar es Salaam';
        } else if (latitude > -6.78 && latitude < -6.75 && longitude > 39.26 && longitude < 39.29) {
          detectedArea = 'Oysterbay, Dar es Salaam';
        } else if (latitude > -6.83 && latitude < -6.80 && longitude > 39.27 && longitude < 39.30) {
          detectedArea = 'City Centre / Kivukoni, Dar es Salaam';
        } else if (latitude > -6.82 && latitude < -6.78 && longitude > 39.23 && longitude < 39.27) {
          detectedArea = 'Mikocheni, Dar es Salaam';
        } else if (latitude > -6.83 && latitude < -6.81 && longitude > 39.27 && longitude < 39.29) {
          detectedArea = 'Kariakoo, Dar es Salaam';
        } else {
          detectedArea = `Dar es Salaam (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        }

        setCurrentLocation(detectedArea);
        setLocationDetected(true);
        setIsDetectingLocation(false);
      },
      error => {
        // Fallback default without blocking user
        if (!silent) {
          console.warn('Geolocation prompt dismissed or unavailable:', error.message);
        }
        // Provide standard Dar location if blocked
        if (!currentLocation) {
          setCurrentLocation('Masaki, Dar es Salaam');
        }
        setIsDetectingLocation(false);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Attempt automatic detection on mount
    detectUserLocation(true);
  }, []);

  // --------------------------------------------------------------------------
  // Photo Upload Handler (Local file to Data URL)
  // --------------------------------------------------------------------------
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Picha ni kubwa mno. Tafadhali chagua picha iliyo chini ya 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // --------------------------------------------------------------------------
  // Validation for 3 Names (Majina ma 3)
  // --------------------------------------------------------------------------
  const getWordCount = (str: string) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  // --------------------------------------------------------------------------
  // Form Submit Handler
  // --------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isLogin) {
      // LOG IN VALIDATION:
      // - majina ma 3 au Email au Phone number
      // - paswed
      const identifier = loginIdentifier.trim();
      if (!identifier) {
        setErrorMsg('Tafadhali weka Majina ma 3, Barua pepe (Email), au Nambari ya Simu.');
        return;
      }

      // Check if user is typing names instead of email or phone:
      const isEmail = identifier.includes('@');
      const isPhone = /^(\+?255|0)[67]\d{8}$/.test(identifier.replace(/[\s-]/g, ''));
      if (!isEmail && !isPhone) {
        const words = getWordCount(identifier);
        if (words < 3) {
          setErrorMsg('Tafadhali weka majina ma 3 (mfano: David Michael Johnson), au tumia Email au Namba ya Simu.');
          return;
        }
      }

      if (!loginPassword || loginPassword.length < 4) {
        setErrorMsg('Tafadhali weka nenosiri lako sahihi.');
        return;
      }

      setLoading(true);
      try {
        await login(identifier, loginPassword);
        setSuccessMsg(`Karibu tena! Umefanikiwa kuingia.`);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setActiveTab('home'), 1100);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Hitilafu imetokea. Tafadhali jaribu tena.');
      } finally {
        setLoading(false);
      }
    } else {
      // SIGN UP (REGISTA) VALIDATION:
      // - picha aweke — optional
      // - majina ma 3 (mandatory)
      // - Phone number (mandatory)
      // - Email — optional
      // - Birthday — optional
      // - curant location iwe automatiki na pia aweze kuediti
      // - paswed
      const nameWords = getWordCount(fullName3);
      if (nameWords < 3) {
        setErrorMsg('Tafadhali weka majina yako ma 3 kamili (mfano: David Michael Johnson).');
        return;
      }

      const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
      if (!cleanPhone || cleanPhone.length < 9) {
        setErrorMsg('Tafadhali weka nambari sahihi ya simu (mfano: 0754 123 456 au +255 754 123 456).');
        return;
      }

      if (email.trim() && !email.includes('@')) {
        setErrorMsg('Barua pepe uliyoweka si sahihi. Unaweza kuiacha wazi maana ni hiari (optional).');
        return;
      }

      if (!currentLocation.trim()) {
        setErrorMsg('Tafadhali weka au thibitisha eneo lako la sasa (Current Location).');
        return;
      }

      if (!signupPassword || signupPassword.length < 6) {
        setErrorMsg('Nenosiri (password) lazima liwe na herufi zisizopungua 6.');
        return;
      }

      if (!agreeTerms) {
        setErrorMsg('Tafadhali kubali vigezo na masharti (Terms & Conditions) kuendelea.');
        return;
      }

      setLoading(true);
      try {
        await signup({
          fullName: fullName3,
          phone: phoneNumber,
          email: email.trim() || undefined,
          avatar: avatarPreview || undefined,
          birthday: birthday || undefined,
          location: currentLocation,
          coordinates: coordinates || undefined,
          password: signupPassword
        });

        setSuccessMsg(`Hongera ${fullName3}! Akaunti yako ya Zebra Restaurant imetengenezwa kwa mafanikio.`);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setActiveTab('home'), 1200);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Hitilafu imetokea wakati wa kusajili. Jaribu tena.');
      } finally {
        setLoading(false);
      }
    }
  };

  // --------------------------------------------------------------------------
  // Social Login Handler
  // --------------------------------------------------------------------------
  const handleSocialClick = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      await loginWithSocial(provider);
      setSuccessMsg(`Umefanikiwa kuingia na ${provider === 'google' ? 'Google' : 'Facebook'}!`);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setActiveTab('home'), 1000);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Helpers
  const handleDemoFillLogin = (type: 'names' | 'email' | 'phone') => {
    if (type === 'names') {
      setLoginIdentifier('David Michael Johnson');
    } else if (type === 'email') {
      setLoginIdentifier('david.johnson@example.com');
    } else {
      setLoginIdentifier('+255 754 123 456');
    }
    setLoginPassword('zebra2026');
    setErrorMsg(null);
  };

  const handleDemoFillSignup = () => {
    setFullName3('David Michael Johnson');
    setPhoneNumber('+255 754 123 456');
    setEmail('david.johnson@example.com');
    setBirthday('1998-05-14');
    setWantBirthdayRewards(true);
    setCurrentLocation('Masaki, Toure Drive, Dar es Salaam');
    setSignupPassword('zebra2026');
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
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#18181c] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Rudi Nyumbani</span>
        </button>

        {isLoggedIn && (
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
              Umeingia: <strong className="font-bold">{user.name}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md flex flex-col items-center">
        {/* 1. Mascot Illustration (Exact match to screenshots) */}
        <div className="mb-5">
          <FoodAppMascot size={androidFrame ? 'sm' : 'md'} />
        </div>

        {/* 2. Segmented Pill Tab Switcher: Log In | Sign Up */}
        <div
          id="auth-segmented-switch"
          className="w-full bg-[#141416] p-1.5 rounded-full border border-neutral-800/90 shadow-2xl flex items-center relative mb-5"
        >
          {/* Log In Button */}
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg(null);
            }}
            className={`relative flex-1 py-3 text-center text-sm font-bold tracking-wide transition-colors z-10 cursor-pointer ${
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
            className={`relative flex-1 py-3 text-center text-sm font-bold tracking-wide transition-colors z-10 cursor-pointer ${
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
            <span>Sign Up (Regista)</span>
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
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white cursor-pointer">
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

        {/* 4. Interactive Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          {/* ============================================================= */}
          {/* CASE A: LOG IN VIEW                                           */}
          {/* Requirements:                                                 */}
          {/* - majina ma 3 au Email au Phone number                        */}
          {/* - paswed                                                      */}
          {/* ============================================================= */}
          {isLogin ? (
            <>
              {/* Login Identifier Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Majina ma 3 / Email / Namba ya Simu
                  </label>
                  <span className="text-[10px] text-amber-400 font-medium">Chagua yoyote</span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400 pointer-events-none">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="David Michael Johnson, Email, au 0754123456"
                    required
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  />
                </div>

                {/* Scannable Quick chips for Login */}
                <div className="flex items-center gap-1.5 pt-1 px-1">
                  <span className="text-[10px] text-neutral-500">Jaribu:</span>
                  <button
                    type="button"
                    onClick={() => handleDemoFillLogin('names')}
                    className="text-[10px] bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700 cursor-pointer"
                  >
                    Majina 3
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFillLogin('phone')}
                    className="text-[10px] bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700 cursor-pointer"
                  >
                    Namba ya Simu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFillLogin('email')}
                    className="text-[10px] bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700 cursor-pointer"
                  >
                    Email
                  </button>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300 pl-1">
                  Password (Nenosiri)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="xxxxxxxxx"
                    required
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                    title={showPassword ? 'Ficha nenosiri' : 'Onyesha nenosiri'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
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

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#e24c4c] hover:text-[#ff6b6b] font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            /* ============================================================= */
            /* CASE B: SIGN UP (REGISTA) VIEW                                */
            /* Requirements:                                                 */
            /* - picha aweke — optional                                      */
            /* - majina ma 3                                                 */
            /* - Phone number                                                */
            /* - Email — optional                                            */
            /* - Birthday — optional, kama unataka birthday rewards          */
            /* - curant location iwe automatiki na pia aweze kuediti         */
            /* - paswed                                                      */
            /* ============================================================= */
            <>
              {/* 1. Profile Photo (Picha) — Optional */}
              <div className="p-3 rounded-2xl bg-[#131316] border border-neutral-800/80 flex items-center space-x-3.5">
                <div className="relative group shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600/30 to-yellow-500/20 border-2 border-amber-500/40 overflow-hidden flex items-center justify-center text-neutral-400">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Uploaded Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-amber-400/80" />
                    )}
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setAvatarPreview(null)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-md cursor-pointer"
                      title="Ondoa picha"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-white">Weka Picha ya Wasifu</span>
                    <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                      Hiari (Optional)
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Picha yako itaonekana kwenye stakabadhi na maagizo.
                  </p>
                  <label className="inline-flex items-center space-x-1.5 mt-2 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>{avatarPreview ? 'Badili Picha' : 'Pakia Picha (Upload)'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 2. Majina ma 3 (3 Names) — Required */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-xs font-semibold text-neutral-200">
                    Majina ma 3 <span className="text-amber-400 font-bold">*</span>
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    {getWordCount(fullName3)}/3 majina
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400 pointer-events-none">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName3}
                    onChange={e => setFullName3(e.target.value)}
                    placeholder="David Michael Johnson"
                    required
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 px-1">
                  Andika majina matatu: Jina la kwanza, jina la kati, na la ukoo.
                </p>
              </div>

              {/* 3. Phone Number — Required */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-200 pl-1">
                  Nambari ya Simu (Phone number) <span className="text-amber-400 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+255 754 123 456"
                    required
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner font-mono"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 px-1">
                  Inatumika kwa malipo ya USSD (M-Pesa, Tigo Pesa, Airtel) na mawasiliano ya dereva.
                </p>
              </div>

              {/* 4. Email Address — Optional */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-xs font-semibold text-neutral-200">
                    Barua Pepe (Email)
                  </label>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                    Hiari (Optional)
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="david.johnson@example.com (si lazima)"
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* 5. Birthday (Tarehe ya Kuzaliwa) — Optional, kwa ajili ya Birthday Rewards */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-[#131316] border border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Birthday (Tarehe ya Kuzaliwa)</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                    Hiari (Optional)
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400 pointer-events-none">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={birthday}
                    onChange={e => setBirthday(e.target.value)}
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-2.5 pl-11 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* Birthday Rewards Toggle / Notice */}
                <label className="flex items-center space-x-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wantBirthdayRewards}
                    onChange={e => setWantBirthdayRewards(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0 w-3.5 h-3.5 accent-amber-500"
                  />
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    🎉 Pata zawadi ya chakula bure & punguzo la 25% siku ya birthday yako!
                  </span>
                </label>
              </div>

              {/* 6. Current Location (Otomatiki & Inaweza Kueditiwa) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-1">
                    <label className="block text-xs font-semibold text-neutral-200">
                      Eneo Lako la Sasa (Current Location) <span className="text-amber-400 font-bold">*</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => detectUserLocation(false)}
                    disabled={isDetectingLocation}
                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span>{isDetectingLocation ? 'Inatambua...' : 'Gundua GPS Tena'}</span>
                  </button>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-4 text-amber-400 pointer-events-none">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={e => setCurrentLocation(e.target.value)}
                    placeholder="Eneo lako (mfano: Masaki, Toure Drive, Dar es Salaam)"
                    required
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-20 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  />
                  <div className="absolute right-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      {locationDetected ? '✓ GPS Imepatikana' : 'Unaweza Kuediti'}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 px-1 flex items-center justify-between">
                  <span>Inatambuliwa moja kwa moja na GPS, na unaweza kubadilisha/kuediti muda wowote.</span>
                </p>
              </div>

              {/* 7. Password (Nenosiri) */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-200 pl-1">
                  Nenosiri (Password) <span className="text-amber-400 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Herufi 6 au zaidi"
                    required
                    className="w-full bg-[#111113] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500/80 rounded-full py-3.5 pl-11 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                    title={showPassword ? 'Ficha nenosiri' : 'Onyesha nenosiri'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and conditions */}
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
                    Ninakubali{' '}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setShowTermsModal(true);
                      }}
                      className="underline text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      Vigezo na Masharti
                    </button>{' '}
                    na{' '}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setShowTermsModal(true);
                      }}
                      className="underline text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      Sera ya Faragha
                    </button>{' '}
                    ya Zebra Restaurant.
                  </span>
                </label>
              </div>
            </>
          )}

          {/* 5. Main Action Button: Glowing Yellow-Gold Gradient Pill Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 px-6 rounded-full font-bold text-base text-neutral-950 bg-gradient-to-r from-[#f5b82e] via-[#f7cb45] to-[#f3ab18] hover:from-[#f7c244] hover:to-[#f5b41d] active:scale-[0.99] shadow-[0_8px_25px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? 'Log In' : 'Kamilisha Usajili (Sign Up)'}</span>
              )}
            </button>
          </div>

          {/* 6. Divider: "or continue with" */}
          <div className="relative flex items-center justify-center my-5">
            <div className="w-full border-t border-amber-900/40" />
            <span className="bg-[#0a0a0c] px-4 text-xs text-neutral-400 whitespace-nowrap">
              au endelea na mtandao
            </span>
            <div className="w-full border-t border-amber-900/40" />
          </div>

          {/* 7. Social Sign-in Buttons: Google & Facebook */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialClick('google')}
              className="w-full py-3 px-4 rounded-full bg-[#161619] hover:bg-[#1f1f24] border border-neutral-800 hover:border-neutral-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
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

            <button
              type="button"
              onClick={() => handleSocialClick('facebook')}
              className="w-full py-3 px-4 rounded-full bg-[#161619] hover:bg-[#1f1f24] border border-neutral-800 hover:border-neutral-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">
                f
              </div>
              <span>Facebook</span>
            </button>
          </div>

          {/* 8. Demo Autofill Button */}
          <div className="pt-3 flex items-center justify-center">
            <button
              type="button"
              onClick={isLogin ? () => handleDemoFillLogin('names') : handleDemoFillSignup}
              className="text-[11px] text-neutral-400 hover:text-amber-400 flex items-center space-x-1.5 py-1 px-3 rounded-full bg-[#141417] border border-neutral-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {isLogin
                  ? 'Jaza Taarifa za Demo za Kuingia'
                  : 'Jaza Fomu Yote ya Usajili (Demo)'}
              </span>
            </button>
          </div>
        </form>

        {/* 9. Logged In Quick Actions Banner */}
        {isLoggedIn && (
          <div className="mt-8 w-full p-4 rounded-3xl bg-[#141416] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-neutral-400">{user.email || user.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('home')}
                className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all cursor-pointer"
              >
                Agiza Chakula
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 text-neutral-300 font-semibold transition-all cursor-pointer"
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
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-3 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-neutral-200">
                  Kiungo cha kuweka upya nenosiri kimetumwa kwa{' '}
                  <strong className="text-amber-400">{forgotEmail || loginIdentifier}</strong>.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 w-full py-2.5 rounded-full bg-amber-500 text-black font-bold text-xs cursor-pointer"
                >
                  Sawa, Nimeelewa
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  Weka barua pepe au namba ya simu ili tukutumie nenosiri jipya:
                </p>
                <input
                  type="text"
                  value={forgotEmail || loginIdentifier}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="Email au Namba ya Simu"
                  className="w-full bg-[#111113] border border-neutral-800 rounded-full py-3 px-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => setForgotSubmitted(true)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#f5b82e] to-[#f3ab18] text-neutral-950 font-bold text-xs cursor-pointer"
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
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-neutral-300 space-y-2.5 leading-relaxed">
              <p>
                <strong>1. Usalama wa Akaunti:</strong> Akaunti yako inatumiwa kuwezesha maagizo ya vyakula na usafirishaji wa haraka Dar es Salaam (Masaki, Kariakoo, Oysterbay, Slipway, n.k).
              </p>
              <p>
                <strong>2. Malipo na USSD:</strong> Malipo yote yanafanyika kwa usalama kupitia M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, au Fedha Taslimu (Cash on Delivery).
              </p>
              <p>
                <strong>3. Birthday Rewards:</strong> Ukijaza tarehe yako ya kuzaliwa, utapata vocha maalum na punguzo la siku yako ya kuzaliwa.
              </p>
              <p>
                <strong>4. Eneo (Current Location):</strong> Eneo lako linatumika kukadiria muda wa usafirishaji (ETA) na kumwelekeza dereva wa pikipiki.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-full bg-amber-500 text-black font-bold text-xs cursor-pointer"
            >
              Nimekubali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
