import React, { useState } from 'react';

interface FoodAppMascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export const FoodAppMascot: React.FC<FoodAppMascotProps> = ({
  size = 'md',
  className = '',
  showSubtitle = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36 sm:w-40 sm:h-40',
    lg: 'w-48 h-48 sm:w-52 sm:h-52'
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Warm Golden Radial Ambient Glow */}
      <div className="absolute -inset-4 bg-gradient-to-b from-amber-500/25 via-yellow-500/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Mascot Illustration */}
      <div className={`relative ${sizeClasses[size]} transition-transform duration-300 hover:scale-105 select-none drop-shadow-[0_10px_20px_rgba(245,158,11,0.3)]`}>
        {imageLoaded ? (
          <img
            src="/chef_mascot.jpg"
            alt="Food App Chef Mascot"
            className="w-full h-full object-contain rounded-full"
            onError={() => setImageLoaded(false)}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High-Fidelity Custom Vector Mascot Matching Screenshot */
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              {/* Sunburst Background Gradient */}
              <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffb020" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>

              {/* Cloche Silver Gradient */}
              <linearGradient id="silverPlatter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#e2e8f0" />
                <stop offset="70%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              {/* Food Text Gradient (Orange-Gold) */}
              <linearGradient id="foodTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              {/* App Text Gradient (Bright Green) */}
              <linearGradient id="appTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>

              <filter id="mascotGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Circular Badge Outer Glow Ring */}
            <circle cx="100" cy="100" r="92" fill="url(#sunburstGrad)" stroke="#fde68a" strokeWidth="4" />

            {/* Inner radiating food platter leaves/sunburst rays */}
            <g opacity="0.35">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                <circle
                  key={deg}
                  cx={100 + 72 * Math.cos((deg * Math.PI) / 180)}
                  cy={100 + 72 * Math.sin((deg * Math.PI) / 180)}
                  r="16"
                  fill="#fef08a"
                />
              ))}
            </g>

            {/* Chef Boy Character */}
            {/* Chef Hat (Puffy Toque) */}
            <g>
              <ellipse cx="100" cy="46" rx="36" ry="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <ellipse cx="80" cy="42" rx="20" ry="18" fill="#ffffff" />
              <ellipse cx="120" cy="42" rx="20" ry="18" fill="#ffffff" />
              <rect x="76" y="52" width="48" height="14" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            </g>

            {/* Hair */}
            <path
              d="M74 65 Q100 56 126 65 Q130 84 122 88 Q118 78 112 76 Q100 78 88 76 Q82 80 78 88 Z"
              fill="#78350f"
            />

            {/* Face */}
            <ellipse cx="100" cy="85" rx="26" ry="22" fill="#fed7aa" />

            {/* Smiling / Winking Eyes */}
            {/* Left eye: wide open & smiling */}
            <ellipse cx="90" cy="83" rx="4" ry="5.5" fill="#1e1b4b" />
            <circle cx="91.5" cy="81.5" r="1.5" fill="#ffffff" />

            {/* Right eye: cute winking arc */}
            <path
              d="M107 84 Q112 78 116 84"
              fill="none"
              stroke="#1e1b4b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Eyebrows */}
            <path d="M85 76 Q90 73 95 76" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d="M106 75 Q111 72 116 75" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <ellipse cx="84" cy="90" rx="4.5" ry="2.5" fill="#f87171" opacity="0.6" />
            <ellipse cx="116" cy="90" rx="4.5" ry="2.5" fill="#f87171" opacity="0.6" />

            {/* Happy Open Mouth */}
            <path d="M94 92 Q100 100 106 92 Z" fill="#dc2626" />
            <path d="M96 95 Q100 97 104 95" fill="#fda4af" />

            {/* Red Neckerchief */}
            <polygon points="100,105 88,114 96,118 100,111 104,118 112,114" fill="#dc2626" />
            <circle cx="100" cy="110" r="3.5" fill="#b91c1c" />

            {/* Chef Double-Breasted Jacket */}
            <path
              d="M80 114 Q100 110 120 114 L126 142 Q100 148 74 142 Z"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            {/* Jacket buttons */}
            <circle cx="94" cy="120" r="1.5" fill="#475569" />
            <circle cx="106" cy="120" r="1.5" fill="#475569" />
            <circle cx="94" cy="128" r="1.5" fill="#475569" />
            <circle cx="106" cy="128" r="1.5" fill="#475569" />

            {/* Left Arm holding Silver Serving Dome (Cloche) */}
            <g>
              {/* Arm reaching out */}
              <path d="M120 116 Q138 110 148 102" fill="none" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
              {/* Sleeve */}
              <path d="M120 116 Q128 112 134 110" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
              
              {/* Silver Cloche Dome */}
              <ellipse cx="152" cy="100" rx="22" ry="7" fill="#64748b" />
              <path
                d="M130 100 Q152 70 174 100 Z"
                fill="url(#silverPlatter)"
                stroke="#475569"
                strokeWidth="1.5"
              />
              {/* Handle knob */}
              <circle cx="152" cy="74" r="3.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
              {/* Steam aroma curves */}
              <path d="M148 68 Q144 62 148 56" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <path d="M156 66 Q160 60 156 54" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            </g>

            {/* Green Basil/Lettuce Garnish on left */}
            <g transform="translate(62, 126)">
              <ellipse cx="0" cy="0" rx="10" ry="6" fill="#22c55e" transform="rotate(-25)" />
              <ellipse cx="6" cy="-4" rx="8" ry="5" fill="#16a34a" transform="rotate(15)" />
            </g>

            {/* 3D "Food App" Logo Plaque across the bottom */}
            <g transform="translate(100, 160)" filter="url(#mascotGlow)">
              {/* Plaque Background Banner */}
              <rect
                x="-80"
                y="-18"
                width="160"
                height="36"
                rx="18"
                fill="#ffffff"
                stroke="#f59e0b"
                strokeWidth="3"
              />

              {/* "Food" Text */}
              <text
                x="-36"
                y="6"
                textAnchor="middle"
                fontSize="22"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="url(#foodTextGrad)"
                stroke="#ffffff"
                strokeWidth="1"
              >
                Food
              </text>

              {/* "App" Text */}
              <text
                x="34"
                y="6"
                textAnchor="middle"
                fontSize="22"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="url(#appTextGrad)"
                stroke="#ffffff"
                strokeWidth="1"
              >
                App
              </text>
            </g>
          </svg>
        )}
      </div>

      {showSubtitle && (
        <p className="mt-2 text-xs font-semibold text-amber-400/90 tracking-wider uppercase">
          Zebra Restaurant • Dar es Salaam
        </p>
      )}
    </div>
  );
};
