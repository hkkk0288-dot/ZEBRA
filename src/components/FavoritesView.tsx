import React from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { Heart, Plus, ArrowLeft, Flame, Clock } from 'lucide-react';
import { FoodImage } from './FoodImage';

export const FavoritesView: React.FC = () => {
  const {
    user,
    menuItems,
    toggleFavorite,
    setSelectedDish,
    addToCart,
    currency,
    theme,
    setActiveTab,
    goBack,
    androidFrame
  } = useApp();

  const isDark = theme === 'dark';
  const favoriteItems = menuItems.filter(item => user.favoriteItemIds.includes(item.id));

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Mobile Top Header (only in phone frame mode) */}
      {androidFrame && (
        <div
          className={`sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 transition-colors border-b ${
            isDark ? 'bg-[#0f0f11]/95 border-neutral-800 backdrop-blur-md' : 'bg-white/95 border-neutral-200 backdrop-blur-md'
          }`}
        >
          <button
            onClick={goBack}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer ${
              isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200'
            }`}
            title="Rudi Nyuma"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-500" />
            <span>Rudi</span>
          </button>

          <h1 className="text-base font-bold font-display text-neutral-900 dark:text-white">
            Vyakula Vipendwa ({favoriteItems.length})
          </h1>

          <div className="w-8"></div>
        </div>
      )}

      {/* Main Container */}
      <div className={`w-full ${androidFrame ? 'px-5 space-y-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'}`}>
        
        {/* Full Web Header */}
        {!androidFrame && (
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <div className="flex items-center space-x-3.5">
              <button
                onClick={goBack}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-1.5 border transition-all active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800 shadow-sm'
                    : 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-200 shadow-xs'
                }`}
                title="Rudi Nyuma kwenye Menu"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-500" />
                <span>Rudi Menu</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white tracking-tight flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  <span>Your Favorite Dishes</span>
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Saved dishes you love for quick re-ordering from Zebra Restaurant
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('home')}
              className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center space-x-1"
            >
              <span>Explore More Food</span>
              <span>→</span>
            </button>
          </div>
        )}

        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 text-3xl">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              No Favorites Yet
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs mb-6">
              Tap the heart icon on any pizza, burger, or Swahili dish to save it here for fast ordering!
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/30 text-xs"
            >
              Explore Delicious Food
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-4 md:gap-6 ${
              androidFrame
                ? 'grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {favoriteItems.map(dish => (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className={`group relative rounded-3xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-800 hover:border-emerald-500/50'
                    : 'bg-white border-neutral-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Remove from favorites button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(dish.id);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full z-10 bg-rose-500 text-white shadow-md hover:scale-105 transition-transform"
                  title="Remove from favorites"
                >
                  <Heart className="w-4 h-4 fill-white" />
                </button>

                <div>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-950 mb-3">
                    <FoodImage
                      src={dish.image}
                      alt={dish.name}
                      category={dish.category}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="font-bold text-sm leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {dish.name}
                  </h3>

                  {dish.swahiliName && (
                    <p className="text-xs text-amber-500 font-medium truncate mt-0.5">
                      {dish.swahiliName}
                    </p>
                  )}

                  <p className="text-sm font-extrabold text-emerald-500 mt-1">
                    {formatPrice(dish.price, currency)}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{dish.calories} cal</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{dish.prepTimeMinutes}m</span>
                    </div>
                    <div className="flex items-center space-x-1 font-bold text-amber-400">
                      <span>★ {dish.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(
                        dish,
                        dish.sizes[1] || dish.sizes[0],
                        dish.ingredients.filter(ing => ing.defaultChecked),
                        1
                      );
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
