import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  MapPin,
  Check,
  Copy,
  Settings2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideBanner } from '../types';

interface SlideBannerCarouselProps {
  onOpenMapModal: () => void;
  onOpenUssdModal: () => void;
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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
    if (banner.promoCode) {
      applyPromoCode(banner.promoCode);
    }
    if (banner.targetCategory && banner.targetCategory !== 'all') {
      setSelectedCategory(banner.targetCategory);
    } else {
      setActiveTab('cart');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyPromoCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
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
          className={`relative w-full overflow-hidden p-4 sm:p-7 md:p-8 text-white bg-gradient-to-r ${currentBanner.bgGradient || 'from-emerald-950 via-neutral-900 to-amber-950'} border border-white/10`}
          style={{ minHeight: '230px' }}
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
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs text-amber-300 font-bold transition-all shadow-md active:scale-95"
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
            <div className="inline-flex items-center space-x-1.5 bg-black/40 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-emerald-300 mb-1.5 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{currentBanner.tag}</span>
            </div>

            {/* Title & Highlight */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              <span>{currentBanner.title} </span>
              {currentBanner.titleHighlight && (
                <span className="text-amber-400 drop-shadow-sm">
                  {currentBanner.titleHighlight}
                </span>
              )}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 sm:mt-2 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none max-w-lg">
              {currentBanner.description}
            </p>

            {/* Banner Quick Actions (Matches Screenshot Layout) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              {/* Claim / CTA button */}
              <button
                onClick={() => handleClaim(currentBanner)}
                className="col-span-2 sm:col-span-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl sm:rounded-full shadow-lg shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{currentBanner.ctaText || 'Claim Offer'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Promo Code Badge with Copy button */}
              {currentBanner.promoCode && (
                <button
                  type="button"
                  onClick={() => handleCopyCode(currentBanner.promoCode!)}
                  className="px-3 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-emerald-500/30 text-[11px] sm:text-xs font-mono font-bold text-amber-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  title="Click to copy coupon code"
                >
                  <span>Code:</span>
                  <span className="text-white font-black">{currentBanner.promoCode}</span>
                  {copiedCode === currentBanner.promoCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-neutral-400 ml-1" />
                  )}
                </button>
              )}

              {/* USSD Dial Modal Trigger */}
              <button
                type="button"
                onClick={onOpenUssdModal}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] sm:text-xs py-2 px-3 rounded-xl backdrop-blur-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentBanner.ussdNumber || '*150*00#'}</span>
              </button>

              {/* Dar es Salaam Map Trigger */}
              <button
                type="button"
                onClick={onOpenMapModal}
                className="col-span-2 sm:col-span-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] sm:text-xs py-2 px-3.5 rounded-xl backdrop-blur-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ramani ya Dar es Salaam</span>
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

      {/* Left / Right Carousel Navigation Buttons */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Carousel Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
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
