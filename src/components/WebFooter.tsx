import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Clock,
  Smartphone,
  ShieldCheck,
  Heart,
  ChevronRight
} from 'lucide-react';

export const WebFooter: React.FC = () => {
  const { setActiveTab, setSelectedCategory, theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <footer
      className={`w-full mt-16 border-t transition-colors ${
        isDark ? 'bg-[#0a0a0c] border-neutral-800 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="text-3xl">🦓</span>
              <div>
                <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-white">
                  Zebra Restaurant
                </h3>
                <p className="text-xs text-emerald-500 font-semibold">
                  Dar es Salaam Premier Food Delivery
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Serving the finest stone-baked pizzas, gourmet smash burgers, authentic Swahili Biryani, 
              Mishkaki, and refreshing tropical smoothies crafted from fresh Tanzanian ingredients.
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="text-amber-500">👨‍💻</span>
                <span className="text-neutral-300">
                  Developed by <strong className="text-amber-400">AmourCodes</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: USSD & Mobile Money Payment */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>USSD Mobile Money</span>
            </h4>
            <p className="text-xs text-neutral-400">
              Pay quickly and securely without internet or using native mobile money:
            </p>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex justify-between items-center">
                <span className="text-neutral-400">Till (Lipa Namba):</span>
                <span className="text-emerald-400 font-bold text-sm">445566</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-300 space-y-0.5">
                <p>• Vodacom M-Pesa: *150*00#</p>
                <p>• Tigo Pesa: *150*01#</p>
                <p>• Airtel Money: *150*60#</p>
                <p>• HaloPesa: *150*88#</p>
              </div>
            </div>
          </div>

          {/* Col 3: Branches & Kitchen Hubs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Kitchen Branches</span>
            </h4>

            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">📍</span>
                <div>
                  <strong className="text-neutral-200">Masaki Central Hub:</strong>
                  <p>Toure Drive, Masaki Peninsula</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">📍</span>
                <div>
                  <strong className="text-neutral-200">Oysterbay Grill:</strong>
                  <p>Haile Selassie Road</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">📍</span>
                <div>
                  <strong className="text-neutral-200">Slipway Beach Kitchen:</strong>
                  <p>Msasani Peninsula Waterfront</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Hours & Support</span>
            </h4>

            <div className="text-xs text-neutral-400 space-y-1">
              <p>Monday - Sunday: <strong className="text-neutral-200">10:00 AM - Midnight</strong></p>
              <p>Hotline: <strong className="text-emerald-400 font-mono">+255 712 345 678</strong></p>
              <p>WhatsApp: <strong className="text-emerald-400 font-mono">+255 744 883 291</strong></p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory('pizza');
                  setActiveTab('home');
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Pizza
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('fast_food');
                  setActiveTab('home');
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Burgers
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('swahili');
                  setActiveTab('home');
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Swahili BBQ
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-bold"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Zebra Restaurant. All rights reserved. Dar es Salaam, Tanzania.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <strong className="text-amber-400 font-bold">AmourCodes</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
