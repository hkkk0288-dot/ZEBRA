import React from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { Heart, Plus, ArrowLeft, Flame, Clock } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const {
    user,
    menuItems,
    toggleFavorite,
    setSelectedDish,
    addToCart,
    currency,
    theme,
    setActiveTab
  } = useApp();

  const isDark = theme === 'dark';
  const favoriteItems = menuItems.filter(item => user.favoriteItemIds.includes(item.id));

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Header */}
      <div
        className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 transition-colors ${
          isDark ? 'bg-[#0f0f11]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
        }`}
      >
        <button
          onClick={() => setActiveTab('home')}
          className={`p-2 rounded-full ${
            isDark ? 'hover:bg-neutral-800 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-800'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold font-display text-neutral-900 dark:text-white">
          Favorites ({favoriteItems.length})
        </h1>

        <div className="w-8"></div>
      </div>

      <div className="px-5 space-y-4">
        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 text-3xl">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-white mb-2">
              No Favorites Yet
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs mb-6">
              Tap the heart icon on any pizza, burger, or Swahili dish to keep it in your favorites!
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/30 text-xs"
            >
              Explore Delicious Food
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {favoriteItems.map(dish => (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className={`group relative rounded-3xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700'
                    : 'bg-white border-neutral-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Remove from favorites button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(dish.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full z-10 bg-rose-500 text-white shadow-md"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </button>

                <div>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 mb-2.5">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h3 className="font-bold text-xs leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {dish.name}
                  </h3>

                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatPrice(dish.price, currency)}
                  </p>

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

                <div className="flex justify-end mt-2 pt-1">
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
                    className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30 transition-all"
                    title="Add to Cart"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
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
