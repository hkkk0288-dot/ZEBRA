/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { HomeFeedView } from './components/HomeFeedView';
import { CartView } from './components/CartView';
import { FoodDetailModal } from './components/FoodDetailModal';
import { UssdPaymentModal } from './components/UssdPaymentModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { Smartphone, Monitor, ShieldCheck, User } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, theme, androidFrame, setAndroidFrame, user } = useApp();

  const isDark = theme === 'dark';

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeedView />;
      case 'cart':
        return <CartView />;
      case 'orders':
        return <OrderTrackingView />;
      case 'favorites':
        return <FavoritesView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <HomeFeedView />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start transition-colors duration-300 ${
        isDark ? 'bg-[#09090b]' : 'bg-neutral-100'
      }`}
    >
      {/* Top Desktop Toolbar to toggle Android Mockup vs Responsive View */}
      <header className="w-full py-2 px-4 flex items-center justify-between z-40 bg-black/40 backdrop-blur-md border-b border-white/5 text-xs text-neutral-400">
        <div className="flex items-center space-x-2">
          <span className="text-base">🦓</span>
          <span className="font-bold text-white tracking-wide font-display">
            Zebra Restaurant
          </span>
          <span className="hidden sm:inline text-neutral-500">|</span>
          <span className="hidden sm:inline text-amber-400 font-medium">
            AmourCodes
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick role toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-neutral-900'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {activeTab === 'admin' ? (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Customer Mode</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </>
            )}
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={() => setAndroidFrame(!androidFrame)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white font-medium text-[11px] transition-colors"
          >
            {androidFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Expand Full Screen</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Android Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`w-full transition-all duration-300 flex justify-center py-0 ${
          androidFrame ? 'sm:py-6' : 'py-0'
        }`}
      >
        <div
          className={`relative w-full transition-all duration-300 ${
            androidFrame
              ? 'max-w-[420px] sm:h-[90vh] sm:rounded-[44px] sm:border-[8px] sm:border-[#222228] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col'
              : 'max-w-2xl min-h-screen flex flex-col'
          } ${isDark ? 'bg-[#0f0f11]' : 'bg-[#fafafa]'}`}
        >
          {/* Android Status Bar */}
          <AndroidStatusBar theme={theme} />

          {/* View Container */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {renderActiveView()}
          </div>

          {/* Floating Android Nav Bar */}
          <AndroidNavBar />
        </div>
      </main>

      {/* Modals */}
      <FoodDetailModal />
      <UssdPaymentModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
