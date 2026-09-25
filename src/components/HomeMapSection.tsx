import React from 'react';
import {
  Compass,
  Maximize2,
  Navigation,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { InteractiveLiveMap, MapPreset } from './InteractiveLiveMap';

interface HomeMapSectionProps {
  onOpenFullMap: (initialPreset?: MapPreset) => void;
  isDark: boolean;
}

export const HomeMapSection: React.FC<HomeMapSectionProps> = ({
  onOpenFullMap,
  isDark
}) => {
  return (
    <section className="w-full my-6 sm:my-8">
      <div
        className={`rounded-3xl border overflow-hidden shadow-2xl transition-all ${
          isDark
            ? 'bg-gradient-to-b from-[#10131a] via-[#0d1017] to-[#080b10] border-neutral-800'
            : 'bg-gradient-to-b from-neutral-50 via-white to-neutral-100 border-neutral-200'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 shrink-0">
              🗺️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-xl font-bold font-display text-neutral-900 dark:text-white">
                  Ramani Halisi ya Moja kwa Moja (Live Interactive Maps)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  Current GPS
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Ramani ya Ziwa Tanganyika & Afrika Mashariki, Mikocheni Mitaani, Morogoro na Tanzania
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onOpenFullMap('tanganyika_east_africa')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/25 active:scale-95 shrink-0"
              title="Fungua Ramani Kamili ya Skrini Kubwa"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Skrini Kubwa (Fullscreen)</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Leaflet Map right on the page */}
        <div className="p-3 sm:p-5">
          <InteractiveLiveMap
            initialPreset="tanganyika_east_africa"
            className="h-[420px] sm:h-[520px]"
            isDark={isDark}
            onSelectLocation={loc => {
              // Location selected
            }}
          />
        </div>
      </div>
    </section>
  );
};
