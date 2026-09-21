import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Bell,
  Settings,
  Download,
  FileText,
  Menu,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminTopBarProps {
  currentTab: AdminTab;
  onOpenMobileMenu: () => void;
  selectedDateRange: string;
  onSelectDateRange: (range: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
  onViewReports: () => void;
  onOpenSettings: () => void;
  notificationCount?: number;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  currentTab,
  onOpenMobileMenu,
  selectedDateRange,
  onSelectDateRange,
  searchQuery,
  onSearchChange,
  onExport,
  onViewReports,
  onOpenSettings,
  notificationCount = 3
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'tracking':
        return 'Live Fleet Tracking';
      case 'orders':
        return 'Orders Management';
      case 'drivers':
        return 'Drivers & Riders';
      case 'merchants':
        return 'Kitchens & Merchants';
      case 'payouts':
        return 'Merchant Payouts';
      case 'transactions':
        return 'Financial Transactions';
      case 'vouchers':
        return 'Promotions & Vouchers';
      case 'users':
        return 'Users & Roles';
      case 'analytics':
        return 'Analytics & Reports';
      case 'help':
        return 'Help & Documentation';
      case 'settings':
        return 'System Settings';
      default:
        return 'Dashboard';
    }
  };

  const DATE_OPTIONS = [
    'November 12, 2026',
    'Today, Sep 21, 2026',
    'Yesterday',
    'Last 7 Days',
    'This Month',
    'Year to Date (2026)'
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & Mobile Hamburger */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black font-display text-neutral-900 dark:text-white tracking-tight">
              {getTitle()}
            </h1>
          </div>

          {/* Quick date dropdown on mobile */}
          <div className="md:hidden relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
            >
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span className="truncate max-w-[120px]">{selectedDateRange}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Action Controls & Search (Matching Screenshot) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Picker Button (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-2xs transition-all"
            >
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>{selectedDateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showDatePicker && (
              <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-1 z-30 animate-fadeIn">
                {DATE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      onSelectDateRange(opt);
                      setShowDatePicker(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedDateRange === opt
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedDateRange === opt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-60 min-w-[140px]">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-2xs"
            title="Filter Results"
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* View Reports */}
          <button
            onClick={onViewReports}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xs transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-500" />
            <span>View Reports</span>
          </button>

          {/* Export Button (Orange accent matching screenshot) */}
          <button
            onClick={onExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm shadow-orange-600/30 transition-all active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 relative shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-neutral-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-4 z-40 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Recent Alerts (3)
                  </h4>
                  <button onClick={() => setShowNotifications(false)} className="text-neutral-400 hover:text-neutral-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-neutral-200">
                    <p className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">High Volume Delay Risk</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5">3 zones experiencing slow deliveries due to Kariakoo rain.</p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-neutral-800 dark:text-neutral-200">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">USSD M-Pesa Payment Received</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5">TZS 48,500 settled for Order #ZB-84920.</p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-neutral-800 dark:text-neutral-200">
                    <p className="font-bold text-blue-600 dark:text-blue-400 text-[11px]">New Driver Online</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5">Kelvin John checked in on Masaki Peninsula route.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Quick Access */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-2xs"
            title="System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Filter Operations View</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">City Zone</label>
                <select className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none">
                  <option value="all">All Zones (Dar es Salaam)</option>
                  <option value="masaki">Masaki & Oysterbay</option>
                  <option value="kariakoo">Kariakoo & CBD</option>
                  <option value="mikocheni">Mikocheni & Msasani</option>
                  <option value="kinondoni">Kinondoni & Sinza</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Delivery Status</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Delivered', 'On the Way', 'Preparing', 'Delayed'].map(st => (
                    <label key={st} className="flex items-center space-x-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-500" />
                      <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">{st}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
