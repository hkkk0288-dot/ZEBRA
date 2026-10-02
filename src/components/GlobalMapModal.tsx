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
  Phone,
  ArrowLeft
} from 'lucide-react';
import { InteractiveLiveMap, MapPreset } from './InteractiveLiveMap';
import { useApp } from '../context/AppContext';

export type MapLayerKey = MapPreset;

interface GlobalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  initialMode?: MapPreset;
  onOpenLocationPicker?: () => void;
}

export const GlobalMapModal: React.FC<GlobalMapModalProps> = ({
  isOpen,
  onClose,
  isDark,
  initialMode = 'mikocheni_street',
  onOpenLocationPicker
}) => {
  const { appBranding, setShowLocationPickerModal } = useApp();
  const isMulti = appBranding.restaurantMode === 'multi';
  const activeBranches = (appBranding.branches || []).filter(b => b.active !== false);
  const showBranchMap = isMulti && activeBranches.length > 0;

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<MapPreset>(initialMode);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  if (!isOpen) return null;

  const branches = activeBranches;

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
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-neutral-800/80 shrink-0 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Back Button (Prominent Rudi Button) */}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 shrink-0 border border-neutral-700 shadow-sm"
              title="Rudi Nyuma (Back)"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Rudi</span>
            </button>

            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg sm:text-xl shrink-0">
              🗺️
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-xs sm:text-base font-display truncate">
                  {isSingle ? 'Eneo la Mgahawa & Ramani' : 'Ramani ya Matawi (Live Branches)'}
                </h3>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  {isSingle ? 'Single Restaurant' : 'Multi-Hub'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 truncate max-w-[200px] sm:max-w-md">
                {isSingle ? 'Zebra Masaki HQ & Eneo la kuletewa chakula' : 'Matawi ya Mikocheni, Masaki, Kariakoo na Morogoro'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Switch to customer delivery location picker */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenLocationPicker) {
                  onOpenLocationPicker();
                } else {
                  setShowLocationPickerModal(true);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer active:scale-95"
              title="Badilisha eneo lako la delivery"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Eneo Langu</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
              title={isFullscreen ? 'Toka Skrini Kamili' : 'Skrini Kamili'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title="Funga"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Map Body - 100% Live Interactive Map */}
        {!showBranchMap ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl">
              🏪
            </div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
              Ramani ya Matawi Haipatikani
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Mfumo umewekwa kwenye hali ya <strong>Single Restaurant</strong> au admin hajaweka tawi lolote. Wateja wanachagua eneo lao la kuletewa chakula (Delivery Location).
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setShowLocationPickerModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs transition-all cursor-pointer"
              >
                Chagua Eneo la Delivery
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-all cursor-pointer"
              >
                Funga
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 sm:p-4 space-y-3 flex-1 flex flex-col min-h-0 overflow-y-auto">
            <InteractiveLiveMap
              initialPreset={initialMode}
              className={`w-full ${isFullscreen ? 'h-[calc(100vh-200px)] min-h-[500px]' : 'h-[460px] sm:h-[540px]'}`}
              isDark={isDark}
              branches={branches}
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
        )}
      </div>
    </div>
  );
};
