import React, { useState, useEffect } from 'react';
import {
  X,
  Navigation,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Store,
  MapPin,
  Compass,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Order } from '../types';
import { InteractiveLiveMap } from './InteractiveLiveMap';
import { useApp } from '../context/AppContext';

interface LiveRiderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveRiderTrackerModal: React.FC<LiveRiderTrackerModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { theme, customerDeliveryLocation, appBranding } = useApp();
  const isDark = theme === 'dark';

  const [etaMinutes, setEtaMinutes] = useState(14);
  const [currentStage, setCurrentStage] = useState<number>(3); // 1: Received, 2: Kitchen, 3: On The Way, 4: Delivered
  const [riderProgress, setRiderProgress] = useState(35); // 0 to 100%

  // Simulation timer for rider movement
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setRiderProgress(prev => {
        if (prev >= 98) {
          setCurrentStage(4);
          setEtaMinutes(0);
          return 100;
        }
        const next = prev + 1.5;
        const remainingTime = Math.max(1, Math.round(15 * (1 - next / 100)));
        setEtaMinutes(remainingTime);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const orderNum = order.orderNumber || 'ORD-9821';
  const deliveryAddr = order.deliveryAddress || customerDeliveryLocation || 'Masaki, Dar es Salaam';

  const handleCallRider = () => {
    window.location.href = 'tel:+255712345678';
  };

  const handleWhatsAppRider = () => {
    const text = `Habari Juma! Ninafuatilia oda yangu ya Zebra Restaurant #${orderNum}. Nipo hapa ${deliveryAddr}.`;
    window.open(`https://wa.me/255712345678?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[95vh] ${
          isDark ? 'bg-[#121316] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xl shrink-0">
              🛵
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base font-display">
                  Ufuatiliaji wa Dereva (Live Rider Tracker)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] animate-pulse">
                  ● LIVE GPS
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Oda #{orderNum} • {order.items.length} Vipengele
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Live Progress Bar Steps */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-500 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentStage === 4
                    ? 'Chakula Kimewasili!'
                    : `Dereva yuko safarini • Makadirio: Dakika ${etaMinutes}`}
                </span>
              </span>
              <span className="text-neutral-400 font-mono">{Math.round(riderProgress)}%</span>
            </div>

            {/* Track bar */}
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${riderProgress}%` }}
              />
            </div>

            {/* Stages indicators */}
            <div className="grid grid-cols-4 gap-1 text-center pt-1 text-[10px] sm:text-[11px]">
              <div className="space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-emerald-500 text-neutral-950 font-black flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Imepokelewa</span>
              </div>

              <div className="space-y-1">
                <span className="w-5 h-5 mx-auto rounded-full bg-emerald-500 text-neutral-950 font-black flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Jikoni</span>
              </div>

              <div className="space-y-1">
                <span
                  className={`w-5 h-5 mx-auto rounded-full font-black flex items-center justify-center text-[10px] ${
                    currentStage >= 3
                      ? 'bg-emerald-500 text-neutral-950 animate-bounce'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-400'
                  }`}
                >
                  🛵
                </span>
                <span className="font-bold text-emerald-500">Njia Kuu</span>
              </div>

              <div className="space-y-1">
                <span
                  className={`w-5 h-5 mx-auto rounded-full font-black flex items-center justify-center text-[10px] ${
                    currentStage === 4
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-400'
                  }`}
                >
                  🏠
                </span>
                <span
                  className={`font-bold ${
                    currentStage === 4 ? 'text-emerald-500' : 'text-neutral-400'
                  }`}
                >
                  Imefika
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Live Map with Animated Rider Route */}
          <div className="rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-700 relative h-60 sm:h-72">
            <InteractiveLiveMap
              className="w-full h-full"
              isDark={isDark}
              branches={appBranding.branches}
            />

            {/* Floating Live Rider Badge on Map */}
            <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center space-x-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Boda Boda: Juma Rashid</span>
              <span className="text-amber-400 font-mono">36 km/h</span>
            </div>

            {/* Destination Floating Badge */}
            <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center space-x-1.5 shadow-lg max-w-[220px] truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{deliveryAddr}</span>
            </div>
          </div>

          {/* Rider Profile Card & Contact Actions */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 p-0.5 shadow-md shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Rider Juma"
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                    Juma Rashid
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
                    ⭐ 4.9 (420+ Oda)
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  🏍️ Bajaj Boxer 150 • Namba: <strong className="font-mono text-neutral-800 dark:text-neutral-200">MC 419 EAY</strong>
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  🛡️ Dereva rasmi aliyethibitishwa wa Zebra Delivery
                </p>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleCallRider}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Piga Simu</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppRider}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Kituo Kikuu: Zebra Central Masaki Kitchen</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-emerald-500 hover:text-emerald-400 cursor-pointer"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};
