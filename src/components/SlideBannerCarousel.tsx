import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Settings2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideBanner } from '../types';

interface SlideBannerCarouselProps {
  onOpenMapModal?: () => void;
  onOpenUssdModal?: () => void;
}

export const SlideBannerCarousel: React.FC<SlideBannerCarouselProps> = ({
  onOpenMapModal,
  onOpenUssdModal
}) => {
  const {
    banners,
    applyPromoCode,
    setActiveTab,
    setSelectedCategory,
    user,
    isLoggedIn
  } = useApp();

  // Only consider active banners, sorted by orderIndex
  const activeBanners = banners
    .filter(b => b.active !== false)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Keep index in bounds if banners change
  useEffect(() => {
    if (currentIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  // Autoplay timer
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection('right');
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleClaim = (banner: SlideBanner) => {
    if (
      banner.id === 'banner-map' ||
      banner.targetCategory === 'map' ||
      banner.title?.toLowerCase().includes('ramani') ||
      banner.description?.toLowerCase().includes('ramani')
    ) {
      if (onOpenMapModal) {
        onOpenMapModal();
        return;
      }
    }
    if (banner.promoCode) {
      applyPromoCode(banner.promoCode);
    }
    if (banner.targetCategory && banner.targetCategory !== 'all') {
      setSelectedCategory(banner.targetCategory);
    } else {
      setActiveTab('cart');
    }
  };

  const isAdmin = user.role === 'admin' || user.systemRole === 'Super Admin' || user.permissions?.canManageSettings;

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group select-none transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'right' ? -50 : 50 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className={`relative w-full overflow-hidden p-3.5 sm:p-5 md:p-6 text-white bg-gradient-to-r ${currentBanner.bgGradient || 'from-emerald-950 via-neutral-900 to-amber-950'} border border-white/10 min-h-[145px] sm:min-h-[195px]`}
        >
          {/* Subtle Background Food Image Overlay if present */}
          {currentBanner.imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 pointer-events-none transition-all duration-700 scale-105"
              style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
            />
          )}

          {/* Radial glow around banner */}
          <div
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: currentBanner.accentColor || '#10b981' }}
          />

          {/* Admin Quick Jump to Banner Management */}
          {isAdmin && (
            <button
              onClick={e => {
                e.stopPropagation();
                setActiveTab('admin');
              }}
              className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-[9px] sm:text-xs text-amber-300 font-bold transition-all shadow-md active:scale-95"
              title="Badili Mabango / Admin Banners Manager"
            >
              <Settings2 className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Badili Mabango</span>
              <span className="sm:hidden">Bango</span>
            </button>
          )}

          {/* Banner Main Content */}
          <div className="relative z-10 max-w-xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-1.5 bg-black/40 border border-white/20 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold text-emerald-300 mb-1 sm:mb-1.5 backdrop-blur-md">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              <span>{currentBanner.tag}</span>
            </div>

            {/* Title & Highlight */}
            <h2 className="text-xl sm:text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              <span>{currentBanner.title} </span>
              {currentBanner.titleHighlight && (
                <span className="text-amber-400 drop-shadow-sm">
                  {currentBanner.titleHighlight}
                </span>
              )}
            </h2>

            {/* Description - 1 clean line on mobile, full on desktop */}
            <p className="text-[11px] sm:text-sm text-neutral-300 mt-1 sm:mt-1.5 font-medium leading-relaxed line-clamp-1 sm:line-clamp-none max-w-lg">
              {currentBanner.description}
            </p>

            {/* Banner Quick Actions: Single sleek, high-conversion modern CTA button */}
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3.5">
              {/* Claim / CTA button */}
              <button
                onClick={() => handleClaim(currentBanner)}
                className="w-auto inline-flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-6 rounded-full shadow-lg shadow-emerald-500/40 transition-all cursor-pointer"
              >
                <span>{currentBanner.ctaText || 'Claim Offer'}</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Culinary Decorative Emoji on Right (as in screenshot) */}
          <div className="absolute right-2 top-2 bottom-2 w-1/3 opacity-25 sm:opacity-45 pointer-events-none hidden sm:flex items-center justify-end pr-6">
            <span className="text-7xl sm:text-8xl filter drop-shadow-2xl select-none transform hover:rotate-6 transition-transform">
              {currentBanner.decorativeEmoji || '🍕'}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left / Right Carousel Navigation Buttons - Hidden on touch mobile to prevent covering text, shown on desktop */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Carousel Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-black/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md border border-white/10">
          {activeBanners.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 'right' : 'left');
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
