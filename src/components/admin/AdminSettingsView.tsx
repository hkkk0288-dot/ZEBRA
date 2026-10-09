import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  DollarSign,
  Bell,
  Sun,
  Moon,
  Smartphone,
  Shield,
  Layers,
  Palette,
  Eye,
  Film,
  Image as ImageIcon,
  Store
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettingsView: React.FC<{ onNavigateToTab?: (tab: string) => void }> = ({ onNavigateToTab }) => {
  const { theme, toggleTheme, currency, setCurrency, appBranding, updateAppBranding, setShowSplashPreview } = useApp();
  const [tillNumber, setTillNumber] = useState('445566');
  const [baseDeliveryFee, setBaseDeliveryFee] = useState('3500');
  const [feePerKm, setFeePerKm] = useState('1000');
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [autoDispatchThreshold, setAutoDispatchThreshold] = useState('3');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>System Operations & Platform Settings</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure payment gateways, delivery pricing matrix, sound alerts, and dispatch rules
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Restaurant Operation Mode: Single Restaurant vs Multi-Branch */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2 text-sm font-bold text-neutral-900 dark:text-white">
            <Store className="w-4 h-4 text-emerald-500" />
            <span>Aina ya Mgahawa (Single Restaurant vs Multi-Branch)</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            {(appBranding.restaurantMode || 'single') === 'multi' ? 'Multi-Branch Network' : 'Single Restaurant'}
          </span>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Kama mfumo ni <strong>Single Restaurant</strong>, mteja anapobofya ramani anafunguliwa ramani ya kuchagua au kubadilisha eneo lake tu la kuletewa chakula (Delivery Location). Kama ni <strong>Multi-Branch</strong>, wateja wanaona ramani ya matawi yote.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Single Mode Card */}
          <button
            type="button"
            onClick={() => {
              updateAppBranding({ restaurantMode: 'single' });
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 2500);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              (appBranding.restaurantMode || 'single') === 'single'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/50'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center space-x-1.5">
                <span>🍽️</span>
                <span>Mgahawa Mmoja (Single Restaurant)</span>
              </span>
              {(appBranding.restaurantMode || 'single') === 'single' && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Jiko moja kuu. Wateja wanapobofya ramani wanabadilisha eneo lao tu la kuletewa chakula (Delivery Location Picker).
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              ✓ Inapendekezwa (Chaguo Linalotumika)
            </span>
          </button>

          {/* Multi Mode Card */}
          <button
            type="button"
            onClick={() => {
              updateAppBranding({ restaurantMode: 'multi' });
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 2500);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              appBranding.restaurantMode === 'multi'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/50'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center space-x-1.5">
                <span>🌐</span>
                <span>Matawi Mengi (Multi-Restaurant / Multi-Hub)</span>
              </span>
              {appBranding.restaurantMode === 'multi' && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Matawi mengi (Masaki, Kariakoo, Slipway, n.k.). Wateja wanaona ramani ya matawi yote na wanaweza kuchagua tawi.
            </p>
            <span className="inline-block text-[10px] font-bold text-blue-500">
              ✓ Mtandao wa matawi na hubs
            </span>
          </button>
        </div>
      </div>

      {/* Featured Logo & Splash Screen Quick Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center text-2xl shadow-md overflow-hidden border border-white/20 shrink-0">
            {appBranding.logoUrl ? (
              <img
                src={appBranding.logoUrl}
                alt={appBranding.appName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{appBranding.logoEmoji || '🍗'}</span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                {appBranding.appName} • Logo & Splash Screen
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                appBranding.splashEnabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-neutral-500/20 text-neutral-400'
              }`}>
                {appBranding.splashEnabled ? 'Splash Active' : 'Splash Off'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Nembo ya app na video/picha za Splash Screen ({appBranding.splashSlides.length} slide{appBranding.splashSlides.length === 1 ? '' : 's'}).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSplashPreview(true)}
            className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Tazama Splash</span>
          </button>

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('branding')}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-600/20 transition-all cursor-pointer active:scale-95"
            >
              <Palette className="w-4 h-4" />
              <span>Sanidi Logo & Splash ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Theme & Colors Quick Card */}
      <div
        className="p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all"
        style={{
          backgroundColor: `${appBranding.themeColor || '#f59e0b'}15`,
          borderColor: `${appBranding.themeColor || '#f59e0b'}40`
        }}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white/40 shrink-0 text-white"
            style={{ backgroundColor: appBranding.themeColor || '#f59e0b' }}
          >
            🎨
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                Rangi & Mandhari ya Mfumo Mzima (Global Theme)
              </h3>
              <span
                className="px-2.5 py-0.5 rounded-full text-white font-black text-[10px] uppercase tracking-wider"
                style={{ backgroundColor: appBranding.themeColor || '#f59e0b' }}
              >
                {appBranding.themePreset || 'amber'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Badili rangi ya tovuti, programu ya simu (Mobile Phone View), na Admin Panel (Inasaidia palette 10 za kipekee au Custom Hex Color).
            </p>
          </div>
        </div>

        {onNavigateToTab && (
          <button
            type="button"
            onClick={() => onNavigateToTab('themes')}
            className="px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
            style={{ backgroundColor: appBranding.themeColor || '#f59e0b' }}
          >
            <Palette className="w-4 h-4" />
            <span>Badilisha Rangi za Mfumo ➔</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* USSD Lipa Namba & Payment Gateway */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-neutral-900 dark:text-white">
            <Smartphone className="w-4 h-4 text-orange-500" />
            <span>USSD & Payment Gateway</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
                Vodacom M-Pesa / Tigo / Airtel Till Number (Lipa Namba)
              </label>
              <input
                type="text"
                value={tillNumber}
                onChange={e => setTillNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
                Storefront Default Currency
              </label>
              <div className="flex space-x-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setCurrency('TZS')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    currency === 'TZS'
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  TZS (Tanzanian Shillings)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    currency === 'USD'
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logistics & Delivery Rates */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-neutral-900 dark:text-white">
            <Layers className="w-4 h-4 text-orange-500" />
            <span>Delivery Rates & Dispatch Automation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
                Base Delivery Fee (TZS)
              </label>
              <input
                type="number"
                value={baseDeliveryFee}
                onChange={e => setBaseDeliveryFee(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
                Rate per Km beyond 3km (TZS)
              </label>
              <input
                type="number"
                value={feePerKm}
                onChange={e => setFeePerKm(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
                Auto-Dispatch Radius (Km)
              </label>
              <input
                type="number"
                value={autoDispatchThreshold}
                onChange={e => setAutoDispatchThreshold(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visual & Alerts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-neutral-900 dark:text-white">
            <Bell className="w-4 h-4 text-orange-500" />
            <span>Alerts & Appearance</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-neutral-900 dark:text-white">Audio Dispatch Chimes</p>
              <p className="text-neutral-400">Play chime when new order arrives or high volume risk detected</p>
            </div>
            <button
              type="button"
              onClick={() => setEnableSoundAlerts(!enableSoundAlerts)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                enableSoundAlerts
                  ? 'bg-emerald-500 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              {enableSoundAlerts ? 'Sound Enabled' : 'Muted'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="font-bold text-neutral-900 dark:text-white">Admin Theme Mode</p>
              <p className="text-neutral-400">Switch between light studio and dark control room aesthetic</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
};
