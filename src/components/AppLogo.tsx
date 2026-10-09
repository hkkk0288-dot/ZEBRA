import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imgClassName?: string;
  fallbackEmoji?: string;
  showText?: boolean;
  textClassName?: string;
}

const SIZE_CONFIGS = {
  xs: { box: 'w-6 h-6 rounded-lg text-xs', img: 'w-6 h-6 rounded-lg' },
  sm: { box: 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-sm sm:text-base', img: 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl' },
  md: { box: 'w-10 h-10 sm:w-12 sm:h-12 rounded-2xl text-lg sm:text-xl', img: 'w-10 h-10 sm:w-12 sm:h-12 rounded-2xl' },
  lg: { box: 'w-16 h-16 sm:w-20 sm:h-20 rounded-3xl text-2xl sm:text-3xl', img: 'w-16 h-16 sm:w-20 sm:h-20 rounded-3xl' },
  xl: { box: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl text-4xl sm:text-5xl', img: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl' }
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  imgClassName = '',
  fallbackEmoji,
  showText = false,
  textClassName = ''
}) => {
  const { appBranding } = useApp();
  const [imgError, setImgError] = useState(false);

  // Reset error state when logoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [appBranding?.logoUrl]);

  const sizeCfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
  const logoUrl = appBranding?.logoUrl;
  const emoji = appBranding?.logoEmoji || fallbackEmoji || '🍗';
  const appName = appBranding?.appName || 'Kookoos';

  const hasValidImg = Boolean(logoUrl && !imgError);

  return (
    <div className={`inline-flex items-center space-x-2 shrink-0 ${className}`}>
      <div
        className={`${sizeCfg.box} bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center overflow-hidden shadow-md shadow-amber-500/20 border border-white/10 shrink-0 select-none relative`}
      >
        {hasValidImg ? (
          <img
            src={logoUrl}
            alt={appName}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover ${sizeCfg.img} ${imgClassName}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="leading-none">{emoji}</span>
        )}
      </div>

      {showText && (
        <span
          className={`font-display font-black tracking-tight text-neutral-900 dark:text-white ${textClassName}`}
        >
          {appName}
        </span>
      )}
    </div>
  );
};
