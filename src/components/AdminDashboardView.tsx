import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminTopBar } from './admin/AdminTopBar';
import { AdminDashboardOverview } from './admin/AdminDashboardOverview';
import { AdminLiveTracking } from './admin/AdminLiveTracking';
import { AdminOrdersView } from './admin/AdminOrdersView';
import { AdminDriversView } from './admin/AdminDriversView';
import { AdminProductsView } from './admin/AdminProductsView';
import { AdminMerchantsView } from './admin/AdminMerchantsView';
import { AdminPayoutsView } from './admin/AdminPayoutsView';
import { AdminTransactionsView } from './admin/AdminTransactionsView';
import { AdminVouchersView } from './admin/AdminVouchersView';
import { AdminBannersView } from './admin/AdminBannersView';
import { AdminUsersView } from './admin/AdminUsersView';
import { AdminAnalyticsView } from './admin/AdminAnalyticsView';
import { AdminHelpView } from './admin/AdminHelpView';
import { AdminSettingsView } from './admin/AdminSettingsView';
import { WaiterView } from './waiter/WaiterView';
import { PosTerminalView } from './pos/PosTerminalView';
import { OrderStatusScreenView } from './oss/OrderStatusScreenView';
import { KitchenDisplayView } from './kds/KitchenDisplayView';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Download,
  FileText
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { theme, currency, setActiveTab, menuItems, banners } = useApp();
  const isDark = theme === 'dark';

  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('November 12, 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [showZoneDelayModal, setShowZoneDelayModal] = useState(false);
  const [showReportSummaryModal, setShowReportSummaryModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Export action
  const handleExport = () => {
    setExportNotice('Exporting CSV of operations and orders...');
    setTimeout(() => {
      setExportNotice(null);
      alert('Orders & Telemetry Report exported successfully! File downloaded.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0c0c0e] text-neutral-900 dark:text-neutral-100 flex antialiased">
      {/* Persistent / Responsive Admin Sidebar (Matching Screenshot) */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        onSwitchToStorefront={() => setActiveTab('home')}
        onOpenZoneAlert={() => setShowZoneDelayModal(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        ordersBadge={10}
        driversBadge={8}
        productsBadge={menuItems.length}
        payoutsBadge={4}
        transactionsBadge={5}
        vouchersBadge={12}
        bannersBadge={banners.length}
        usersBadge={6}
      />

      {/* Main Admin Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar (Search, Date Picker, Export, Notifications, Theme, Add Product) */}
        <AdminTopBar
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          selectedDateRange={selectedDateRange}
          onSelectDateRange={range => setSelectedDateRange(range)}
          searchQuery={searchQuery}
          onSearchChange={q => setSearchQuery(q)}
          onExport={handleExport}
          onViewReports={() => setShowReportSummaryModal(true)}
          onOpenSettings={() => setCurrentTab('settings')}
          onNavigateToTab={tab => setCurrentTab(tab)}
          notificationCount={3}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {exportNotice && (
            <div className="mb-4 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-between animate-fadeIn">
              <span>{exportNotice}</span>
              <span className="animate-spin">⏳</span>
            </div>
          )}

          {currentTab === 'dashboard' && (
            <AdminDashboardOverview
              onNavigateToTab={tab => setCurrentTab(tab)}
              currency={currency}
              isDark={isDark}
            />
          )}

          {currentTab === 'pos' && <PosTerminalView />}

          {currentTab === 'oss' && <OrderStatusScreenView />}

          {currentTab === 'kds' && <KitchenDisplayView />}

          {currentTab === 'tracking' && <AdminLiveTracking isDark={isDark} />}

          {currentTab === 'orders' && <AdminOrdersView isDark={isDark} />}

          {currentTab === 'waiter' && <WaiterView />}

          {currentTab === 'drivers' && <AdminDriversView isDark={isDark} />}

          {currentTab === 'products' && <AdminProductsView />}

          {currentTab === 'merchants' && <AdminMerchantsView isDark={isDark} />}

          {currentTab === 'payouts' && <AdminPayoutsView currency={currency} />}

          {currentTab === 'transactions' && <AdminTransactionsView currency={currency} />}

          {currentTab === 'vouchers' && <AdminVouchersView currency={currency} />}

          {currentTab === 'banners' && <AdminBannersView />}

          {currentTab === 'users' && <AdminUsersView currency={currency} />}

          {currentTab === 'analytics' && <AdminAnalyticsView currency={currency} />}

          {currentTab === 'help' && <AdminHelpView />}

          {currentTab === 'settings' && <AdminSettingsView />}
        </main>
      </div>

      {/* Zone Delay Alert Modal (Triggered by "See zones" in screenshot) */}
      {showZoneDelayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2 text-amber-500">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  High Volume Delay Risk: 3 Zones
                </h3>
              </div>
              <button onClick={() => setShowZoneDelayModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="text-neutral-500">
                Heavy order concentration detected in the following courier clusters:
              </p>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <p className="font-bold text-neutral-900 dark:text-white">1. Kariakoo Market & CBD</p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Afternoon tropical rain causing traffic bottle-neck on Msimbazi St. Average courier delay +18 min.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 space-y-1">
                <p className="font-bold text-neutral-900 dark:text-white">2. Masaki Peninsula & Slipway</p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Surge dinner demand: 14 active orders waiting for pickup at Central Kitchen.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 space-y-1">
                <p className="font-bold text-neutral-900 dark:text-white">3. Mikocheni B & Old Bagamoyo Rd</p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Road resurfacing reroute between Mikocheni and Mwenge.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  alert('Surge incentive (+2,000 TZS per delivery) broadcasted to all active Boda-boda riders!');
                  setShowZoneDelayModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Activate Surge Incentive (+2,000 TZS / Rider)
              </button>
              <button
                onClick={() => setShowZoneDelayModal(false)}
                className="w-full py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Summary Modal */}
      {showReportSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Executive Operations Report ({selectedDateRange})
                </h3>
              </div>
              <button onClick={() => setShowReportSummaryModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-[11px] text-neutral-400 block">Total Deliveries</span>
                  <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">8,412 orders</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-[11px] text-neutral-400 block">Total Gross Revenue</span>
                  <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">$128,450 USD</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-[11px] text-neutral-400 block">USSD M-Pesa Settlement</span>
                  <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">99.4% Success</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-[11px] text-neutral-400 block">Customer Rating</span>
                  <span className="text-lg font-bold text-amber-500">★ 4.88 / 5.0</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-neutral-700 dark:text-neutral-300">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">Platform Operational Health: Excellent</p>
                <p className="text-[11px] mt-0.5">All 4 kitchen hubs online, zero dispatch outages recorded.</p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Download Report</span>
              </button>
              <button
                onClick={() => setShowReportSummaryModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
