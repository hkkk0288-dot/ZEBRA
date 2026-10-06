import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Gift,
  CheckCircle2,
  Copy,
  PartyPopper,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playCelebrationFanfare } from '../utils/soundEffects';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REWARDS = [
  {
    code: 'KOOKOOS15',
    title: 'Punguzo la 15%!',
    description: 'Punguzo la 15% kwenye Boksi yoyote ya Kookoos Bomba au Bahati!',
    icon: '🍗'
  },
  {
    code: 'FREEDRINK',
    title: 'Soda au Mocktail ya Bure!',
    description: 'Pata kinywaji freshi cha baridi bure unapoagiza chakula chochote!',
    icon: '🥤'
  },
  {
    code: 'BONUS200',
    title: 'Pointi 200 za Kookoos!',
    description: 'Kookoos Points 200 zimeongezwa kwenye akaunti yako tayari kutumika kama pesa taslimu!',
    icon: '🪙'
  },
  {
    code: 'BOMBAFREE',
    title: 'Chipsi Kubwa ya Bure!',
    description: 'Bure portion kubwa ya chipsi freshi za Kookoos unapoagiza kuku!',
    icon: '🍟'
  }
];

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({ isOpen, onClose }) => {
  const { theme, applyPromoCode, addLoyaltyPoints, appBranding } = useApp();
  const isDark = theme === 'dark';

  const [reward] = useState(() => REWARDS[Math.floor(Math.random() * REWARDS.length)]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Initialize Scratch Canvas
  useEffect(() => {
    if (!isOpen) {
      setIsRevealed(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas accurately
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with metallic silver / golden scratch coating
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#a8a29e');
    grad.addColorStop(0.3, '#d6d3d1');
    grad.addColorStop(0.6, '#a8a29e');
    grad.addColorStop(1, '#78716c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative text on coating
    ctx.fillStyle = '#44403c';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ JIKUNE HAPA KUSHINDA! ✨', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '11px sans-serif';
    ctx.fillText('(Swipe / Parura kwa kidole chako)', canvas.width / 2, canvas.height / 2 + 15);
  }, [isOpen]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check how much is scratched
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentPixels = 0;
      for (let i = 3; i < imgData.data.length; i += 16) {
        if (imgData.data[i] === 0) transparentPixels++;
      }
      const totalSampled = imgData.data.length / 16;
      if (transparentPixels / totalSampled > 0.45 && !isRevealed) {
        handleReveal();
      }
    } catch {}
  };

  const handleReveal = () => {
    setIsRevealed(true);
    playCelebrationFanfare();
    if (reward.code === 'BONUS200') {
      addLoyaltyPoints(200);
    }
  };

  const handleApplyNow = () => {
    applyPromoCode(reward.code);
    setCopied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col relative ${
          isDark ? 'bg-[#151518] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Confetti badge at top */}
        <div className="p-5 text-center space-y-2 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-amber-500/10 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-2xl shadow-sm">
            🎁
          </div>
          <h3 className="font-extrabold text-base sm:text-lg font-display">
            Kadi ya Zawadi ya Kujikuna (Scratch & Win)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            Asante kwa kuagiza {appBranding.appName}! Parura kadi hapa chini kufungua zawadi yako maalum:
          </p>
        </div>

        {/* Scratch Card Interactive Area */}
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/40 bg-gradient-to-tr from-amber-500/20 via-emerald-500/15 to-amber-500/10 flex items-center justify-center p-4 text-center shadow-inner">
            {/* The prize hidden underneath */}
            <div className="space-y-2 select-none">
              <span className="text-4xl block animate-bounce">{reward.icon}</span>
              <h4 className="font-black text-lg text-emerald-500 tracking-tight">
                {reward.title}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium max-w-xs">
                {reward.description}
              </p>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-black/40 text-amber-400 font-mono font-black text-xs border border-amber-400/30">
                <span>KODI:</span>
                <span>{reward.code}</span>
              </div>
            </div>

            {/* Silver Scratch Canvas Covering the Prize */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-500 ${
                isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              onMouseDown={e => {
                isDrawingRef.current = true;
                scratch(e.clientX, e.clientY);
              }}
              onMouseMove={e => {
                if (isDrawingRef.current) scratch(e.clientX, e.clientY);
              }}
              onMouseUp={() => {
                isDrawingRef.current = false;
              }}
              onTouchStart={e => {
                isDrawingRef.current = true;
                const touch = e.touches[0];
                scratch(touch.clientX, touch.clientY);
              }}
              onTouchMove={e => {
                if (isDrawingRef.current) {
                  const touch = e.touches[0];
                  scratch(touch.clientX, touch.clientY);
                }
              }}
              onTouchEnd={() => {
                isDrawingRef.current = false;
              }}
            />
          </div>

          {!isRevealed && (
            <button
              type="button"
              onClick={handleReveal}
              className="mt-3 text-[11px] font-bold text-amber-500 hover:text-amber-400 underline cursor-pointer"
            >
              Au bofya hapa kufungua zawadi moja kwa moja
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Funga
          </button>

          <button
            type="button"
            onClick={handleApplyNow}
            disabled={!isRevealed}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-xs shadow-md shadow-emerald-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{copied ? 'Kodi Imewekwa! ✓' : 'Weka Punguzo Hili'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
