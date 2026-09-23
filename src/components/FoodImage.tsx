import React, { useState, useEffect } from 'react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

// Guaranteed high-availability culinary food photography per category
const CATEGORY_FALLBACKS: Record<string, string> = {
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  fast_food: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  meat: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  swahili: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  drinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  chicken: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
};

const DEFAULT_FOOD_IMG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  category = 'all'
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || DEFAULT_FOOD_IMG);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state whenever src prop changes
  useEffect(() => {
    setImgSrc(src || DEFAULT_FOOD_IMG);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    setIsLoading(false);
    if (!hasError) {
      setHasError(true);
      const fallback = CATEGORY_FALLBACKS[category.toLowerCase()] || DEFAULT_FOOD_IMG;
      if (fallback !== imgSrc) {
        setImgSrc(fallback);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-900/40 flex items-center justify-center">
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-30 blur-xs' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};
