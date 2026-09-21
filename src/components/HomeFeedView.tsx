import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { formatPrice } from '../utils/formatters';
import {
  Search,
  Bell,
  Flame,
  Clock,
  Plus,
  Moon,
  Sun,
  MapPin,
  ChevronRight,
  Sparkles,
  Heart,
  X
} from 'lucide-react';
import { MenuItem } from '../types';
import { motion } from 'motion/react';

export const HomeFeedView: React.FC = () => {
  const {
    user,
    menuItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedDish,
    addToCart,
    toggleFavorite,
    isFavorite,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    setActiveTab,
    applyPromoCode
  } = useApp();

  const isDark = theme === 'dark';
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.swahiliName && item.swahiliName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bestSellers = filteredItems.filter(i => i.isBestSeller);
  const otherItems = filteredItems.filter(i => !i.isBestSeller);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(
      item,
      item.sizes[1] || item.sizes[0],
      item.ingredients.filter(ing => ing.defaultChecked),
      1
    );
  };

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Top App Bar matching Screenshot 2 */}
      <div
        className={`sticky top-0 z-20 px-5 pt-3 pb-3 transition-colors ${
          isDark ? 'bg-[#0f0f11]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 cursor-pointer shrink-0"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-neutral-400">Hello</span>
                <span className="text-sm">👋</span>
              </div>
              <h1 className="text-base font-bold font-display text-neutral-900 dark:text-white leading-tight">
                {user.name}
              </h1>
              <div className="flex items-center space-x-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span className="truncate max-w-[140px]">Dar es Salaam, Masaki</span>
              </div>
            </div>
          </div>

          {/* Quick controls: Currency, Theme toggle, Search toggle, Bell */}
          <div className="flex items-center space-x-2">
            {/* Currency toggle */}
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'TZS' : 'USD')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                currency === 'TZS'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                  : 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
              }`}
            >
              {currency}
            </button>

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-colors ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900 text-amber-400 hover:bg-neutral-800'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Search Toggle */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`p-2 rounded-full border transition-colors ${
                showSearchInput
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : isDark
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotificationModal(true)}
              className={`relative p-2 rounded-full border transition-colors ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearchInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3"
          >
            <div
              className={`flex items-center px-3.5 py-2.5 rounded-2xl border transition-colors ${
                isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
              }`}
            >
              <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search pizza, burger, mishkaki, drinks..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-medium outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-5 space-y-6 mt-1">
        {/* Categories Horizontal Scroll Row (Matching Screenshot 2) */}
        <div>
          <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2 -mx-5 px-5">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center justify-center min-w-[70px] p-3 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm shadow-emerald-500/20 scale-105'
                      : isDark
                      ? 'border-neutral-800/80 bg-neutral-900/70 hover:border-neutral-700'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 shadow-sm'
                  }`}
                >
                  <span className="text-2xl mb-1.5 filter drop-shadow select-none">
                    {cat.icon}
                  </span>
                  <span
                    className={`text-[11px] font-semibold tracking-tight whitespace-nowrap ${
                      isSelected
                        ? 'text-emerald-500 font-bold'
                        : isDark
                        ? 'text-neutral-300'
                        : 'text-neutral-700'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promo Offer Banner (Matching Screenshot 2 with delivery rider & 30% OFF) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-900 border border-emerald-500/30 p-5 shadow-xl text-white">
          <div className="relative z-10 max-w-[62%]">
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 tracking-wide">
              <Sparkles className="w-3 h-3" />
              <span>New Year Festival Offer</span>
            </span>

            <h2 className="text-2xl font-black font-display tracking-tight text-white mt-1">
              30% OFF
            </h2>

            <p className="text-[11px] text-neutral-300 mt-0.5 font-medium">
              16 - 31 Dec • Code: <strong className="text-amber-400">ZEBRA30</strong>
            </p>

            <button
              onClick={() => {
                applyPromoCode('ZEBRA30');
                setActiveTab('cart');
              }}
              className="mt-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs py-2 px-5 rounded-full shadow-md shadow-emerald-500/40 transition-all flex items-center space-x-1.5"
            >
              <span>Get Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Delivery Rider Mascot Graphic */}
          <div className="absolute right-0 bottom-0 top-0 w-36 overflow-hidden pointer-events-none flex items-end justify-center">
            <img
              src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=400&q=80"
              alt="Delivery Rider"
              className="h-32 object-cover rounded-tl-full opacity-90 filter brightness-110"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Best Sellers Section Header (Matching Screenshot 2) */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-white tracking-tight">
              Best Sellers
            </h2>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center space-x-1"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2-Column Food Grid (Exact Look from Screenshot 2) */}
          <div className="grid grid-cols-2 gap-3.5">
            {bestSellers.map(dish => (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className={`group relative rounded-3xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700'
                    : 'bg-white border-neutral-200/90 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Favorite heart overlay */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(dish.id);
                  }}
                  className={`absolute top-3 right-3 p-1.5 rounded-full z-10 transition-colors ${
                    isFavorite(dish.id)
                      ? 'bg-rose-500 text-white'
                      : isDark
                      ? 'bg-black/40 text-white hover:bg-black/60'
                      : 'bg-white/80 text-neutral-700 hover:bg-white'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isFavorite(dish.id) ? 'fill-white' : ''}`}
                  />
                </button>

                <div>
                  {/* Circular dish presentation */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 mb-2.5 flex items-center justify-center">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Title and price */}
                  <h3 className="font-bold text-xs leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {dish.name}
                  </h3>

                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatPrice(dish.price, currency)}
                  </p>

                  {/* Badges: Calories & Prep time (Matching Screenshot 2) */}
                  <div className="space-y-1 mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{dish.calories} Calories</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{dish.prepTimeMinutes} min</span>
                    </div>
                  </div>
                </div>

                {/* Green Plus Quick Add Button (Matching Screenshot 2) */}
                <div className="flex justify-end mt-2 pt-1">
                  <button
                    onClick={e => handleQuickAdd(e, dish)}
                    className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30 transition-all"
                    title="Add to Cart"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swahili Specialties & Zebra Kitchen Highlights */}
        {otherItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-white tracking-tight">
                Zebra Signature & Swahili Dishes
              </h2>
            </div>

            <div className="space-y-3">
              {otherItems.map(dish => (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className={`flex items-center justify-between p-3.5 rounded-3xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700'
                      : 'bg-white border-neutral-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-700/40">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {dish.name}
                      </h3>
                      {dish.swahiliName && (
                        <p className="text-[11px] text-amber-500 font-medium truncate">
                          {dish.swahiliName}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {dish.restaurantName}
                      </p>
                      <div className="flex items-center space-x-3 mt-1 text-[11px] text-neutral-400">
                        <span className="font-bold text-emerald-500 text-xs">
                          {formatPrice(dish.price, currency)}
                        </span>
                        <span>•</span>
                        <span>⏱ {dish.prepTimeMinutes} min</span>
                        <span>•</span>
                        <span>★ {dish.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={e => handleQuickAdd(e, dish)}
                    className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand Credit Badge (AmourCodes & Zebra Restaurant) */}
        <div className="pt-4 pb-2 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-neutral-800/40 border border-neutral-700/50 text-[11px] text-neutral-400">
            <span>🦓 Zebra Restaurant</span>
            <span>•</span>
            <span>Made with ❤️ by <strong className="text-amber-400">AmourCodes</strong></span>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-sm p-5 rounded-3xl border shadow-2xl ${
              isDark ? 'bg-[#18181b] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base font-display">Notifications</h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <p className="font-bold text-emerald-400">🎉 Karibu Zebra Restaurant!</p>
                <p className="text-neutral-400 mt-0.5">
                  Tumia kuponi <strong className="text-white">ZEBRA30</strong> kupata 30% discount kwenye agizo lako la kwanza.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/40 text-xs">
                <p className="font-bold text-amber-400">📶 USSD Payments Ready</p>
                <p className="text-neutral-400 mt-0.5">
                  Unaweza kulipa kupitia M-Pesa (*150*00#), Tigo Pesa, Airtel na Halopesa papo hapo.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
