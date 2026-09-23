import React from 'react';
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
  X
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
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
  const navSections = [
    {
      group: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
      group: 'Appearance & Help',
      items: [
        { id: 'help', label: 'Help', icon: HelpCircle },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-[#121215] border-r border-neutral-200 dark:border-neutral-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-lg font-bold shadow-sm">
            🦅
          </div>
          <div>
            <h1 className="font-extrabold text-base font-display text-neutral-900 dark:text-white leading-tight">
              Weagle
            </h1>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Zebra Restaurant Ops
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
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
