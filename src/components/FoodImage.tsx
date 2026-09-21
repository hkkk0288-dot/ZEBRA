import React, { useState } from 'react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

// Fallback high-quality food visuals in case of network issues with external CDN
const CATEGORY_FALLBACKS: Record<string, string> = {
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  fast_food: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  meat: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  swahili: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  drinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
};

const DEFAULT_FOOD_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%2318181b"/><circle cx="300" cy="300" r="220" fill="%2327272a" stroke="%2310b981" stroke-width="6"/><circle cx="300" cy="300" r="180" fill="%233f3f46"/><text x="300" y="320" font-size="110" text-anchor="middle" fill="%23ffffff">🍕</text><text x="300" y="440" font-family="sans-serif" font-weight="bold" font-size="28" text-anchor="middle" fill="%2310b981">ZEBRA DELICIOUS</text></svg>`;

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  category = 'all'
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = CATEGORY_FALLBACKS[category] || DEFAULT_FOOD_SVG;
      if (fallback !== imgSrc) {
        setImgSrc(fallback);
      } else {
        setImgSrc(DEFAULT_FOOD_SVG);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-800 flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
          <span className="text-2xl">🍽️</span>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};
