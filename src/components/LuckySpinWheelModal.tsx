import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, Gift, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LuckySpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIZES = [
  { label: '500 Pts', points: 500, color: '#10b981', text: '#ffffff' },
  { label: '10% OFF', discount: 10, color: '#f59e0b', text: '#ffffff' },
  { label: '1,000 Pts', points: 1000, color: '#3b82f6', text: '#ffffff' },
  { label: 'Free Drink', freeItem: 'Soda / Juice', color: '#8b5cf6', text: '#ffffff' },
  { label: '250 Pts', points: 250, color: '#06b6d4', text: '#ffffff' },
  { label: '15% OFF', discount: 15, color: '#ef4444', text: '#ffffff' },
  { label: '2,000 Pts', points: 2000, color: '#eab308', text: '#000000' },
  { label: 'Chips Bure', freeItem: 'Chips Mayai', color: '#ec4899', text: '#ffffff' }
];

export const LuckySpinWheelModal: React.FC<LuckySpinWheelModalProps> = ({ isOpen, onClose }) => {
  const { applyPromoCode } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const degreesPerSlice = 360 / PRIZES.length;
    const extraSpins = 5 * 360;
    const targetAngle = extraSpins + (360 - prizeIndex * degreesPerSlice - degreesPerSlice / 2);

    setRotation(prev => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize.label);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (prize.discount) {
        applyPromoCode(`SPIN${prize.discount}`);
      }
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-[#111723] rounded-3xl border border-neutral-700/80 shadow-2xl p-6 text-white text-center flex flex-col items-center relative animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-2 border border-amber-500/30">
          🎡
        </div>

        <h2 className="text-lg font-black font-display text-white">
          Gurudumu la Bahati (Lucky Wheel)
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5 mb-4">
          Zungusha ujishindie pointi za Zebra, punguzo au kinywaji cha bure!
        </p>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          {/* Top Pointer */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 filter drop-shadow"></div>

          {/* Rotating Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden relative transition-transform duration-[4000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {PRIZES.map((p, idx) => {
              const angle = (360 / PRIZES.length) * idx;
              return (
                <div
                  key={idx}
                  className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center text-[10px] font-black select-none"
                  style={{
                    backgroundColor: p.color,
                    color: p.text,
                    transform: `rotate(${angle}deg) skewY(-45deg)`
                  }}
                >
                  <span className="transform rotate-45 -translate-y-6 translate-x-2 font-bold whitespace-nowrap">
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub */}
          <div className="absolute w-12 h-12 rounded-full bg-neutral-900 border-2 border-amber-400 flex items-center justify-center z-10 shadow-lg text-sm font-black">
            🦓
          </div>
        </div>

        {/* Won Prize Notice */}
        {wonPrize && (
          <div className="my-3 p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce-once">
            🎉 Hongera! Umejishindia: <span className="text-white font-black">{wonPrize}</span>
          </div>
        )}

        {/* Spin Button */}
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSpinning ? 'Inazunguka...' : 'Zungusha Sasa (Spin Now)'}
        </button>
      </div>
    </div>
  );
};
