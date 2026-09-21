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
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettingsView: React.FC = () => {
  const { theme, toggleTheme, currency, setCurrency } = useApp();
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
