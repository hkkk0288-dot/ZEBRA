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
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import { MenuItem } from '../types';
import { motion } from 'motion/react';
import { FoodImage } from './FoodImage';
import { DarEsSalaamMap } from './DarEsSalaamMap';

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
    applyPromoCode,
    androidFrame,
    isLoggedIn
  } = useApp();

  const isDark = theme === 'dark';
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.swahiliName && item.swahiliName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="flex flex-col min-h-screen pb-24">
      {/* Mobile Top App Bar (Only shown in Mobile Phone Frame view) */}
      {androidFrame && (
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
                  <button
                    onClick={() => setActiveTab('auth')}
                    className="ml-1 text-[10px] text-amber-400 hover:text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20"
                    title="Fungua ukurasa wa Login au Regista"
                  >
                    {isLoggedIn ? 'Akaunti' : 'Login / Regista'}
                  </button>
                </div>
                <h1 className="text-base font-bold font-display text-neutral-900 dark:text-white leading-tight">
                  {user.name}
                </h1>
                <button
                  onClick={() => setShowMapModal(true)}
                  className="flex items-center space-x-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-emerald-400 cursor-pointer transition-colors"
                  title="Fungua Ramani ya Dar es Salaam"
                >
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span className="truncate max-w-[140px] font-medium border-b border-dotted border-neutral-500">Dar es Salaam (Ramani)</span>
                </button>
              </div>
            </div>

            {/* Quick controls for mobile frame */}
            <div className="flex items-center space-x-2">
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
      )}

      {/* Main Content Container - Full Width on Web, Compact on Mobile */}
      <div className={`w-full max-w-full overflow-hidden ${androidFrame ? 'px-4 space-y-5 mt-1' : 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 mt-3 sm:mt-4'}`}>
        
        {/* Full Website Hero & Promo Banner */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-neutral-900 to-amber-950 border border-emerald-500/30 p-4 sm:p-7 shadow-xl text-white">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-emerald-400 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Festive Offer • Zebra Restaurant</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              30% OFF <span className="text-amber-400">Everything</span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 sm:mt-2 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
              Authentic wood-fired pizzas, gourmet smash burgers, and fresh Swahili mishkaki & biryani delivered hot across Dar es Salaam.
            </p>

            {/* Banner Quick Actions - Fits cleanly on mobile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={() => {
                  applyPromoCode('ZEBRA30');
                  setActiveTab('cart');
                }}
                className="col-span-2 sm:col-span-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl sm:rounded-full shadow-lg shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2"
              >
                <span>Claim 30% Off</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="px-3 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-[11px] sm:text-xs font-mono font-bold text-amber-300 flex items-center justify-center">
                Code: <span className="text-white ml-1 font-black">ZEBRA30</span>
              </div>

              <button
                onClick={() => setShowNotificationModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] sm:text-xs py-2 px-3 rounded-xl backdrop-blur-sm transition-all flex items-center justify-center space-x-1"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>*150*00#</span>
              </button>

              <button
                onClick={() => setShowMapModal(true)}
                className="col-span-2 sm:col-span-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] sm:text-xs py-2 px-3.5 rounded-xl backdrop-blur-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ramani ya Dar es Salaam</span>
              </button>
            </div>
          </div>

          {/* Decorative culinary background graphics */}
          <div className="absolute right-2 top-2 bottom-2 w-1/3 opacity-20 sm:opacity-40 pointer-events-none hidden sm:flex items-center justify-end pr-6">
            <span className="text-8xl filter drop-shadow-2xl select-none">🍕</span>
          </div>
        </div>

        {/* Categories Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white tracking-tight">
                Explore Categories
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Choose your favorite craving
              </p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-emerald-500 hover:underline"
              >
                View All Categories
              </button>
            )}
          </div>

          {/* Categories Pill Selector */}
          <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 shrink-0 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30 font-bold scale-105'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700 text-neutral-300'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700 shadow-sm'
                  }`}
                >
                  <span className="text-xl select-none">{cat.icon}</span>
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white tracking-tight">
                  Best Sellers & Chef Specials
                </h2>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Most ordered dishes in Masaki, Oysterbay & Dar es Salaam
              </p>
            </div>

            <div className="text-xs text-neutral-400">
              Showing <strong className="text-emerald-500 font-bold">{bestSellers.length}</strong> items
            </div>
          </div>

          {/* Responsive Food Grid - 2 columns on mobile, up to 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {bestSellers.map(dish => (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className={`group relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5'
                    : 'bg-white border-neutral-200 shadow-sm hover:shadow-lg hover:border-emerald-400'
                }`}
              >
                {/* Favorite heart overlay */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(dish.id);
                  }}
                  className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full z-10 transition-colors ${
                    isFavorite(dish.id)
                      ? 'bg-rose-500 text-white shadow-md'
                      : isDark
                      ? 'bg-black/60 text-white hover:bg-black/80'
                      : 'bg-white/90 text-neutral-700 hover:bg-white shadow'
                  }`}
                  title="Save to Favorites"
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite(dish.id) ? 'fill-white' : ''}`}
                  />
                </button>

                {/* Best Seller Ribbon */}
                {dish.isBestSeller && (
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                    <span className="bg-amber-500 text-neutral-900 text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full shadow">
                      Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Dish Image */}
                  <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 mb-2 sm:mb-3">
                    <FoodImage
                      src={dish.image}
                      alt={dish.name}
                      category={dish.category}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title and Swahili Translation */}
                  <h3 className="font-bold text-xs sm:text-sm leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                    {dish.name}
                  </h3>

                  {dish.swahiliName && (
                    <p className="text-[10px] sm:text-xs text-amber-500 font-medium truncate mt-0.5">
                      {dish.swahiliName}
                    </p>
                  )}

                  {/* Pricing */}
                  <div className="flex items-baseline space-x-1.5 mt-1 sm:mt-1.5">
                    <span className="text-xs sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(dish.price, currency)}
                    </span>
                    {currency === 'USD' && (
                      <span className="text-[9px] sm:text-[11px] text-neutral-400 font-mono hidden xs:inline">
                        ≈ {formatPrice(dish.price, 'TZS')}
                      </span>
                    )}
                  </div>

                  {/* Badges: Rating & Time */}
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-neutral-800/40 dark:border-neutral-800/80 text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center space-x-1 font-bold text-amber-500">
                      <span>★ {dish.rating}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{dish.prepTimeMinutes}m</span>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{dish.calories} cal</span>
                    </div>
                  </div>
                </div>

                {/* Quick Add Button */}
                <div className="mt-2 pt-1">
                  <button
                    onClick={e => handleQuickAdd(e, dish)}
                    className="w-full py-1.5 sm:py-2.5 px-2 rounded-lg sm:rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center space-x-1 shadow-sm shadow-emerald-500/30 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Menu & Swahili Specialties Section */}
        {otherItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-neutral-900 dark:text-white tracking-tight">
                  Zebra Signature & Swahili Dishes
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Local Tanzanian delicacies and freshly prepared dishes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {otherItems.map(dish => (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                      : 'bg-white border-neutral-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2.5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-700/40">
                      <FoodImage
                        src={dish.image}
                        alt={dish.name}
                        category={dish.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                        {dish.name}
                      </h3>
                      {dish.swahiliName && (
                        <p className="text-[10px] sm:text-xs text-amber-500 font-medium truncate">
                          {dish.swahiliName}
                        </p>
                      )}
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {dish.restaurantName}
                      </p>
                      <div className="flex items-center space-x-1.5 sm:space-x-2 mt-1 text-xs">
                        <span className="font-black text-emerald-500 text-xs sm:text-sm">
                          {formatPrice(dish.price, currency)}
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-400 text-[10px] sm:text-[11px]">⏱ {dish.prepTimeMinutes}m</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-amber-400 font-bold text-[10px] sm:text-[11px]">★ {dish.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={e => handleQuickAdd(e, dish)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 transition-all shrink-0"
                    title="Add to Cart"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty Search / Category state */}
        {filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center text-3xl mb-4">
              🍽️
            </div>
            <h3 className="text-lg font-bold text-neutral-200">No dishes found</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              We couldn't find any dishes matching "{searchQuery}". Try searching for pizza, mishkaki, biryani, or burger.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-emerald-500 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
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
                  Unaweza kulipa kupitia M-Pesa (*150*00#), Tigo Pesa, Airtel na Halopesa papo hapo kwa Lipa Namba 445566.
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

      {/* Dar es Salaam Interactive Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6">
          <div
            className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
              isDark ? 'bg-[#121214] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-display">
                    Ramani ya Dar es Salaam (Zebra Delivery & Branches)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Matawi ya Zebra Masaki, Oysterbay, Kariakoo, Slipway na ufuatiliaji wa bodaboda
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Map */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <DarEsSalaamMap
                customerLocationName="Upanga / Kariakoo / Masaki"
                orderNumber="DAR-MAP"
                etaMinutes={15}
                riderProgress={60}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="font-bold text-amber-400 block">🍕 Masaki Kitchen</span>
                  <span className="text-[11px] text-neutral-400">Toure Dr, Masaki</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="font-bold text-amber-400 block">🥩 Kariakoo Hub</span>
                  <span className="text-[11px] text-neutral-400">China Plaza & Market</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="font-bold text-emerald-400 block">🍔 Oysterbay Bistro</span>
                  <span className="text-[11px] text-neutral-400">Haile Selassie Rd</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="font-bold text-purple-400 block">🐟 Slipway Ocean</span>
                  <span className="text-[11px] text-neutral-400">Msasani Waterfront</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
