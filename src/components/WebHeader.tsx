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
  Menu,
  X,
  LogIn
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const WebHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cart,
    orders,
    user,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery
  } = useApp();

  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <p className="text-[9px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center space-x-1">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 shrink-0" />
                <span className="whitespace-nowrap">Masaki & Slipway</span>
              </p>
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
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
                activeTab === 'profile'
                  ? 'text-emerald-500 font-bold bg-emerald-500/10'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-500'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account</span>
            </button>

            {/* Login / Regista */}
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'auth'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 shadow-md shadow-amber-500/30'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In / Regista</span>
            </button>
          </div>

          {/* Quick Actions (Currency, Theme, Cart, Menu) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
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

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
              title="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
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

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-800/60 text-left text-neutral-200"
            >
              🍽️ Browse Menu
            </button>
            <button
              onClick={() => {
                setActiveTab('favorites');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-800/60 text-left text-neutral-200"
            >
              ❤️ Favorites ({user.favoriteItemIds.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-800/60 text-left text-neutral-200"
            >
              📦 Track Orders
            </button>
            <button
              onClick={() => {
                setActiveTab('profile');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-800/60 text-left text-neutral-200"
            >
              👤 My Account
            </button>
            <button
              onClick={() => {
                setActiveTab('auth');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-amber-400 font-bold flex items-center space-x-1.5 col-span-2 justify-center"
            >
              <span>🔑 Log In / Regista</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
