/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { WebHeader } from './components/WebHeader';
import { WebFooter } from './components/WebFooter';
import { HomeFeedView } from './components/HomeFeedView';
import { CartView } from './components/CartView';
import { FoodDetailModal } from './components/FoodDetailModal';
import { UssdPaymentModal } from './components/UssdPaymentModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { WaiterView } from './components/waiter/WaiterView';
import { AuthView } from './components/AuthView';
import { TableQrModal } from './components/TableQrModal';
import { CustomerTableModal } from './components/CustomerTableModal';
import { GlobalMapModal } from './components/GlobalMapModal';
import { Smartphone, Monitor, ShieldCheck, User, LogIn } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    androidFrame,
    setAndroidFrame,
    isLoggedIn,
    tables,
    activeTable,
    setActiveTable,
    activeQrTable,
    setActiveQrTable,
    showCustomerTableModal,
    setShowCustomerTableModal,
    callWaiterForTable,
    showGlobalMapModal,
    setShowGlobalMapModal
  } = useApp();

  const isDark = theme === 'dark';

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeedView />;
      case 'cart':
        return <CartView />;
      case 'orders':
        return isLoggedIn ? <OrderTrackingView /> : <AuthView />;
      case 'favorites':
        return <FavoritesView />;
      case 'profile':
        return isLoggedIn ? <ProfileView /> : <AuthView />;
      case 'auth':
        return <AuthView />;
      case 'waiter':
        return <WaiterView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <HomeFeedView />;
    }
  };

  // If in Phone Mockup mode
  if (androidFrame) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-start transition-colors duration-300 ${
          isDark ? 'bg-[#09090b]' : 'bg-neutral-100'
        }`}
      >
        {/* Top Desktop Toolbar to toggle Android Mockup vs Responsive View */}
        <header className="w-full py-2.5 px-4 flex items-center justify-between z-40 bg-black/60 backdrop-blur-md border-b border-white/10 text-xs text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="text-base">🦓</span>
            <span className="font-bold text-white tracking-wide font-display">
              Zebra Restaurant (Mobile Phone Simulator)
            </span>
            <span className="hidden sm:inline text-neutral-500">|</span>
            <span className="hidden sm:inline text-amber-400 font-medium">
              AmourCodes
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct access to Login / Regista page (Requested) */}
            <button
              onClick={() => setActiveTab(activeTab === 'auth' ? 'home' : 'auth')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                activeTab === 'auth'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm shadow-amber-400/40'
                  : 'bg-neutral-800 text-amber-400 hover:bg-neutral-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{activeTab === 'auth' ? 'Rudi Home' : 'Login / Regista'}</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-neutral-900'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {activeTab === 'admin' ? (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Customer View</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </>
              )}
            </button>

            {/* Switch to Full Website Mode */}
            <button
              onClick={() => setAndroidFrame(false)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <Monitor className="w-4 h-4" />
              <span>Switch to Full Website View</span>
            </button>
          </div>
        </header>

        {/* Mobile Mockup Device Enclosure */}
        <main className="w-full flex-1 flex justify-center py-6 px-4">
          <div
            className={`relative w-full max-w-[420px] h-[90vh] rounded-[44px] border-[8px] border-[#222228] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ${
              isDark ? 'bg-[#0f0f11]' : 'bg-[#fafafa]'
            }`}
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
        {activeQrTable && (
          <TableQrModal
            table={activeQrTable}
            onClose={() => setActiveQrTable(null)}
            onSelectTableForDineIn={(t) => {
              setActiveTable(t);
              setActiveTab('home');
            }}
          />
        )}
        {showCustomerTableModal && (
          <CustomerTableModal
            tables={tables}
            activeTable={activeTable}
            onSelectTable={(t) => {
              setActiveTable(t);
              setActiveTab('home');
            }}
            onClearTable={() => setActiveTable(null)}
            onClose={() => setShowCustomerTableModal(false)}
            onCallWaiter={(tableNumber, reason) => {
              callWaiterForTable(tableNumber, reason);
            }}
          />
        )}
      </div>
    );
  }

  // Full Website View ("websat view iwe fulu nayakupendeza")
  return (
    <div
      className={`min-h-screen flex flex-col overflow-x-hidden w-full max-w-full transition-colors duration-300 ${
        isDark ? 'bg-[#09090b] text-white' : 'bg-[#fafafa] text-neutral-900'
      }`}
    >
      {/* Full Website Header */}
      <WebHeader />

      {/* Main View Container (Full width responsive container with bottom padding for mobile floating nav) */}
      <main className="flex-1 w-full relative pb-24 sm:pb-28 lg:pb-8">
        {renderActiveView()}
      </main>

      {/* Website Footer - Desktop always, Mobile only on home feed */}
      <div className={`pb-16 lg:pb-0 ${activeTab === 'home' ? 'block' : 'hidden lg:block'}`}>
        <WebFooter />
      </div>

      {/* Floating Bottom Nav for Mobile Screens only */}
      <div className="lg:hidden">
        <AndroidNavBar />
      </div>

      {/* Detail & Payment Modals */}
      <FoodDetailModal />
      <UssdPaymentModal />

      {/* Table Dine-in & QR Modals */}
      {activeQrTable && (
        <TableQrModal
          table={activeQrTable}
          onClose={() => setActiveQrTable(null)}
          onSelectTableForDineIn={(t) => {
            setActiveTable(t);
            setActiveTab('home');
          }}
        />
      )}

      {showCustomerTableModal && (
        <CustomerTableModal
          tables={tables}
          activeTable={activeTable}
          onSelectTable={(t) => {
            setActiveTable(t);
            setActiveTab('home');
          }}
          onClearTable={() => setActiveTable(null)}
          onClose={() => setShowCustomerTableModal(false)}
          onCallWaiter={(tableNumber, reason) => {
            callWaiterForTable(tableNumber, reason);
          }}
        />
      )}

      {/* Global & Dar es Salaam Map Modal */}
      <GlobalMapModal
        isOpen={showGlobalMapModal}
        onClose={() => setShowGlobalMapModal(false)}
        isDark={isDark}
      />
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
