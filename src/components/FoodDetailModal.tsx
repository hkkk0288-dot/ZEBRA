import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Star, Trash2, Plus, Minus, Check, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IngredientOption, SizeOption } from '../types';
import { formatPrice } from '../utils/formatters';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

import { FoodImage } from './FoodImage';

export const FoodDetailModal: React.FC = () => {
  const { selectedDish, setSelectedDish, addToCart, toggleFavorite, isFavorite, currency, theme, isLoggedIn } = useApp();

  if (!selectedDish) return null;

  const isDark = theme === 'dark';

  // Size state (default to first or medium if exists)
  const defaultSize: SizeOption = selectedDish.sizes[1] || selectedDish.sizes[0] || {
    id: 'reg',
    name: 'Standard',
    price: selectedDish.price,
    label: 'Standard'
  };

  const [selectedSize, setSelectedSize] = useState<SizeOption>(defaultSize);

  // Multi-image gallery state
  const dishImages = selectedDish.images && selectedDish.images.length > 0
    ? selectedDish.images
    : [selectedDish.image];
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  // Ingredients state
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientOption[]>(
    selectedDish.ingredients.filter(ing => ing.defaultChecked)
  );

  // Quantity state
  const [quantity, setQuantity] = useState<number>(1);
  const [specialNote, setSpecialNote] = useState<string>('');
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const toggleIngredient = (ingredient: IngredientOption) => {
    setSelectedIngredients(prev => {
      const exists = prev.some(item => item.id === ingredient.id);
      if (exists) {
        return prev.filter(item => item.id !== ingredient.id);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  // Unit and total calculations
  const ingredientsTotal = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
  const unitPrice = selectedSize.price + ingredientsTotal;
  const currentTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setSelectedDish(null);
      addToCart(selectedDish, selectedSize, selectedIngredients, quantity, specialNote);
      return;
    }

    addToCart(selectedDish, selectedSize, selectedIngredients, quantity, specialNote);
    
    // Quick celebratory micro-confetti
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#10b981', '#f59e0b', '#3b82f6']
      });
    } catch {
      // ignore in iframe
    }

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      setSelectedDish(null);
    }, 700);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedDish.name} - Zebra Restaurant`,
        text: `Check out ${selectedDish.name} on Zebra Restaurant!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md overflow-hidden p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`relative w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] sm:rounded-[36px] flex flex-col overflow-hidden shadow-2xl transition-colors duration-200 ${
            isDark ? 'bg-[#121215] text-neutral-100' : 'bg-white text-neutral-900'
          }`}
        >
          {/* Top Bar matching screenshot 1 */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2 z-20">
            <button
              onClick={() => setSelectedDish(null)}
              className={`p-2.5 rounded-full transition-colors ${
                isDark ? 'bg-neutral-800/80 hover:bg-neutral-700 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(selectedDish.id)}
                className={`p-2.5 rounded-full transition-all ${
                  isFavorite(selectedDish.id)
                    ? 'bg-rose-500/20 text-rose-500'
                    : isDark
                    ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite(selectedDish.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                />
              </button>

              <button
                onClick={handleShare}
                className={`p-2.5 rounded-full transition-colors ${
                  isDark ? 'bg-neutral-800/80 hover:bg-neutral-700 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Dish Details Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-28">
            {/* Dish Food Photo Presentation & Multi-Image Gallery */}
            <div className="relative flex flex-col items-center justify-center my-3">
              <div className="relative w-56 h-56 rounded-full overflow-hidden shadow-2xl border-4 border-amber-500/20 bg-neutral-900 group">
                <FoodImage
                  src={dishImages[activeImgIndex] || selectedDish.image}
                  alt={selectedDish.name}
                  category={selectedDish.category}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />

                {/* Left/Right Next & Prev arrows if multiple images exist */}
                {dishImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIndex(prev => (prev === 0 ? dishImages.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImgIndex(prev => (prev === dishImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Multi-image thumbnail selector */}
              {dishImages.length > 1 && (
                <div className="flex items-center space-x-2 mt-3 z-10">
                  {dishImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImgIndex === idx
                          ? 'border-orange-500 ring-2 ring-orange-500/40 scale-110'
                          : 'border-neutral-700/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Decorative culinary glow */}
              <div className="absolute -z-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Dish Title & Rating */}
            <div className="text-center mt-2 mb-4">
              <h1 className="text-2xl font-bold font-display tracking-tight leading-snug">
                {selectedDish.name}
              </h1>
              {selectedDish.swahiliName && (
                <p className="text-xs text-amber-500 font-medium mt-0.5">
                  {selectedDish.swahiliName}
                </p>
              )}

              {/* Restaurant tag & rating line */}
              <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center space-x-1 font-medium text-neutral-700 dark:text-neutral-200">
                  <span>🍕</span>
                  <span>{selectedDish.restaurantName}</span>
                </span>
                <span>•</span>
                <div className="flex items-center space-x-1 font-semibold text-emerald-500">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span>{selectedDish.rating}</span>
                  <span className="text-xs font-normal text-neutral-400">
                    ({selectedDish.reviewsCount}) &gt;
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 text-center mb-6 px-2">
              {selectedDish.description}
            </p>

            {/* Size Selector Cards (exact layout from screenshot 1) */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-3">
                {selectedDish.sizes.map(size => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 text-center ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-sm shadow-emerald-500/20'
                          : isDark
                          ? 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                      }`}
                    >
                      {/* Radio indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${
                          isSelected ? 'border-emerald-500' : 'border-neutral-400 dark:border-neutral-600'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                      </div>

                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        {size.name}
                      </span>
                      <span className="text-sm font-bold mt-1 text-neutral-900 dark:text-neutral-100">
                        {formatPrice(size.price, currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Ingredients Section (exact layout from screenshot 1) */}
            {selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold font-display mb-3 text-neutral-900 dark:text-white">
                  Add Ingredients
                </h3>

                <div className="space-y-2.5">
                  {selectedDish.ingredients.map(ing => {
                    const isChecked = selectedIngredients.some(i => i.id === ing.id);
                    return (
                      <div
                        key={ing.id}
                        onClick={() => toggleIngredient(ing)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isChecked
                            ? isDark
                              ? 'bg-neutral-800/90 border-emerald-500/40'
                              : 'bg-emerald-50/60 border-emerald-300'
                            : isDark
                            ? 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                            : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-lg">
                            {ing.name.toLowerCase().includes('chicken') ? '🍗' :
                             ing.name.toLowerCase().includes('mushroom') ? '🍄' :
                             ing.name.toLowerCase().includes('cheese') ? '🧀' :
                             ing.name.toLowerCase().includes('olive') ? '🫒' :
                             ing.name.toLowerCase().includes('corn') ? '🌽' :
                             ing.name.toLowerCase().includes('egg') ? '🥚' : '🥗'}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                              {ing.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {ing.weight} •{' '}
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                +{formatPrice(ing.price, currency)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Checkbox button */}
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-neutral-400 dark:border-neutral-600 bg-transparent'
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                Special Request / Swahili Notes
              </label>
              <textarea
                value={specialNote}
                onChange={e => setSpecialNote(e.target.value)}
                placeholder="E.g., No onions, extra chili, or well-done grill..."
                className={`w-full p-3 rounded-2xl text-xs outline-none border transition-colors resize-none h-16 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Bottom Floating Bar (Exact Layout from screenshot 1) */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 border-t z-30 transition-colors ${
              isDark
                ? 'bg-[#121215]/95 backdrop-blur-lg border-neutral-800'
                : 'bg-white/95 backdrop-blur-lg border-neutral-200 shadow-lg'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Stepper with trash icon when 1, or minus */}
              <div
                className={`flex items-center rounded-full border px-2 py-1.5 transition-colors ${
                  isDark
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-200'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                }`}
              >
                <button
                  onClick={() => {
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                  className="p-1.5 hover:text-emerald-500 transition-colors"
                >
                  {quantity === 1 ? (
                    <Trash2 className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                </button>

                <span className="w-7 text-center font-bold text-sm select-none">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button (gated with auth if not logged in) */}
              <button
                onClick={handleAddToCart}
                disabled={addedToast}
                className={`flex-1 active:scale-[0.98] font-bold py-3.5 px-5 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all ${
                  !isLoggedIn
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                }`}
              >
                {addedToast ? (
                  <span className="flex items-center space-x-1.5">
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </span>
                ) : !isLoggedIn ? (
                  <span>
                    🔑 Ingia ili Uongeze · {formatPrice(currentTotal, currency)}
                  </span>
                ) : (
                  <span>
                    Add to Cart · {formatPrice(currentTotal, currency)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
