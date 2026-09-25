import React, { useState } from 'react';
import {
  Globe2,
  X,
  Maximize,
  Minimize,
  Navigation,
  Compass,
  MapPin,
  ChevronRight,
  Clock,
  Phone
} from 'lucide-react';
import { InteractiveLiveMap, MapPreset } from './InteractiveLiveMap';

export type MapLayerKey = MapPreset;

interface GlobalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  initialMode?: MapPreset;
}

export const GlobalMapModal: React.FC<GlobalMapModalProps> = ({
  isOpen,
  onClose,
  isDark,
  initialMode = 'tanganyika_east_africa'
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<MapPreset>(initialMode);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  if (!isOpen) return null;

  const branches = [
    {
      id: 'masaki',
      name: 'Masaki Central HQ',
      area: 'Toure Dr, Masaki Peninsula',
      phone: '+255 712 345 678',
      hours: '10:00 - 00:00',
      tag: 'Main Hub • Peninsula'
    },
    {
      id: 'kariakoo',
      name: 'Kariakoo Express Hub',
      area: 'Uhuru St & China Plaza',
      phone: '+255 744 883 291',
      hours: '08:00 - 23:00',
      tag: 'Fast Delivery • City'
    },
    {
      id: 'oysterbay',
      name: 'Oysterbay Gourmet Grill',
      area: 'Haile Selassie Rd',
      phone: '+255 755 112 233',
      hours: '11:00 - 00:00',
      tag: 'BBQ & Smash Burgers'
    },
    {
      id: 'slipway',
      name: 'Slipway Waterfront',
      area: 'Msasani Bay Waterfront',
      phone: '+255 788 990 011',
      hours: '12:00 - 01:00',
      tag: 'Ocean Seafood & Drinks'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div
        className={`w-full rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-2 max-w-none max-h-none h-[calc(100vh-16px)]'
            : 'max-w-6xl max-h-[95vh]'
        } ${
          isDark
            ? 'bg-[#10131a] border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
              🗺️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-lg font-display">
                  Ramani Halisi ya Moja kwa Moja (Live Interactive Maps)
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  Current GPS & Live Tiles
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate max-w-[280px] sm:max-w-xl">
                Ramani halisi shirikishi: Mitaani ya Mikocheni, Ukanda wa Morogoro, Tanzania nzima na ulimwengu
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
              title={isFullscreen ? 'Toka Skrini Kamili' : 'Skrini Kamili'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title="Funga"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Map Body - 100% Live Interactive Map */}
        <div className="p-2 sm:p-4 space-y-3 flex-1 flex flex-col min-h-0 overflow-y-auto">
          <InteractiveLiveMap
            initialPreset={initialMode}
            className={`w-full ${isFullscreen ? 'h-[calc(100vh-200px)] min-h-[500px]' : 'h-[460px] sm:h-[540px]'}`}
            isDark={isDark}
            onSelectLocation={loc => setSelectedBranch(loc.id)}
          />

          {/* Kitchen Branch Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {branches.map(b => (
              <div
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  selectedBranch === b.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-white'
                    : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="font-bold text-emerald-400">{b.tag}</span>
                  <span className="text-neutral-400">{b.hours}</span>
                </div>
                <div className="font-bold text-white truncate">{b.name}</div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5">{b.area}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
