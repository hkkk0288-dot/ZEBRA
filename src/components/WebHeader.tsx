import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Clock,
  User,
  Moon,
  Sun,
  MapPin,
  PhoneCall,
  LogIn,
  UtensilsCrossed,
  ShieldCheck,
  QrCode,
  Calendar,
  Award,
  Globe2,
  Tv,
  Store,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  LogOut,
  Volume2,
  VolumeX,
  Gift,
  Menu,
  X
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { LuckySpinWheelModal } from './LuckySpinWheelModal';
import { AppLogo } from './AppLogo';
import { Headset } from 'lucide-react';
import { useLiveCall } from '../context/LiveCallContext';

export const WebHeader: React.FC = () => {
  const { openCallModal, unreadMessagesCount } = useLiveCall();
  const {
    activeTab,
    setActiveTab,
    goBack,
    canGoBack,
    customerDeliveryLocation,
    cart,
    orders,
    user,
    isLoggedIn,
    logout,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    activeTable,
    setShowCustomerTableModal,
    setShowReservationModal,
    setShowGlobalMapModal,
    setShowLocationPickerModal,
    openLocationOrMapModal,
    loyaltyPoints,
    language,
    toggleLanguage,
    soundEnabled,
    toggleSound,
    setShowScratchModal,
    openRiderTracker,
    t,
    appBranding
  } = useApp();

  const isSingle = (appBranding.restaurantMode || 'single') === 'single';
  const isMulti = appBranding.restaurantMode === 'multi';
  const activeBranches = (appBranding.branches || []).filter(b => b.active !== false);
  const showBranchMap = isMulti && activeBranches.length > 0;
  const isDark = theme === 'dark';
  const [showLuckyWheel, setShowLuckyWheel] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const activeOrdersCount = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors border-b backdrop-blur-md ${
        isDark
          ? 'bg-[#0f0f11]/95 border-neutral-800/80 text-white'
          : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-sm'
      }`}
    >
      {/* Top Notification Bar for Delivery and USSD */}
      <div
        className="text-white text-[10px] sm:text-[11px] py-1 px-3 sm:px-4 font-medium"
        style={{ backgroundColor: 'var(--brand-primary, #f59e0b)' }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="bg-emerald-700 text-white px-1.5 py-0.5 rounded-full font-bold text-[9px] shrink-0">
              FAST DELIVERY
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-50">
              Masaki • Slipway • Dar
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="hidden sm:inline font-mono">
              Lipa Namba: <strong className="text-amber-200">445566</strong>
            </span>
            <span className="font-semibold text-amber-200 text-[10px]">
              Dev: AmourCodes
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Global Web Back Button when not on home screen */}
            {activeTab !== 'home' && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/90 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                title="Rudi Nyuma (Back)"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-500" />
                <span className="inline">Rudi</span>
              </button>
            )}

            {/* Logo & Brand */}
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0"
            >
              <AppLogo size="sm" />
              <div>
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className="font-display font-extrabold text-sm sm:text-lg lg:text-xl tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
                    {appBranding.appName}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold bg-amber-500/20 text-amber-500 px-1 py-0.5 rounded shrink-0">
                    DAR
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (showBranchMap) {
                      setShowGlobalMapModal(true);
                    } else {
                      setShowLocationPickerModal(true);
                    }
                  }}
                  className="text-[9px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center space-x-1 hover:text-emerald-400 transition-colors cursor-pointer group"
                  title={showBranchMap ? "Tazama Ramani ya Matawi" : "Badilisha eneo lako la delivery kwenye ramani"}
                >
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px] border-b border-dotted border-neutral-400/60 group-hover:border-emerald-400 font-medium">
                    {showBranchMap ? `${activeBranches.length} Matawi (Dar)` : customerDeliveryLocation}
                  </span>
                  {!showBranchMap && (
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20 group-hover:bg-emerald-500/20 shrink-0">
                      Badilisha
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar - Compact & Responsive */}
          <div className="hidden md:flex flex-1 max-w-[180px] xl:max-w-xs mx-2 xl:mx-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tafuta chakula..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none border transition-all ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'text-emerald-500 font-bold bg-emerald-500/10'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
              }`}
            >
              Menu
            </button>

            {/* Combined Staff / POS Dropdown - replaces 4 wide buttons with 1 clean dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStaffDropdown(prev => !prev)}
                className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center space-x-1 text-xs font-bold cursor-pointer ${
                  activeTab === 'pos' || activeTab === 'oss' || activeTab === 'waiter' || activeTab === 'admin'
                    ? 'bg-emerald-500 text-neutral-950 font-extrabold shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                }`}
                title="POS, OSS, Waiter na Admin Tools"
              >
                <Store className="w-3.5 h-3.5 text-emerald-500" />
                <span>POS & Skrini</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {showStaffDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStaffDropdown(false)}
                  />
                  <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setActiveTab('oss');
                        setShowStaffDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        activeTab === 'oss'
                          ? 'bg-emerald-500/15 text-emerald-500 font-bold'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <Tv className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-bold flex items-center space-x-1">
                          <span>OSS Screen</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div className="text-[10px] text-neutral-400">Token TV Display mezani</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('pos');
                        setShowStaffDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        activeTab === 'pos'
                          ? 'bg-teal-500/15 text-teal-400 font-bold'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <Store className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <div className="font-bold">POS Terminal</div>
                        <div className="text-[10px] text-neutral-400">Counter & Cashier POS</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('waiter');
                        setShowStaffDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        activeTab === 'waiter'
                          ? 'bg-amber-500/15 text-amber-500 font-bold'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold">Waiter POS</div>
                        <div className="text-[10px] text-neutral-400">Wahudumu na Meza</div>
                      </div>
                    </button>

                    {isLoggedIn && user.role === 'admin' && (
                      <>
                        <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setShowStaffDropdown(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                            activeTab === 'admin'
                              ? 'bg-orange-500/15 text-orange-500 font-bold'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-orange-500'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                          <div>
                            <div className="font-bold flex items-center space-x-1.5">
                              <span>Admin Dashboard</span>
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              Usimamizi na Mipangilio
                            </div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mhudumu Live (Call & Chat) */}
            <button
              onClick={() => openCallModal('chat')}
              className="p-2 xl:px-2.5 xl:py-1.5 rounded-xl transition-all flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-neutral-950 text-amber-500 font-bold border border-amber-500/20 cursor-pointer"
              title="Mhudumu Live: Chati na Simu za Moja kwa Moja"
            >
              <Headset className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-xs">Mhudumu Live</span>
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            {/* Favorites */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`p-2 xl:px-2.5 xl:py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'text-emerald-500 font-bold bg-emerald-500/10'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
              }`}
              title="Vyakula Ulivyovipenda"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden xl:inline text-xs">Favorites</span>
              {user.favoriteItemIds.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {user.favoriteItemIds.length}
                </span>
              )}
            </button>

            {/* Track Orders & Profile (if logged in) */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`p-2 xl:px-2.5 xl:py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'text-emerald-500 font-bold bg-emerald-500/10'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
                  }`}
                  title="Fuatilia Oda Yako"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden xl:inline text-xs">Orders</span>
                  {activeOrdersCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-2.5 py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer ${
                    activeTab === 'profile'
                      ? 'text-emerald-500 font-bold bg-emerald-500/10'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
                  }`}
                  title="Akaunti Yangu"
                >
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate max-w-[70px] text-xs">{user.name.split(' ')[0] || 'Akaunti'}</span>
                </button>

                {/* Direct Admin Access only for logged-in Admin */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center space-x-1 text-xs font-bold cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-amber-500 text-neutral-950 font-black shadow-xs'
                        : 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border border-amber-500/30'
                    }`}
                    title="Dashibodi ya Admin"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  title="Toka kwenye akaunti"
                  className="p-1.5 xl:px-2.5 xl:py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 xl:hidden" />
                  <span className="hidden xl:inline">Toka</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingia</span>
              </button>
            )}
          </div>

          {/* Quick Actions (Table, Currency, Theme, Cart) - GUARANTEED TO FIT AND ALWAYS VISIBLE */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Table / QR Dine-In Indicator */}
            {activeTable ? (
              <button
                onClick={() => setShowCustomerTableModal(true)}
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-1 hover:bg-emerald-500/30 transition-all cursor-pointer shrink-0"
                title="Upo mezani. Bofya kuona maelezo"
              >
                <UtensilsCrossed className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate max-w-[65px]">{activeTable.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowCustomerTableModal(true)}
                className="flex items-center space-x-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-all cursor-pointer shrink-0"
                title="Umeketi mezani? Bofya kuingiza namba ya meza au kuchanganua QR"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Mezani</span>
              </button>
            )}

            {/* Live Rider Tracker button */}
            <button
              onClick={() => openRiderTracker()}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
              title="Fuatilia dereva wako kwenye ramani (Live GPS Tracker)"
            >
              <span>🛵</span>
              <span>Tracker</span>
            </button>

            {/* Scratch & Win Gift Card */}
            <button
              onClick={() => setShowScratchModal(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 hover:bg-amber-500/25 transition-colors shrink-0 cursor-pointer"
              title="Kadi ya Zawadi ya Kujikuna (Scratch & Win Card)"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Language Switcher (SWA / ENG) */}
            <button
              onClick={toggleLanguage}
              className={`text-xs font-bold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
              }`}
              title="Badili Lugha / Switch Language"
            >
              {language === 'sw' ? '🇹🇿 SWA' : '🇬🇧 ENG'}
            </button>

            {/* Sound Chimes Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                  : 'bg-neutral-800/40 border-neutral-700 text-neutral-500'
              }`}
              title={soundEnabled ? 'Sauti za jikoni na kengele zimewashwa' : 'Sauti zimezimwa'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'TZS' : 'USD')}
              className={`text-xs font-bold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
              }`}
              title="Badili Sarafu (Switch currency)"
            >
              {currency === 'USD' ? '$ USD' : 'TZS'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-amber-400 hover:bg-neutral-700'
                  : 'bg-neutral-100 border-neutral-300 text-amber-600 hover:bg-neutral-200'
              }`}
              title="Toggle Dark / Light Mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Cart Button - ALWAYS 100% VISIBLE AND FULLY FITTING */}
            <button
              onClick={() => setActiveTab('cart')}
              className="flex items-center space-x-1.5 text-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-md transition-transform active:scale-95 shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--brand-primary, #f59e0b)',
                boxShadow: '0 8px 20px -4px var(--brand-primary-shadow, rgba(245, 158, 11, 0.35))'
              }}
              title="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[9px] sm:text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold whitespace-nowrap">
                {cartCount === 0 ? 'Cart' : formatPrice(cartTotal, currency)}
              </span>
            </button>

            {/* Mobile Menu Button - Opens Full Platform Drawer so NO features are hidden on phone view */}
            <button
              onClick={() => setShowMobileDrawer(prev => !prev)}
              className="lg:hidden p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 transition-colors shrink-0 cursor-pointer"
              title="Menyu Kamili ya Simu"
            >
              {showMobileDrawer ? <X className="w-4 h-4 text-rose-500" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar if viewport is small */}
        <div className="md:hidden mt-2.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tafuta pizza, burger, mishkaki, biryani..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl sm:rounded-2xl text-xs outline-none border ${
                isDark
                  ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Full-Featured Mobile Slide-Out Drawer ("sioni fulu kunavitu sivioni" - now EVERYTHING is 100% visible) */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileDrawer(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[85%] max-w-sm h-full bg-white dark:bg-[#121215] text-neutral-900 dark:text-white z-50 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AppLogo size="sm" />
                <div>
                  <h3 className="font-extrabold text-sm font-display tracking-tight text-neutral-900 dark:text-white">
                    {appBranding.appName}
                  </h3>
                  <p className="text-[10px] text-neutral-400">Masaki • Slipway • Dar es Salaam</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body Items */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {/* Delivery / Lipa Namba Info */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Lipa Namba ya Haraka</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500 text-neutral-950 px-2 py-0.5 rounded-full">445566</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                  M-Pesa (*150*00#), Tigo Pesa, Airtel & Halopesa.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileDrawer(false);
                    setShowLocationPickerModal(true);
                  }}
                  className="w-full mt-1 flex items-center justify-between text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-xl border border-emerald-500/20"
                >
                  <span className="flex items-center space-x-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{customerDeliveryLocation}</span>
                  </span>
                  <span className="text-[10px] font-bold shrink-0">Badili</span>
                </button>
              </div>

              {/* Customer Quick Features */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1">Huduma & Menyu</p>

                <button
                  onClick={() => {
                    setActiveTab('home');
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <Store className="w-4 h-4 text-emerald-500" />
                    <span>Menyu Kuu (All Dishes)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">Tazama</span>
                </button>

                <button
                  onClick={() => {
                    setShowCustomerTableModal(true);
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <QrCode className="w-4 h-4 text-teal-400" />
                    <span>Meza Yangu & Dine-in</span>
                  </span>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">
                    {activeTable ? `Meza ${activeTable.name}` : 'Chagua'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    openRiderTracker();
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-sm">🛵</span>
                    <span>Live GPS Rider Tracker</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Ramani</span>
                </button>

                <button
                  onClick={() => {
                    setShowLuckyWheel(true);
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-sm">🎡</span>
                    <span>Gurudumu la Bahati (Spin & Win)</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Zawadi</span>
                </button>

                <button
                  onClick={() => {
                    setShowScratchModal(true);
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <Gift className="w-4 h-4 text-amber-500" />
                    <span>Kadi ya Kujikuna (Scratch Card)</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Free</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('favorites');
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Vyakula Vilivyopendwa</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">{user.favoriteItemIds.length}</span>
                </button>

                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setShowMobileDrawer(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                  >
                    <span className="flex items-center space-x-2.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Fuatilia Oda Zangu</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full">
                      {activeOrdersCount} hai
                    </span>
                  </button>
                )}
              </div>

              {/* Operations & Staff Quick Access */}
              <div className="space-y-1 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1">Skrini za Operesheni</p>

                <button
                  onClick={() => {
                    setActiveTab('oss');
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <Tv className="w-4 h-4 text-teal-400" />
                    <span>OSS Token TV Display</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('pos');
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <Store className="w-4 h-4 text-teal-400" />
                    <span>POS Terminal (Cashier)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">Counter</span>
                </button>

                <button
                  onClick={() => {
                    openCallModal('chat');
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold transition-colors text-amber-500 border border-amber-500/20"
                >
                  <span className="flex items-center space-x-2.5">
                    <Headset className="w-4 h-4 text-amber-500" />
                    <span>Mhudumu Live (Call & Chat)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full">Live</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('waiter');
                    setShowMobileDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                    <span>Waiter POS (Wahudumu)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">Meza</span>
                </button>

                {/* Admin Dashboard: ONLY visible to logged-in Admin */}
                {isLoggedIn && user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setShowMobileDrawer(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-extrabold transition-colors"
                  >
                    <span className="flex items-center space-x-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span>Admin Dashboard</span>
                    </span>
                    <span className="text-[10px] bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.5 rounded">Msimamizi</span>
                  </button>
                )}
              </div>

              {/* Preferences Settings */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1">Mipangilio</p>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={toggleLanguage}
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-center space-x-1"
                  >
                    <span>{language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span>
                  </button>

                  <button
                    onClick={() => setCurrency(currency === 'USD' ? 'TZS' : 'USD')}
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-center space-x-1"
                  >
                    <span>{currency === 'USD' ? '$ USD' : 'TZS'}</span>
                  </button>

                  <button
                    onClick={toggleSound}
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-center space-x-1"
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
                    <span>{soundEnabled ? 'Sauti: On' : 'Sauti: Off'}</span>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-center space-x-1"
                  >
                    {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-700" />}
                    <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Auth Section */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => {
                      setActiveTab('profile');
                      setShowMobileDrawer(false);
                    }}
                    className="flex items-center space-x-2.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{user.email || user.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowMobileDrawer(false);
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Toka"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('auth');
                    setShowMobileDrawer(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingia au Jisajili (Customer Login)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lucky Spin Wheel Modal */}
      <LuckySpinWheelModal
        isOpen={showLuckyWheel}
        onClose={() => setShowLuckyWheel(false)}
      />
    </header>
  );
};
