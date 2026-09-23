import React, { useState } from 'react';
import {
  Globe2,
  MapPin,
  X,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation2
} from 'lucide-react';
import { DarEsSalaamMap } from './DarEsSalaamMap';

interface GlobalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const GlobalMapModal: React.FC<GlobalMapModalProps> = ({
  isOpen,
  onClose,
  isDark
}) => {
  const [mapMode, setMapMode] = useState<'standard' | 'world_overview'>('standard');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-5">
      <div
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[95vh] ${
          isDark
            ? 'bg-[#121215] border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg font-display">
                  Ramani ya Dunia & Dar es Salaam
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  Global & Local View
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Ramani kamili ya kijiografia yenye mipaka ya nchi, bahari, na maeneo ya Dar es Salaam
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View switcher: Interactive Live Map vs Global World Map */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setMapMode('standard')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  mapMode === 'standard'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Interactive GPS
              </button>
              <button
                type="button"
                onClick={() => setMapMode('world_overview')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
                  mapMode === 'world_overview'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🌍 Ramani ya Dunia</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Funga"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {mapMode === 'standard' ? (
            <div className="space-y-3">
              <DarEsSalaamMap
                customerLocationName="Upanga / Kariakoo / Masaki"
                orderNumber="DAR-MAP"
                etaMinutes={15}
                riderProgress={60}
                className="h-[460px] sm:h-[520px]"
              />

              <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 px-1">
                <span className="flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Unaweza kukuza (zoom in) hadi mitaani au kupunguza (zoom out) hadi ramani nzima ya Afrika na Dunia.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMapMode('world_overview')}
                  className="text-amber-400 hover:underline font-bold flex items-center space-x-1"
                >
                  <span>Tazama Ramani ya Picha ya Dunia ➔</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* High Quality World Map Image matching user's exact uploaded image */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#0c131a] shadow-inner max-h-[540px] flex items-center justify-center">
                <img
                  src="/world_map.png"
                  alt="Ramani ya Dunia"
                  className="w-full h-auto object-contain max-h-[520px]"
                />
                
                {/* Floating overlay pin on Tanzania / Dar es Salaam */}
                <div className="absolute top-[65%] left-[58%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative flex flex-col items-center">
                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-75"></span>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500 text-neutral-950 font-black text-[11px] shadow-2xl border-2 border-white flex items-center space-x-1 whitespace-nowrap z-10 animate-bounce">
                      <span>📍</span>
                      <span>Zebra (Dar es Salaam, Tanzania)</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-neutral-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-700/60 text-[11px] text-neutral-200">
                  🌍 Global Cartographic View • Afrika, Bahari na Nchi zote
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span>Ramani halisi ya dunia inayoonyesha mabara, bahari na nchi kijiografia.</span>
                <button
                  type="button"
                  onClick={() => setMapMode('standard')}
                  className="text-emerald-400 hover:underline font-bold flex items-center space-x-1"
                >
                  <span>Rudi kwenye Ramani ya GPS ya Mtaani ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Branch badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-emerald-500/30 transition-colors">
              <span className="font-bold text-amber-400 block">🍕 Masaki Kitchen</span>
              <span className="text-[11px] text-neutral-400">Toure Dr, Masaki Peninsula</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-emerald-500/30 transition-colors">
              <span className="font-bold text-amber-400 block">🥩 Kariakoo Hub</span>
              <span className="text-[11px] text-neutral-400">China Plaza & Uhuru St</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-emerald-500/30 transition-colors">
              <span className="font-bold text-emerald-400 block">🍔 Oysterbay Bistro</span>
              <span className="text-[11px] text-neutral-400">Haile Selassie Rd</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-emerald-500/30 transition-colors">
              <span className="font-bold text-purple-400 block">🐟 Slipway Ocean</span>
              <span className="text-[11px] text-neutral-400">Msasani Bay Waterfront</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
