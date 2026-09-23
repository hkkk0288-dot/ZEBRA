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
  Globe2
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const WebHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
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
    loyaltyPoints
  } = useApp();

  const isDark = theme === 'dark';

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
      <div className="bg-emerald-600 text-white text-[10px] sm:text-[11px] py-1 px-3 sm:px-4 font-medium">
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
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center text-base sm:text-xl shadow-md shadow-emerald-500/20 shrink-0">
              🦓
            </div>
            <div>
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="font-display font-extrabold text-sm sm:text-lg lg:text-xl tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
                  Zebra Restaurant
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold bg-amber-500/20 text-amber-500 px-1 py-0.5 rounded shrink-0">
                  DAR
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGlobalMapModal(true)}
                className="text-[9px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center space-x-1 hover:text-emerald-400 transition-colors cursor-pointer group"
                title="Tazama Ramani ya Dunia & Dar es Salaam"
              >
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="whitespace-nowrap border-b border-dotted border-neutral-400/60 group-hover:border-emerald-400">Masaki & Slipway (Ramani)</span>
              </button>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pizza, burger, biryani, mishkaki..."
                className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs outline-none border transition-all ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                activeTab === 'home'
                  ? 'text-emerald-500 font-bold bg-emerald-500/10'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
              }`}
            >
              Menu
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
                activeTab === 'favorites'
                  ? 'text-emerald-500 font-bold bg-emerald-500/10'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
              {user.favoriteItemIds.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {user.favoriteItemIds.length}
                </span>
              )}
            </button>

            {/* Authenticated Navigation Items: Only visible when logged in */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'orders'
                      ? 'text-emerald-500 font-bold bg-emerald-500/10'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Track Orders</span>
                  {activeOrdersCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('waiter')}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5 text-xs font-bold ${
                    activeTab === 'waiter'
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25'
                  }`}
                  title="Waiter & Floor POS"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Waiter POS</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5 text-xs font-bold ${
                    activeTab === 'admin'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/25'
                  }`}
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'profile'
                      ? 'text-emerald-500 font-bold bg-emerald-500/10'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{user.name.split(' ')[0] || 'My Account'}</span>
                </button>

                <button
                  onClick={logout}
                  title="Toka kwenye akaunti"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  Toka
                </button>
              </>
            ) : (
              /* When not logged in: only show Log In / Regista */
              <button
                onClick={() => setActiveTab('auth')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'auth'
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30'
                    : 'bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-neutral-950'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In / Regista</span>
              </button>
            )}
          </div>

          {/* Quick Actions (Table, Currency, Theme, Cart, Menu) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Table / QR Dine-In Indicator */}
            {activeTable ? (
              <button
                onClick={() => setShowCustomerTableModal(true)}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold flex items-center space-x-1 hover:bg-emerald-500/30 transition-all cursor-pointer"
                title="Upo mezani. Bofya kuona maelezo au kupiga kengele ya mhudumu"
              >
                <UtensilsCrossed className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate max-w-[70px] sm:max-w-none">{activeTable.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowCustomerTableModal(true)}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-all cursor-pointer"
                title="Umeketi mezani? Bofya kuingiza namba ya meza au kuchanganua QR"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mezani</span>
              </button>
            )}

            {/* Global & Dar es Salaam Map button */}
            <button
              onClick={() => setShowGlobalMapModal(true)}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Fungua Ramani ya Dunia na Dar es Salaam"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ramani</span>
            </button>

            {/* Table Reservation Button */}
            <button
              onClick={() => setShowReservationModal(true)}
              className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Weka nafasi ya meza mapema"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Weka Meza</span>
            </button>

            {/* Loyalty points pill if logged in */}
            {isLoggedIn && (
              <div
                onClick={() => setActiveTab('profile')}
                className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold cursor-pointer hover:bg-emerald-500/20 transition-all"
                title="Zebra VIP Points & Rewards"
              >
                <span>💎</span>
                <span>{loyaltyPoints} pts</span>
              </div>
            )}

            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'TZS' : 'USD')}
              className={`text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border transition-colors ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
              }`}
              title="Switch currency"
            >
              {currency === 'USD' ? '$ USD' : 'TZS'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-colors ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-amber-400 hover:bg-neutral-700'
                  : 'bg-neutral-100 border-neutral-300 text-amber-600 hover:bg-neutral-200'
              }`}
              title="Toggle Dark / Light Mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Cart Button - ALWAYS VISIBLE */}
            <button
              onClick={() => setActiveTab('cart')}
              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-2xl shadow-md shadow-emerald-500/30 transition-transform active:scale-95 shrink-0"
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
              <span className="text-xs font-bold hidden sm:inline">
                {cartCount === 0 ? 'Cart' : formatPrice(cartTotal, currency)}
              </span>
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
    </header>
  );
};
