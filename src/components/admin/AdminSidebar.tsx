import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  ShoppingBag,
  Bike,
  Store,
  CreditCard,
  Receipt,
  Gift,
  Users,
  BarChart3,
  HelpCircle,
  Settings,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  UtensilsCrossed,
  Sparkles,
  Tv,
  X,
  Palette,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'pos'
  | 'oss'
  | 'kds'
  | 'tracking'
  | 'orders'
  | 'waiter'
  | 'drivers'
  | 'products'
  | 'merchants'
  | 'payouts'
  | 'transactions'
  | 'vouchers'
  | 'banners'
  | 'branding'
  | 'themes'
  | 'users'
  | 'analytics'
  | 'help'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onSwitchToStorefront: () => void;
  onOpenZoneAlert: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  ordersBadge?: number;
  driversBadge?: number;
  productsBadge?: number;
  payoutsBadge?: number;
  transactionsBadge?: number;
  vouchersBadge?: number;
  bannersBadge?: number;
  usersBadge?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onSwitchToStorefront,
  onOpenZoneAlert,
  isOpenMobile = false,
  onCloseMobile,
  ordersBadge = 10,
  driversBadge = 8,
  productsBadge = 14,
  payoutsBadge = 4,
  transactionsBadge = 5,
  vouchersBadge = 12,
  bannersBadge,
  usersBadge = 6
}) => {
  const { appBranding, user, logout, setActiveTab } = useApp();

  const navSections = [
    {
      group: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pos', label: 'POS Terminal', icon: Store },
        { id: 'oss', label: 'OSS Token Screen', icon: Tv },
        { id: 'kds', label: 'KDS Kitchen', icon: UtensilsCrossed },
        { id: 'tracking', label: 'Live Tracking', icon: MapPin },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: ordersBadge },
        { id: 'waiter', label: 'Waiter POS & Floor', icon: UtensilsCrossed },
        { id: 'drivers', label: 'Drivers', icon: Bike, badge: driversBadge },
        { id: 'products', label: 'Products & Dishes', icon: UtensilsCrossed, badge: productsBadge },
        { id: 'merchants', label: 'Kitchen Branches', icon: Store }
      ]
    },
    {
      group: 'Finances & Marketing',
      items: [
        { id: 'banners', label: 'Slide Banners (Mabango)', icon: Sparkles, badge: bannersBadge },
        { id: 'vouchers', label: 'Promotions & Vouchers', icon: Gift, badge: vouchersBadge },
        { id: 'payouts', label: 'Merchant Payouts', icon: CreditCard, badge: payoutsBadge },
        { id: 'transactions', label: 'Transactions', icon: Receipt, badge: transactionsBadge }
      ]
    },
    {
      group: 'Administration',
      items: [
        { id: 'users', label: 'Users & Merchants', icon: Users, badge: usersBadge },
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 }
      ]
    },
    {
      group: 'Appearance & Brand',
      items: [
        { id: 'themes', label: 'Rangi & Mandhari (Theme)', icon: Palette },
        { id: 'branding', label: 'Logo & Splash Screen', icon: Sparkles },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help', icon: HelpCircle }
      ]
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-[#121215] border-r border-neutral-200 dark:border-neutral-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-lg font-bold shadow-sm overflow-hidden border border-amber-500/20 shrink-0">
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
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm sm:text-base font-display text-neutral-900 dark:text-white leading-tight truncate">
              {appBranding.appName || 'Kookoos'}
            </h1>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
              Admin Ops Center
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
        {navSections.map(section => (
          <div key={section.group} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              {section.group}
            </h3>

            <div className="space-y-0.5">
              {section.items.map(item => {
                const isActive = currentTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id as AdminTab);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'text-white shadow-sm font-bold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                    style={isActive ? { backgroundColor: 'var(--brand-primary, #f59e0b)' } : undefined}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-white'
                            : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-black/25 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Alert Card (As seen in the screenshot) */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
        <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50 space-y-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-[11px] font-bold text-neutral-900 dark:text-white leading-tight">
              High volume today delay risk in 3 zones
            </p>
          </div>

          <button
            onClick={onOpenZoneAlert}
            className="w-full py-1.5 px-3 rounded-xl bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 text-white text-[11px] font-bold transition-all shadow-xs"
          >
            See zones
          </button>
        </div>

        {/* Logged in Admin Profile Badge & Logout */}
        <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {user.name || 'Admin'}
              </p>
              <p className="text-[10px] text-amber-500 font-semibold truncate">
                {user.systemRole || 'Super Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              setActiveTab('home');
            }}
            className="p-1.5 rounded-xl hover:bg-rose-500/20 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
            title="Toka kwenye Admin (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Back to Customer Storefront */}
        <button
          onClick={onSwitchToStorefront}
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customer Storefront</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full shadow-2xl animate-slideRight">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
